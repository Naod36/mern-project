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
        setUserCases((prev) => [...prev, ...data.answers]);
        if (data.answers.length < 9) {
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
  return (
    <div className="w-full overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userCases.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
            </Table.Head>
            {userCases.map(
              (caseSubmitions) => (
                console.log("case submitions", caseSubmitions),
                (
                  <Table.Body
                    key={caseSubmitions._id}
                    className="divide-y divide-gray-200 dark:divide-gray-700"
                  >
                    <Table.Row className="bg-white dark:border-gray-800 dark:bg-gray-800">
                      <Table.Cell>
                        {new Date(
                          caseSubmitions.updatedAt
                        ).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        <Link
                          to={`/case-submition-review/${caseSubmitions._id}`}
                        >
                          <img
                            src={caseSubmitions.userId.profilePicture}
                            alt={caseSubmitions.category}
                            className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                          />
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link
                          className="flex flex-col gap-1 font-medium text-gray-900 dark:text-white"
                          to={`/case-submition-review/${caseSubmitions._id}`}
                        >
                          {caseSubmitions.userId.username}{" "}
                          <span className="text-gray-300 dark:text-gray-400">
                            {caseSubmitions.userId.email}
                          </span>
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link
                          to={`/case-submition-review/${caseSubmitions._id}`}
                        >
                          {caseSubmitions.category}
                        </Link>
                      </Table.Cell>
                      <Table.Cell style={getStyle(caseSubmitions.state)}>
                        {caseSubmitions.state}
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                )
              )
            )}
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
          No Case Submitions Yet
        </p>
      )}
    </div>
  );
}
