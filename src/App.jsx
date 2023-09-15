import { Navbar } from "./components/Navbar/Navbar";
import { Routes, Route, useNavigate } from "react-router-dom";
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
import { ResumeBuild } from "./components/Resume/ResumeBuild";
import { DownloadProvider } from "./components/DownloadContext/DownloadProvider";
import { Applicants } from "./components/Employers/Applicants";
import { Messages } from "./components/Employers/Messages";
import { JobseekerMessages } from "./components/Jobseeker/JobseekerMessages";
import { Payments } from "./components/Payments/Payments";
import PasswordResetInApp from "./components/PasswordReset/PasswordResetInApp";
import { ReviewCompanyDetails } from "./components/ReviewCompanyDetails";
import Dashboard from "./components/Admin/Dashboard";
import AdminSidebarWithHeader from "./components/Admin/AdminSidebar";
import Users from "./components/Admin/Users";
import CompaniesList from "./components/Admin/CompaniesList";
import ReviewsList from "./components/Admin/ReviewsList";
import Reports from "./components/Admin/Reports";
import EducationLevels from "./components/Admin/EducationLevels";
import useUser from "./customhooks/useUser";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminProtectedRoute } from "./components/AdminProtectedRoute";
import ExperienceLevels from "./components/Admin/ExperienceLevels";
export function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, isAuthenticated, userRole } = useUser();
  const pathsForSpecialLayout = [
    "/employerscareercompass",
    "/postjob",
    "/vacancieslist",
    "/applicants",
    "/messages",
  ];
  const pathsForAdminLayout = [
    "/dashboard",
    "/usermanagement",
    "/companymanagement",
    "/reviewmanagement",
    "/reports",
    "/educationlevels",
    "/experiencelevels",
  ];

  const useSpecialLayout = pathsForSpecialLayout.includes(location.pathname);
  const useAdminLayout = pathsForAdminLayout.includes(location.pathname);

  return (
    <Provider store={store}>
      <>
        {!useSpecialLayout && !useAdminLayout && <Navbar />}

        {useSpecialLayout && (
          <SidebarWithHeader>
            <ProtectedRoute>
              <Routes>
                <Route path="/employerscareercompass" element={<Employers />} />
                <Route path="/postjob" element={<JobMultistep />} />
                <Route path="/vacancieslist" element={<PostedJobs />} />
                <Route path="/applicants" element={<Applicants />} />
                <Route path="/messages" element={<Messages />} />
              </Routes>
            </ProtectedRoute>
          </SidebarWithHeader>
        )}
        {useAdminLayout && (
          <AdminProtectedRoute>
            <AdminSidebarWithHeader>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/usermanagement" element={<Users />} />
                <Route path="/companymanagement" element={<CompaniesList />} />
                <Route path="/reviewmanagement" element={<ReviewsList />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/educationlevels" element={<EducationLevels />} />
                <Route
                  path="/experiencelevels"
                  element={<ExperienceLevels />}
                />
              </Routes>
            </AdminSidebarWithHeader>
          </AdminProtectedRoute>
        )}
        {!useSpecialLayout && !useAdminLayout && (
          <DownloadProvider>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/home" element={<Home />} />
              <Route path="/companies" element={<Companies />} />
              <Route
                path="/companies/:companyId"
                element={<ReviewCompanyDetails />}
              />
              <Route path="/resumebuild/:userId" element={<ResumeBuild />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/companydetailform" element={<Multistep />} />
              <Route path="/companydetails" element={<Details />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/search" element={<SearchResultCards />} />
              <Route path="/forgotpassword" element={<ForgotPass />} />
              <Route path="/passwordreset" element={<PasswordReset />} />
              <Route
                path="/passwordreset/:userId"
                element={<PasswordResetInApp />}
              />
              <Route path="/pricing" element={<ThreeTierPricing />} />
              <Route path="/payments/:userId" element={<Payments />} />
              <Route path="/paymentsuccess" element={<SuccessPayment />} />
              <Route path="/paymenterror" element={<ErrorPayment />} />
              <Route path="/jsmessages" element={<JobseekerMessages />} />
              <Route path="/forbidden" element={<Forbidden />} />
              <Route
                path="/somethingwentwrong"
                element={<SomethingWentWrong />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DownloadProvider>
        )}

        {!useSpecialLayout && !useAdminLayout && <Footer />}
      </>
    </Provider>
  );
}
