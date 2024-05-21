import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiArrowCircleRight,
  HiChartPie,
  HiDocumentText,
  HiOutlineUserGroup,
  HiUser,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";
import { useSelector } from "react-redux";
export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=dashboard-component">
              <Sidebar.Item
                active={tab === "dashboard-component" || !tab}
                icon={HiChartPie}
                as="div"
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isJudge && (
            <Link to="/dashboard?tab=Assigned-cases">
              <Sidebar.Item
                active={tab === "Assigned-cases" || !tab}
                icon={HiChartPie}
                as="div"
              >
                Assighned Cases
              </Sidebar.Item>
            </Link>
          )}

          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={
                currentUser.isJudge
                  ? "Judge"
                  : currentUser.isAdmin
                  ? "Admin"
                  : "User"
              }
              labelColor="dark"
              as="div"
              // href="/dashboard"
            >
              Profile
            </Sidebar.Item>
          </Link>

          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=case-templates">
              <Sidebar.Item
                active={tab === "case-templates"}
                icon={HiDocumentText}
                as="div"
              >
                Case Temp
              </Sidebar.Item>
            </Link>
          )}

          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=case-submitions">
              <Sidebar.Item
                active={tab === "case-submitions"}
                icon={HiDocumentText}
                as="div"
              >
                Case Submitions
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=users">
              <Sidebar.Item
                active={tab === "users"}
                icon={HiOutlineUserGroup}
                as="div"
              >
                Users
              </Sidebar.Item>
            </Link>
          )}
          {!currentUser.isAdmin && (
            <Link to="/dashboard?tab=cases">
              <Sidebar.Item
                active={tab === "cases"}
                icon={HiDocumentText}
                as="div"
              >
                My Cases
              </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item
            icon={HiArrowCircleRight}
            className="cursor-pointer"
            onClick={handleSignOut}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
