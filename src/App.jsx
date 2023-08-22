import { Navbar } from "./components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Companies } from "./components/Companies";
import { Provider } from "react-redux";
import "./index.css";
import { Signup } from "./components/Signup/Signup";
import { Signin } from "./components/Signin/Signin";
import { Details } from "./components/CompanyDet/Details";
import { Profile } from "./components/Profile/Profile";
import Multistep from "./components/CompanyDet/CompanyDetailsName";
import { Footer } from "./components/Footer/Footer";
import { NotFound } from "./components/ExceptionPages/NotFound";
import { ForgotPass } from "./components/ForgotPassword/ForgotPass";
import { PasswordReset } from "./components/PasswordReset/PasswordReset";
import { useLocation } from "react-router-dom";
import { SidebarWithHeader } from "./components/JobPost/Sidebar";
import { Employers } from "./components/Employers/Employers";
import { JobMultistep } from "./components/Employers/JobMultistep";
import { WelcomePage } from "./components/WelcomePage/WelcomePage";
import { Forbidden } from "./components/ExceptionPages/Forbidden";
import { SearchResultCards } from "./components/VacancyDetailsSearch/SearchResultCards";
import { SomethingWentWrong } from "./components/ExceptionPages/SomethingWentWrong";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PostedJobs } from "./components/Employers/PostedJobs";
import { store } from "./reduxstores/storgeConfig";
import ThreeTierPricing from "./components/Pricing/Pricing";
import SuccessPayment from "./components/Pricing/SuccessPayment";
import ErrorPayment from "./components/Pricing/ErrorPayment";

export function App() {
  const location = useLocation();
  const pathsForSpecialLayout = [
    "/employerscareercompass",
    "/postjob",
    "/vacancieslist",
  ];
  const useSpecialLayout = pathsForSpecialLayout.includes(location.pathname);

  return (
    <>
      {!useSpecialLayout && <Navbar />}
      {useSpecialLayout ? (
        <SidebarWithHeader>
          <Routes>
            <Route path="/employerscareercompass" element={<Employers />} />
            <Route path="/postjob" element={<JobMultistep />} />
            <Route path="/vacancieslist" element={<PostedJobs />} />
          </Routes>
        </SidebarWithHeader>
      ) : (
        <Provider store={store}>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/companydetailform" element={<Multistep />} />
            <Route path="/companydetails" element={<Details />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/search" element={<SearchResultCards />} />
            <Route path="/forgotpassword" element={<ForgotPass />} />
            <Route path="/passwordreset" element={<PasswordReset />} />
            <Route path="/pricing" element={<ThreeTierPricing />} />
            <Route path="/paymentsuccess" element={<SuccessPayment />} />
            <Route path="/paymenterror" element={<ErrorPayment />} />
            <Route path="/forbidden" element={<Forbidden />} />
            <Route
              path="/somethingwentwrong"
              element={<SomethingWentWrong />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Provider>
      )}
      {!useSpecialLayout && <Footer />}
    </>
  );
}
