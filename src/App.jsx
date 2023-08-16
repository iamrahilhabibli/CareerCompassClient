import { Navbar } from "./components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Companies } from "./components/Companies";
import "./index.css";
import { Signup } from "./components/Signup/Signup";
import { Signin } from "./components/Signin/Signin";
import { Details } from "./components/CompanyDet/Details";
import { CompanyDetailsForm } from "./components/CompanyDet/CompanyDetailsForm";
import { CompanyDetailsAbout } from "./components/CompanyDet/CompanyDetailsAbout";
import { Profile } from "./components/Profile/Profile";
import Multistep, {
  CompanyDetailsName,
} from "./components/CompanyDet/CompanyDetailsName";
import { Footer } from "./components/Footer/Footer";
import { NotFound } from "./components/NotFound/NotFound";
export function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/companydetailform" element={<Multistep />} />
        <Route path="/companydetails" element={<Details />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}
