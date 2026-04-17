import { useState, useEffect } from "react";
import { BookOpen, Calendar, Clock, IndianRupee, CheckCircle } from "lucide-react";
import { studentService } from "../../services/studentService";

interface Enrollment {
  _id: string;
  course: {
    _id: string | null;
    title: string;
    description: string;
    thumbnail: string;
    duration: string;
    level: string;
  };
  status: string;
  enrollmentDate: string;
  validUntil: string;
  amount: number;
  message: string;
  notes: string;
}

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await studentService.getMyCourses();
      setEnrollments(response.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
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

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div>
        <h1 className="text-lg font-bold text-gray-800">My Courses</h1>
        <p className="text-gray-500 text-xs">View your enrolled courses</p>
      </div>

      {/* Stats - 2 columns on mobile */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Total Enrolled Courses</p>
          <p className="text-xl font-bold text-gray-800">{enrollments.length}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Status</p>
          <p className="text-xl font-bold text-green-600">Enrolled</p>
        </div>
      </div>

      {/* Courses List */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#FA8128] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600 text-sm">Loading courses...</p>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
            <BookOpen size={40} className="text-gray-300 mb-3 sm:w-12 sm:h-12" />
            <p className="text-sm font-medium text-gray-600">No courses found</p>
            <p className="text-xs text-gray-400 mt-1">You haven't enrolled in any courses yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {enrollments.map((enrollment) => (
              <div key={enrollment._id} className="p-4 sm:p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  {enrollment.course.thumbnail ? (
                    <img src={enrollment.course.thumbnail} alt={enrollment.course.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 text-xl font-bold text-[#FA8128]">
                      {enrollment.course.title?.charAt(0) || "C"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-1">{enrollment.course.title}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-600 shrink-0 flex items-center gap-1">
                        <CheckCircle size={10} /> {enrollment.status}
                      </span>
                    </div>
                    {enrollment.course.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{enrollment.course.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {enrollment.course.duration && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
                          <Clock size={12} className="text-[#FA8128]" />
                          {enrollment.course.duration}
                        </div>
                      )}
                      {enrollment.amount > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
                          <IndianRupee size={12} className="text-[#FA8128]" />
                          ₹{enrollment.amount.toLocaleString('en-IN')} paid
                        </div>
                      )}
                      {enrollment.enrollmentDate && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
                          <Calendar size={12} className="text-[#FA8128]" />
                          Enrolled: {formatDate(enrollment.enrollmentDate)}
                        </div>
                      )}
                      {enrollment.validUntil && (
                        <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                          <Calendar size={12} />
                          Valid till {formatDate(enrollment.validUntil)}
                        </div>
                      )}
                    </div>
                    {enrollment.notes && (
                      <div className="mt-3 p-2 bg-gray-50 rounded-md">
                        <p className="text-[10px] text-gray-400 uppercase mb-1">Admin Notes</p>
                        <p className="text-xs text-gray-600">{enrollment.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
