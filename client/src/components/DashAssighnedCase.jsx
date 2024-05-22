import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Table, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamation } from "react-icons/hi";

export default function DashAssignedCase() {
  const [assignedCases, setAssignedCases] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [caseIdToDelete, setCaseIdToDelete] = useState(null);
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const fetchAssignedCases = async () => {
      try {
        const response = await fetch(
          `/api/case/cases-assigned/${currentUser._id}`
        );
        const data = await response.json();
        setAssignedCases(data);
      } catch (error) {
        console.error("Error fetching assigned cases:", error);
      }
    };

    if (currentUser && currentUser.isJudge) {
      fetchAssignedCases();
    }
  }, [currentUser]);

  const handleDeleteMyCase = async () => {
    try {
      await fetch(`/api/deletemycase/${caseIdToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setAssignedCases(
        assignedCases.filter((caseItem) => caseItem._id !== caseIdToDelete)
      );
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting case:", error);
    }
  };

  const getStyle = (state) => {
    switch (state) {
      case "approved":
        return { color: "green", fontWeight: "bold" };
      case "denied":
        return { color: "red", fontWeight: "bold" };
      default:
        return { color: "orange", fontWeight: "bold" };
    }
  };

  return (
    <div className="w-full overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {assignedCases.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Submitted</Table.HeadCell>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>

              <Table.HeadCell className="text-center">Actions</Table.HeadCell>
            </Table.Head>
            {assignedCases.map((caseItem) => (
              <Table.Body
                key={caseItem._id}
                className="divide-y divide-gray-200 dark:divide-gray-700"
              >
                <Table.Row className="bg-white dark:border-gray-800 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(caseItem.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(caseItem.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{caseItem.category}</Table.Cell>

                  <Table.Cell className="flex items-center justify-between ">
                    <Link
                      className="text-teal-500 hover:underline"
                      to={`/assign-case-details/${caseItem._id}`}
                    >
                      View
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </>
      ) : (
        <p className="p-5 text-3xl font-bold text-center mt-23">No Cases Yet</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamation className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this submitted case?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteMyCase}>
                Yes, I'm sure
              </Button>
              <Button onClick={() => setShowModal(false)} color="gray">
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
