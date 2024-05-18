import React, { useEffect, useState } from "react";
import {
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

export default function DashBoardComponent() {
  const [users, setUsers] = useState([]);
  const [cases, setCases] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCases, setTotalCases] = useState(0);
  const [lastMonthCases, setLastMonthCases] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchCases = async () => {
      try {
        const res = await fetch(`/api/case/getAllAnswers?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setCases(data.answers);
          setTotalCases(data.totalAnswers);
          setLastMonthCases(data.lastMonthAnswers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
      fetchCases();
    }
  }, [currentUser]);

  return (
    <div className="p-3 md:mx-100%">
      <div className="flex-wrap flex gap-4 justify-between">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-80 w-full rounded-md shadow-md dark:text-white">
          <div className="flex  justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 text-white  rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              <p>{lastMonthUsers}</p>
            </span>
            <div className="text-gray-500">Last Monthe</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-80 w-full rounded-md shadow-md dark:text-white">
          <div className="flex  justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Cases</h3>
              <p className="text-2xl">{totalCases}</p>
            </div>
            <HiDocumentText className="bg-teal-600 text-white  rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              <p>{lastMonthCases}</p>
            </span>
            <div className="text-gray-500">Last Monthe</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-80 w-full rounded-md shadow-md dark:text-white">
          <div className="flex  justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Cases</h3>
              <p className="text-2xl">{totalCases}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 text-white  rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              <p>{lastMonthCases}</p>
            </span>
            <div className="text-gray-500">Last Monthe</div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 py-3 mx-full justify-center">
        <div className="flex flex-col w-full md:w-3/5 shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Case Submitions</h1>
            <Button outline gradientDuoTone="purpleToBlue">
              <Link to={"/dashboard?tab=case-submitions"}>See All</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Case Category</Table.HeadCell>

              <Table.HeadCell>Status</Table.HeadCell>
            </Table.Head>
            {cases &&
              cases.map((caseSubmitions) => (
                <Table.Body key={caseSubmitions._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="">
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
                    <Table.Cell className="">
                      <Link to={`/case-submition-review/${caseSubmitions._id}`}>
                        {caseSubmitions.category}
                      </Link>
                    </Table.Cell>

                    <Table.Cell className="">
                      <Link to={`/case-submition-review/${caseSubmitions._id}`}>
                        {caseSubmitions.state}
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        <div className="flex flex-col w-full md:w-1/3 shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Users</h1>
            <Button outline gradientDuoTone="purpleToBlue">
              <Link to={"/dashboard?tab=users"}>See All</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((user) => (
                <Table.Body key={user._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="">
                      <img
                        src={user.profilePicture}
                        alt="user"
                        className="w-10 h-10 rounded-full bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell className="">{user.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
}
