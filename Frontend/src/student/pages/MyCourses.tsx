import { useState, useEffect } from "react";
import { BookOpen, Calendar } from "lucide-react";
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
              <div key={enrollment._id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {/* Course Image */}
                  <div className="w-full sm:w-28 md:w-32 h-20 sm:h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white text-xl sm:text-2xl font-bold shrink-0">
                    {enrollment.course.thumbnail ? (
                      <img
                        src={enrollment.course.thumbnail}
                        alt={enrollment.course.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      enrollment.course.title?.charAt(0) || "C"
                    )}
                  </div>

                  {/* Course Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
                          {enrollment.course.title}
                        </h3>
                        {enrollment.course.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {enrollment.course.description}
                          </p>
                        )}
                      </div>
                      <span className="self-start px-2 py-0.5 text-[10px] font-medium rounded-full bg-green-100 text-green-600 shrink-0">
                        {enrollment.status}
                      </span>
                    </div>

                    {/* Enrollment Info */}
                    <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-3">
                      <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500">
                        <Calendar size={12} />
                        <span>Enrolled on {formatDate(enrollment.enrollmentDate)}</span>
                      </div>
                      {enrollment.course.duration && (
                        <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium rounded-full bg-orange-100 text-orange-600">
                          {enrollment.course.duration}
                        </span>
                      )}
                      {enrollment.course.level && (
                        <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium rounded-full bg-purple-100 text-purple-600">
                          {enrollment.course.level}
                        </span>
                      )}
                    </div>

                    {/* Notes from admin */}
                    {enrollment.notes && (
                      <div className="mt-2 sm:mt-3 p-2 bg-gray-50 rounded-md">
                        <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase mb-0.5 sm:mb-1">Admin Notes</p>
                        <p className="text-[11px] sm:text-xs text-gray-600">{enrollment.notes}</p>
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
