import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Table, Button } from "flowbite-react";
import { Link, useParams } from "react-router-dom";
import { HiOutlineExclamation } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css";

import io from "socket.io-client";

const socket = io("http://localhost:3000"); // Adjust the URL if needed

export default function DashCases() {
  const { currentUser } = useSelector((state) => state.user);
  const [userCases, setUserCases] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [caseIdToDelete, setCaseIdToDelete] = useState("");
  const { caseId } = useParams();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await fetch(`/api/case/my-cases`);
        const data = await res.json();
        if (res.ok) {
          setUserCases(data.mycases);
          console.log(data.mycases);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchCases();

    // Set up socket connection and event listeners for submiter but delet this if i end up using room
    socket.on("stateUpdated", (updatedCase) => {
      setUserCases((prevCases) =>
        prevCases.map((caseItem) =>
          caseItem._id === updatedCase._id ? updatedCase : caseItem
        )
      );
      // toast.success("Case Notification");
      // Check if the updated case belongs to the current user or is assigned to the current user
      if (
        updatedCase.userId === currentUser._id ||
        updatedCase.judgeId === currentUser._id
      ) {
        toast.success("Case Notification");
      }
    });

    return () => {
      socket.off("stateUpdated");
    };
  }, [currentUser._id]);
  const handleShowMore = async () => {
    const startIndex = userCases.length;
    try {
      const res = await fetch(
        `/api/case/getcasetemplates?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserCases((prev) => [...prev, ...data.mycases]);
        if (data.mycases.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getStyle = (state) => {
    switch (state) {
      case "approved":
        return { color: "green", fontWeight: "bold" };

      case "denied":
        return { color: "red", fontWeight: "bold" };
      case "closed":
        return { color: "gray", fontWeight: "bold" };
      default:
        return { color: "orange", fontWeight: "bold" };
    }
  };

  const handleDeleteMyCase = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/case/deletemycase/${caseIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserCases((prev) =>
          prev.filter((mycases) => mycases._id !== caseIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  // toast.info({
  //   position: "top-right",
  //   autoClose: 15000,
  //   hideProgressBar: false,
  //   closeOnClick: true,
  //   pauseOnHover: true,
  //   draggable: true,
  //   progress: undefined,
  //   theme: "dark",
  // });
  return (
    <div className="w-full overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {userCases.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Submited</Table.HeadCell>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Status</span>
              </Table.HeadCell>
              <Table.HeadCell>
                <span>{caseId}</span>
              </Table.HeadCell>
            </Table.Head>
            {userCases.map((caseTemplate) => (
              <Table.Body
                key={caseTemplate._id}
                className="divide-y divide-gray-200 dark:divide-gray-700"
              >
                <Table.Row className="bg-white dark:border-gray-800 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(caseTemplate.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(caseTemplate.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{caseTemplate.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCaseIdToDelete(caseTemplate._id);
                      }}
                      className="text-red-500 font-medium hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell style={getStyle(caseTemplate.state)}>
                    {caseTemplate.state}
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline"
                      to={`/my-case-check/${caseTemplate._id}`}
                    >
                      <span>View</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              className="text-teal-500 w-full self-center text-sm py-7"
              onClick={handleShowMore}
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p className="p-5 text-3xl  font-bold text-center mt-23">
          No Cases Yet
        </p>
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
              Are you sure you want to delete this Submited Case?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteMyCase}>
                Yes, Im Sure
              </Button>
              <Button onClick={() => setShowModal(false)} color="gray">
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <ToastContainer
      // position="top-right"
      // autoClose={15000}
      // hideProgressBar={false}
      // newestOnTop
      // closeOnClick
      // rtl={false}
      // pauseOnFocusLoss
      // draggable
      // pauseOnHover
      // theme="dark"
      />
    </div>
  );
}
