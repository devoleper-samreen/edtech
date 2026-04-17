import { useEffect, useState } from "react";
import {
  BookOpen,
  Users,
  GraduationCap,
  MessageSquare,
  PhoneCall,
  FolderTree,
} from "lucide-react";
// @ts-ignore
import { dashboardService } from "../../services/dashboardService";

interface DashboardStats {
  courses: {
    total: number;
    published: number;
    draft: number;
    totalEnrollments: number;
  };
  users: {
    total: number;
    active: number;
    inactive: number;
    students: number;
    admins: number;
  };
  enquiries: {
    total: number;
    new: number;
    contacted: number;
    resolved: number;
  };
  callbacks: {
    total: number;
    pending: number;
    scheduled: number;
    completed: number;
  };
  enrollments: {
    total: number;
    new: number;
    contacted: number;
    enrolled: number;
    cancelled: number;
  };
  categories: {
    total: number;
    active: number;
  };
  recentEnrollments: Array<{
    _id: string;
    name: string;
    email: string;
    course: string;
    status: string;
    createdAt: string;
  }>;
  recentActivity: {
    enrollments: Array<{ _id: string; name: string; course: string; status: string; createdAt: string; }>;
    internshipEnrollments: Array<{ _id: string; name: string; program: string; status: string; createdAt: string; }>;
    enquiries: Array<any>;
    callbacks: Array<any>;
    users: Array<any>;
  };
  recentEnquiries: Array<{
    _id: string;
    name: string;
    email: string;
    course: string;
    status: string;
    createdAt: string;
  }>;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardService.getStats();
      setStats(response.data);
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
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#FA8128] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-xs">Welcome back! Here's what's happening</p>
      </div>

      {/* Stats Grid - 2x2 on mobile, 3 on tablet, 6 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-gray-500 truncate">Total Courses</p>
              <p className="text-lg sm:text-xl font-bold text-gray-800">{stats?.courses.total || 0}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
              <BookOpen size={16} className="text-[#FA8128] sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-gray-500 truncate">Paid Enrollments</p>
              <p className="text-lg sm:text-xl font-bold text-green-600">{stats?.enrollments?.enrolled || 0}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <GraduationCap size={16} className="text-green-600 sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-gray-500 truncate">Total Users</p>
              <p className="text-lg sm:text-xl font-bold text-purple-600">{stats?.users.total || 0}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
              <Users size={16} className="text-purple-600 sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-gray-500 truncate">New Enquiries</p>
              <p className="text-lg sm:text-xl font-bold text-amber-600">{stats?.enquiries.new || 0}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
              <MessageSquare size={16} className="text-amber-600 sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-gray-500 truncate">Pending Callbacks</p>
              <p className="text-lg sm:text-xl font-bold text-orange-600">{stats?.callbacks.pending || 0}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
              <PhoneCall size={16} className="text-orange-600 sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-gray-500 truncate">Categories</p>
              <p className="text-lg sm:text-xl font-bold text-teal-600">{stats?.categories.total || 0}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
              <FolderTree size={16} className="text-teal-600 sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid - Stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Course Enrollments */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-800">Course Enrollments</h2>
            <span className="text-xs text-gray-500">{stats?.recentActivity?.enrollments?.length || 0} recent</span>
          </div>
          {stats?.recentActivity?.enrollments && stats.recentActivity.enrollments.length > 0 ? (
            <div className="space-y-2">
              {stats.recentActivity.enrollments.slice(0, 2).map((enrollment: any) => (
                <div key={enrollment._id} className="flex items-center justify-between p-2 sm:p-2.5 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                      <GraduationCap size={12} className="text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-800 truncate">{enrollment.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{enrollment.course}</p>
                    </div>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-medium shrink-0 ${enrollment.status === "Paid" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"}`}>
                    {enrollment.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <GraduationCap size={28} className="mx-auto mb-2 text-gray-300" />
              <p className="text-xs">No course enrollments</p>
            </div>
          )}
        </div>

        {/* Recent Internship Enrollments */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-800">Internship Enrollments</h2>
            <span className="text-xs text-gray-500">{stats?.recentActivity?.internshipEnrollments?.length || 0} recent</span>
          </div>
          {stats?.recentActivity?.internshipEnrollments && stats.recentActivity.internshipEnrollments.length > 0 ? (
            <div className="space-y-2">
              {stats.recentActivity.internshipEnrollments.slice(0, 2).map((enrollment: any) => (
                <div key={enrollment._id} className="flex items-center justify-between p-2 sm:p-2.5 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                      <GraduationCap size={12} className="text-[#FA8128]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-800 truncate">{enrollment.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{enrollment.program}</p>
                    </div>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-medium shrink-0 ${enrollment.status === "Paid" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"}`}>
                    {enrollment.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <GraduationCap size={28} className="mx-auto mb-2 text-gray-300" />
              <p className="text-xs">No internship enrollments</p>
            </div>
          )}
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-800">Recent Enquiries</h2>
            <span className="text-xs text-gray-500">{stats?.recentActivity?.enquiries?.length || 0} new</span>
          </div>
          {stats?.recentActivity?.enquiries && stats.recentActivity.enquiries.length > 0 ? (
            <div className="space-y-2">
              {stats.recentActivity.enquiries.slice(0, 2).map((enquiry: any) => (
                <div key={enquiry._id} className="flex items-center justify-between p-2 sm:p-2.5 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                      <MessageSquare size={12} className="text-purple-600 sm:w-[14px] sm:h-[14px]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">{enquiry.name}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 truncate">{enquiry.course}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium ${
                      enquiry.status === "New" ? "bg-orange-100 text-orange-600" :
                      enquiry.status === "Resolved" ? "bg-green-100 text-green-600" :
                      "bg-yellow-100 text-yellow-600"
                    }`}>
                      {enquiry.status}
                    </span>
                    <span className="text-[10px] text-gray-400 hidden sm:inline">{formatDate(enquiry.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <MessageSquare size={28} className="mx-auto mb-2 text-gray-300 sm:w-8 sm:h-8" />
              <p className="text-xs sm:text-sm">No recent enquiries</p>
            </div>
          )}
        </div>

        {/* Recent Callbacks */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-800">Recent Callbacks</h2>
            <span className="text-xs text-gray-500">{stats?.recentActivity?.callbacks?.length || 0} new</span>
          </div>
          {stats?.recentActivity?.callbacks && stats.recentActivity.callbacks.length > 0 ? (
            <div className="space-y-2">
              {stats.recentActivity.callbacks.slice(0, 2).map((cb: any) => (
                <div key={cb._id} className="flex items-center justify-between p-2 sm:p-2.5 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                      <PhoneCall size={12} className="text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-800 truncate">{cb.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{cb.type || 'General'}</p>
                    </div>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-medium shrink-0 ${
                    cb.status === "Completed" ? "bg-green-100 text-green-600" :
                    cb.status === "Scheduled" ? "bg-yellow-100 text-yellow-600" :
                    "bg-orange-100 text-orange-600"
                  }`}>
                    {cb.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <PhoneCall size={28} className="mx-auto mb-2 text-gray-300" />
              <p className="text-xs">No recent callbacks</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats - 2x2 on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-3 sm:p-4 text-white">
          <p className="text-[10px] sm:text-xs opacity-80">Published Courses</p>
          <p className="text-xl sm:text-2xl font-bold">{stats?.courses.published || 0}</p>
          <p className="text-[10px] sm:text-xs opacity-60 mt-0.5 sm:mt-1">out of {stats?.courses.total || 0} total</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-3 sm:p-4 text-white">
          <p className="text-[10px] sm:text-xs opacity-80">Active Students</p>
          <p className="text-xl sm:text-2xl font-bold">{stats?.users.students || 0}</p>
          <p className="text-[10px] sm:text-xs opacity-60 mt-0.5 sm:mt-1">{stats?.users.active || 0} active accounts</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-3 sm:p-4 text-white">
          <p className="text-[10px] sm:text-xs opacity-80">Resolved Enquiries</p>
          <p className="text-xl sm:text-2xl font-bold">{stats?.enquiries.resolved || 0}</p>
          <p className="text-[10px] sm:text-xs opacity-60 mt-0.5 sm:mt-1">out of {stats?.enquiries.total || 0} total</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-3 sm:p-4 text-white">
          <p className="text-[10px] sm:text-xs opacity-80">Completed Callbacks</p>
          <p className="text-xl sm:text-2xl font-bold">{stats?.callbacks.completed || 0}</p>
          <p className="text-[10px] sm:text-xs opacity-60 mt-0.5 sm:mt-1">out of {stats?.callbacks.total || 0} total</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
