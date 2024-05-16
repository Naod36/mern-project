import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Projects from "./pages/Projects";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import CreateCaseTemp from "./pages/CreateCaseTemp";
import CaseSubmition from "./pages/CaseSubmition";
import UpdatePost from "./pages/UpdatePost";
import CaseSubmitionReview from "./pages/CaseSubmitionReview";
export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/case-submition" element={<CaseSubmition />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
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
