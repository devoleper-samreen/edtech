import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
// @ts-ignore
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ContactUs from "./pages/ContactUs";
import HireFromUs from "./pages/HireFromUs";
import CorporateTraining from "./pages/CorporateTraining";
import CRTProgram from "./pages/CRTProgram";
import CourseDetails from "./pages/CourseDetails";
import Courses from "./pages/Courses";

// Admin Imports
import AdminLayout from "./admin/components/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import CourseCategories from "./admin/pages/CourseCategories";
import CoursesManagement from "./admin/pages/CoursesManagement";
import Enrollments from "./admin/pages/Enrollments";
import Enquiries from "./admin/pages/Enquiries";
import CallbackRequests from "./admin/pages/CallbackRequests";
import Users from "./admin/pages/Users";
import Admins from "./admin/pages/Admins";
import Batches from "./admin/pages/Batches";
import Testimonials from "./admin/pages/Testimonials";
import Placements from "./admin/pages/Placements";
import InternshipPrograms from "./admin/pages/InternshipPrograms";
import InternshipEnrollments from "./admin/pages/InternshipEnrollments";
import InternshipDetail from "./pages/InternshipDetail";

// Student Imports
import StudentLayout from "./student/components/StudentLayout";
import StudentDashboard from "./student/pages/StudentDashboard";
import MyCourses from "./student/pages/MyCourses";
import Profile from "./student/pages/Profile";
import MyEnquiries from "./student/pages/MyEnquiries";
import MyCallbacks from "./student/pages/MyCallbacks";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#363636',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/hire-from-us" element={<HireFromUs />} />
        <Route path="/summer-internship" element={<CorporateTraining />} />
        <Route path="/crt-program" element={<CRTProgram />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/internship/:id" element={<InternshipDetail />} />
        <Route path="/courses" element={<Courses />} />

        {/* Admin Routes - Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<CourseCategories />} />
          <Route path="courses" element={<CoursesManagement />} />
          <Route path="batches" element={<Batches />} />
          <Route path="enrollments" element={<Enrollments />} />
          <Route path="enquiries" element={<Enquiries />} />
          <Route path="callbacks" element={<CallbackRequests />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="placements" element={<Placements />} />
          <Route path="internships" element={<InternshipPrograms />} />
          <Route path="internship-enrollments" element={<InternshipEnrollments />} />
          <Route path="users" element={<Users />} />
          <Route path="admins" element={<Admins />} />
        </Route>

        {/* Student Routes - Protected */}
        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="courses" element={<MyCourses />} />
          <Route path="profile" element={<Profile />} />
          <Route path="enquiries" element={<MyEnquiries />} />
          <Route path="callbacks" element={<MyCallbacks />} />
        </Route>

      </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
