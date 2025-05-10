import React from "react";
import { Route, Routes } from "react-router-dom";
import LandingLay from "./Components/Layouts/LandingLay";
import Home from "./Page/Landing/Home";
import Services from "./Page/Landing/Services";
import Register from "./Page/Landing/Register";
import ContactUs from "./Page/Landing/ContactUs";
import Login from "./Page/Landing/Login";
import RestPassword from "./Page/Landing/RestPassword";
import ProtectedRoute from "./Components/ProtectedRoute";
import { useUserContext } from "./Components/useUserContext";
// Student Imports
import UserStudent from "./Components/Users/Students/UserStudent";
import StudentHome from "./Page/Dashboard/Students/StudentHome";
import StudentMarket from "./Page/Dashboard/Students/StudentMarket";
import ManualTracking from "./Page/Dashboard/Students/ManualTracking";
import StudentExams from "./Page/Dashboard/Students/StudentExams";
import StudentProfile from "./Page/Dashboard/Students/StudentProfile";
import StudentUnpaid from "./Page/Dashboard/Students/StudentUnpaid";
import StudentWaiting from "./Page/Dashboard/Students/StudentWaiting";
import LiveExam from "./Page/Dashboard/Students/LiveExam";

// Admin Imports
import AdminDashboard from "./Page/Dashboard/Admins/AdminDashboard";
import AdminExams from "./Page/Dashboard/Admins/AdminExams";
import AdminAccounts from "./Page/Dashboard/Admins/AdminAccounts";
import AdminUsers from "./Page/Dashboard/Admins/AdminUsers";
import AdminProfile from "./Page/Dashboard/Admins/AdminProfile";
import UserAdmin from "./Components/Users/Admins/UserAdmin";

//School Account Imports
import SchoolsDashboard from "./Page/Dashboard/schools/SchoolsDashboard";
import UserSchool from "./Components/Users/Schools/UserSchool";
import AccountMarket from "./Page/Dashboard/schools/AccountMarket";
import SchoolDoExams from "./Page/Dashboard/schools/SchoolDoExams";
import SchoolMyExams from "./Page/Dashboard/schools/SchoolMyExams";
import SchoolMyAccount from "./Page/Dashboard/schools/SchoolMyAccount";
import AdminsPayments from "./Page/Dashboard/Admins/AdminsPayments";
import SchoolDemo from "./Page/Dashboard/Students/SchoolDemo";
import SchoolUnpaid from "./Page/Dashboard/schools/SchoolUnpaid";
import SchoolWaiting from "./Page/Dashboard/schools/SchoolWaiting";
import SchoolAccessableExams from "./Page/Dashboard/schools/SchoolAccessableExams";
import SchoolAccessedExam from "./Page/Dashboard/schools/SchoolAccessedExam";
import SchoolLiveExam from "./Page/Dashboard/schools/SchoolLiveExam";
import SchoolLiveLearn from "./Page/Dashboard/schools/SchoolLiveLearn";
import LiveLearn from "./Page/Dashboard/Students/LiveLearn";
const App = () => {
  const { userRole, loading } = useUserContext();
  // onContextMenu={(e) => e.preventDefault()} select-none
  if (loading) return <div>Loading...</div>;
  return (
    <>
      <div
        className="overflow-x-hidden font-Poppins"
      >
        <Routes>
          {/* Landing Routes */}
          <Route element={<LandingLay />}>
            <Route path="/" element={<Home />}></Route>
            <Route path="/serivisi" element={<Services />}></Route>
            <Route path="/kwiyandikisha" element={<Register />}></Route>
            <Route path="/tuvugishe" element={<ContactUs />}></Route>
            <Route path="/kwinjira" element={<Login />}></Route>
            <Route path="/hindura" element={<RestPassword />}></Route>
          </Route>
          {/* Student Market Routes */}
          {userRole === "student" && (
            <Route element={<ProtectedRoute allowedRole="student" />}>
              <Route element={<UserStudent />}>
                <Route path="/students/home" element={<StudentHome />} />
                <Route path="/students/market" element={<StudentMarket />} />
                <Route path="/students/tracking" element={<ManualTracking />} />
                <Route path="/students/exams" element={<StudentExams />} />
                <Route path="/students/profile" element={<StudentProfile />} />
                <Route
                  path="/students/unpaidexams"
                  element={<StudentUnpaid />}
                />
                <Route
                  path="/students/waitingexams"
                  element={<StudentWaiting />}
                />
                <Route path="/liveExam" element={<LiveExam />} />
                <Route path="/liveLearn" element={<LiveLearn />} />
                <Route path="/students/school" element={<SchoolDemo />} />
              </Route>
            </Route>
          )}
          {/* Admin Routes */}
          {userRole === "admin" && (
            <Route element={<ProtectedRoute allowedRole="admin" />}>
              <Route element={<UserAdmin />}>
                <Route path="/admins/home" element={<AdminDashboard />} />
                <Route path="/admins/exams" element={<AdminExams />} />
                <Route path="/admins/accounts" element={<AdminAccounts />} />
                <Route path="/admins/users" element={<AdminUsers />} />
                <Route path="/admins/profile" element={<AdminProfile />} />
                <Route path="/admins/payments" element={<AdminsPayments />} />
              </Route>
            </Route>
          )}
          {/* School Routes */}
          {userRole === "school" && (
            <Route element={<ProtectedRoute allowedRole="school" />}>
              <Route element={<UserSchool />}>
                <Route path="/schools/home" element={<SchoolsDashboard />} />
                <Route
                  path="/schools/account/market"
                  element={<AccountMarket />}
                />
                <Route path="/schools/online" element={<SchoolDoExams />} />
                <Route path="/schools/exams" element={<SchoolMyExams />} />
                <Route path="/schools/account" element={<SchoolMyAccount />} />
                <Route
                  path="/schools/unpaidaccounts"
                  element={<SchoolUnpaid />}
                />
                <Route
                  path="/schools/waitingaccounts"
                  element={<SchoolWaiting />}
                />
                <Route
                  path="/schools/accessableexams"
                  element={<SchoolAccessableExams />}
                />
                <Route
                  path="/schools/accessedexam"
                  element={<SchoolAccessedExam />}
                />
                <Route path="/schoolsliveExam" element={<SchoolLiveExam />} />
                <Route path="/schoolsliveLearn" element={<SchoolLiveLearn />} />
              </Route>
            </Route>
          )}
        </Routes>
      </div>
    </>
  );
};

export default App;
