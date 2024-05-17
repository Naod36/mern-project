import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashCases from "../components/DashCases";
import DashUsers from "../components/DashUsers";
import DashCasesTemplates from "../components/DashCasesTemplates";
import DashCaseSubmitions from "../components/DashCaseSubmitions";
import DashBoardComponent from "../components/DashBoardComponent";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl !== null) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/*sidebar*/}
        <DashSidebar />
      </div>
      {/*content*/}
      {tab === "profile" && <DashProfile />}
      {/*cases submitions for admins */}
      {tab === "case-submitions" && <DashCaseSubmitions />}

      {/*cases template dashboard component for admins */}
      {tab === "dashboard-component" && <DashBoardComponent />}

      {tab === "case-templates" && <DashCasesTemplates />}
      {/*my cases for users*/}
      {tab === "cases" && <DashCases />}
      {/*users*/}
      {tab === "users" && <DashUsers />}
    </div>
  );
}
