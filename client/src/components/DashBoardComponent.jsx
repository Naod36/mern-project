import React, { useEffect, useState } from "react";
import { HiArrowNarrowUp, HiOutlineUserGroup } from "react-icons/hi";
import { useSelector } from "react-redux";

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
    <div className="p-3 md:mx-auto">
      <div className="flex-wrap flex gap-4 justify-center">
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
    </div>
  );
}
