import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/Signin";
import Projects from "./pages/Projects";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import CreateCaseTemp from "./pages/CreateCaseTemp";
import CaseSubmition from "./pages/CaseSubmition";
import UpdatePost from "./pages/UpdatePost";
import UpdateMyCase from "./pages/UpdateMyCase";
import CaseSubmitionReview from "./pages/CaseSubmitionReview";
import CasePage from "./pages/CasePage";
import MyCaseCheck from "./pages/MyCaseCheck";
import AssighnedCaseDetails from "./pages/AssighnedCaseDetails";
export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/case-templates" element={<Projects />} />
        <Route path="/case-page/:caseSlug" element={<CasePage />} />

        <Route path="/case-submitions" element={<CaseSubmition />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/update-my-case/:caseId" element={<UpdateMyCase />} />
          <Route path="/my-case-check/:caseId" element={<MyCaseCheck />} />
          <Route
            path="/assign-case-details/:caseId"
            element={<AssighnedCaseDetails />}
          />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-case-template" element={<CreateCaseTemp />} />
          <Route path="/update-post/:caseId" element={<UpdatePost />} />

          <Route
            path="/case-submition-review/:caseId"
            element={<CaseSubmitionReview />}
          />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
