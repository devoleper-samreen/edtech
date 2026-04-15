import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  MessageSquare,
  ArrowRight,
  PhoneCall
} from "lucide-react";
import { studentService } from "../../services/studentService";

interface DashboardData {
  stats: {
    totalEnrollments: number;
    activeEnrollments: number;
    completedCourses: number;
    pendingEnquiries: number;
  };
  recentEnrollments: Array<{
    _id: string;
    course: { title: string; thumbnail?: string };
    status: string;
    enrollmentDate: string;
  }>;
  recentEnquiries: Array<{
    _id: string;
    course: string;
    status: string;
    createdAt: string;
  }>;
  recentCallbacks: Array<{
    _id: string;
    type: string;
    status: string;
    createdAt: string;
  }>;
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await studentService.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[#FA8128] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-gray-600 text-sm">Loading dashboard...</p>
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    totalEnrollments: 0,
    activeEnrollments: 0,
    completedCourses: 0,
    pendingEnquiries: 0
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div>
        <h1 className="text-lg font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-xs">Welcome back! Here's your learning overview</p>
      </div>

      {/* Stats Grid - 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border-l-4 border-[#FA8128]">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs text-gray-500 truncate">Total Enrollments</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.totalEnrollments}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0 ml-2">
              <BookOpen size={16} className="text-[#FA8128] sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs text-gray-500 truncate">Active Courses</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.activeEnrollments}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0 ml-2">
              <Calendar size={16} className="text-green-600 sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs text-gray-500 truncate">Completed</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.completedCourses}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0 ml-2">
              <CheckCircle size={16} className="text-purple-600 sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs text-gray-500 truncate">Pending Enquiries</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.pendingEnquiries}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0 ml-2">
              <MessageSquare size={16} className="text-amber-600 sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid - Stack on mobile, side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Enrolled Courses */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-sm font-semibold text-gray-800">Enrolled Courses</h2>
            <button
              onClick={() => navigate("/student/courses")}
              className="text-xs text-[#FA8128] hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={12} />
            </button>
          </div>

          {dashboardData?.recentEnrollments && dashboardData.recentEnrollments.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {dashboardData.recentEnrollments.map((enrollment) => (
                <div key={enrollment._id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base shrink-0">
                    {enrollment.course?.title?.charAt(0) || "C"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                      {enrollment.course?.title || "Course"}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      Enrolled on {formatDate(enrollment.enrollmentDate)}
                    </p>
                  </div>
                  <span className="px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] font-medium rounded-full bg-green-100 text-green-600 shrink-0">
                    {enrollment.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
              <BookOpen size={28} className="text-gray-300 mb-2 sm:w-8 sm:h-8" />
              <p className="text-xs sm:text-sm text-gray-500">No enrolled courses</p>
              <button
                onClick={() => navigate("/courses")}
                className="mt-2 text-xs text-[#FA8128] hover:underline"
              >
                Browse Courses
              </button>
            </div>
          )}
        </div>

        {/* Recent Callbacks */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-sm font-semibold text-gray-800">Recent Callback Requests</h2>
            <button
              onClick={() => navigate("/student/callbacks")}
              className="text-xs text-[#FA8128] hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={12} />
            </button>
          </div>

          {dashboardData?.recentCallbacks && dashboardData.recentCallbacks.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {dashboardData.recentCallbacks.map((callback) => (
                <div key={callback._id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                    <PhoneCall size={14} className="text-orange-600 sm:w-[18px] sm:h-[18px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                      {callback.type} Request
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      {formatDate(callback.createdAt)}
                    </p>
                  </div>
                  <span className={`px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] font-medium rounded-full shrink-0 ${
                    callback.status === "Pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : callback.status === "Scheduled"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-green-100 text-green-600"
                  }`}>
                    {callback.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
              <PhoneCall size={28} className="text-gray-300 mb-2 sm:w-8 sm:h-8" />
              <p className="text-xs sm:text-sm text-gray-500">No callback requests</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Enquiries */}
      <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-sm font-semibold text-gray-800">Recent Enquiries</h2>
          <button
            onClick={() => navigate("/student/enquiries")}
            className="text-xs text-[#FA8128] hover:underline flex items-center gap-1"
          >
            View All <ArrowRight size={12} />
          </button>
        </div>

        {dashboardData?.recentEnquiries && dashboardData.recentEnquiries.length > 0 ? (
          <>
            {/* Mobile Card View */}
            <div className="sm:hidden space-y-2">
              {dashboardData.recentEnquiries.map((enquiry) => (
                <div key={enquiry._id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-800 truncate">{enquiry.course}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{formatDate(enquiry.createdAt)}</p>
                    </div>
                    <span className={`px-1.5 py-0.5 text-[8px] font-medium rounded-full shrink-0 ${
                      enquiry.status === "New"
                        ? "bg-orange-100 text-orange-600"
                        : enquiry.status === "Contacted"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                    }`}>
                      {enquiry.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Course</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Status</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentEnquiries.map((enquiry) => (
                    <tr key={enquiry._id} className="border-t border-gray-100">
                      <td className="py-2 px-3 text-sm text-gray-800">{enquiry.course}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                          enquiry.status === "New"
                            ? "bg-orange-100 text-orange-600"
                            : enquiry.status === "Contacted"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                        }`}>
                          {enquiry.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-xs text-gray-500">{formatDate(enquiry.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
            <MessageSquare size={28} className="text-gray-300 mb-2 sm:w-8 sm:h-8" />
            <p className="text-xs sm:text-sm text-gray-500">No enquiries yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
