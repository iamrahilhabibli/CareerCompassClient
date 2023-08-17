import { Navbar } from "./components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Companies } from "./components/Companies";
import "./index.css";
import { Signup } from "./components/Signup/Signup";
import { Signin } from "./components/Signin/Signin";
import { Details } from "./components/CompanyDet/Details";
import { Profile } from "./components/Profile/Profile";
import Multistep from "./components/CompanyDet/CompanyDetailsName";
import { Footer } from "./components/Footer/Footer";
import { NotFound } from "./components/NotFound/NotFound";
import { ForgotPass } from "./components/ForgotPassword/ForgotPass";
import { PasswordReset } from "./components/PasswordReset/PasswordReset";
import { useLocation } from "react-router-dom";
import { SidebarWithHeader } from "./components/JobPost/Sidebar";
import { Employers } from "./components/Employers/Employers";
import { JobMultistep } from "./components/Employers/JobMultistep";
export function App() {
  const location = useLocation();
  const pathsForSpecialLayout = ["/employerscareercompass", "/postjob"];
  const useSpecialLayout = pathsForSpecialLayout.includes(location.pathname);

  return (
    <>
      {!useSpecialLayout && <Navbar />}
      {useSpecialLayout ? (
        <SidebarWithHeader>
          <Routes>
            <Route path="/employerscareercompass" element={<Employers />} />
            <Route path="/postjob" element={<JobMultistep />} />
          </Routes>
        </SidebarWithHeader>
      ) : (
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/companydetailform" element={<Multistep />} />
          <Route path="/companydetails" element={<Details />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgotpassword" element={<ForgotPass />} />
          <Route path="/passwordreset" element={<PasswordReset />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
      {!useSpecialLayout && <Footer />}
    </>
  );
}
