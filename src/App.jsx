import { Navbar } from "./components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Companies } from "./components/Companies";
import "./index.css";
import { Signup } from "./components/Signup/Signup";
import { Signin } from "./components/Signin/Signin";
import { NotificationsDrawer } from "./components/NotificationsDrawer/NotificationsDrawer";
import CompanyDetails from "./components/CompanyDetails/CompanyDetails";
export function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/companydetails" element={<CompanyDetails />} />
      </Routes>
    </>
  );
}
