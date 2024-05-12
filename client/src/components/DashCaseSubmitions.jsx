import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Table, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamation } from "react-icons/hi";

export default function DashCaseSubmitions() {
  const { currentUser } = useSelector((state) => state.user);
  const [userCases, setUserCases] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [caseIdToDelete, setCaseIdToDelete] = useState("");
  useEffect(() => {
    const fetchSubmitions = async () => {
      try {
        const res = await fetch(`/api/case/getAllAnswers`);
        const data = await res.json();
        if (res.ok) {
          setUserCases(data.answers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchSubmitions();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userCases.length;
    try {
      const res = await fetch(
        `/api/case/getAllAnswers?startIndex=${startIndex}` // Use '?' to separate base URL and query parameters
      );
      const data = await res.json();
      if (res.ok) {
        setUserCases((prev) => [...prev, ...data.cases]);
        if (data.cases.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="w-full overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userCases.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Case Image</Table.HeadCell>
              <Table.HeadCell>Case Filler</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userCases.map((caseTemplate) => (
              <Table.Body className="divide-y divide-gray-200 dark:divide-gray-700">
                <Table.Row className="bg-white dark:border-gray-800 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(caseTemplate.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/case/${caseTemplate._id}`}>
                      <img
                        src="https://media.istockphoto.com/id/1145122267/vector/law-order-court-symbols-vector-illustration.jpg?s=612x612&w=0&k=20&c=zUiwEJDkWJcI2p5fLRdbcBxwFONAampY8inYpol0v0g="
                        alt={caseTemplate.category}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/case/${caseTemplate._id}`}
                    >
                      {caseTemplate.names.firstName}
                    </Link>
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
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline"
                      to={`/update-post/${caseTemplate._id}`}
                    >
                      <span>Edit</span>
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
          No Case Template Yet
        </p>
      )}
    </div>
  );
}
