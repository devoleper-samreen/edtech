import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Phone} from "lucide-react";
import { studentService } from "../../services/studentService";

interface BatchEnrollment {
  _id: string;
  course: {
    _id: string;
    title: string;
    thumbnail: string;
  };
  batch: {
    _id: string;
    startDate: string;
    timing: string;
    mode: string;
    days: string;
    contact: string;
    status: string;
  };
  enrollmentStatus: string;
  progress: number;
  enrollmentDate: string;
}

const MyBatches = () => {
  const [batches, setBatches] = useState<BatchEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await studentService.getMyBatches();
      setBatches(response.data || []);
    } catch (error) {
      console.error("Error fetching batches:", error);
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

  const getBatchStatusColor = (status: string) => {
    switch (status) {
      case "Upcoming":
        return "bg-orange-100 text-orange-600";
      case "Ongoing":
        return "bg-green-100 text-green-600";
      case "Completed":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case "Online":
        return "bg-purple-100 text-purple-600";
      case "Offline":
        return "bg-orange-100 text-orange-600";
      case "Hybrid":
        return "bg-cyan-100 text-cyan-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div>
        <h1 className="text-lg font-bold text-gray-800">My Batches</h1>
        <p className="text-gray-500 text-xs">View your batch schedules and details</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-xs text-gray-500">Total Batches</p>
          <p className="text-xl font-bold text-gray-800">{batches.length}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-xs text-gray-500">Ongoing</p>
          <p className="text-xl font-bold text-green-600">
            {batches.filter(b => b.batch?.status === "Ongoing").length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-xs text-gray-500">Upcoming</p>
          <p className="text-xl font-bold text-orange-600">
            {batches.filter(b => b.batch?.status === "Upcoming").length}
          </p>
        </div>
      </div>

      {/* Batches List */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#FA8128] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600 text-sm">Loading batches...</p>
          </div>
        ) : batches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Calendar size={48} className="text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-600">No batches found</p>
            <p className="text-xs text-gray-400 mt-1">You haven't enrolled in any batches yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {batches.map((item) => (
              <div key={item._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Course Image */}
                  <div className="w-full md:w-24 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white text-xl font-bold shrink-0">
                    {item.course?.thumbnail ? (
                      <img
                        src={item.course.thumbnail}
                        alt={item.course.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      item.course?.title?.charAt(0) || "C"
                    )}
                  </div>

                  {/* Batch Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800">
                          {item.course?.title || "Course"}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${getBatchStatusColor(item.batch?.status || "")}`}>
                            {item.batch?.status || "N/A"}
                          </span>
                          <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${getModeColor(item.batch?.mode || "")}`}>
                            {item.batch?.mode || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Batch Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                      <div className="flex items-start gap-2">
                        <Calendar size={14} className="text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase">Start Date</p>
                          <p className="text-xs font-medium text-gray-700">
                            {item.batch?.startDate ? formatDate(item.batch.startDate) : "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Clock size={14} className="text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase">Timing</p>
                          <p className="text-xs font-medium text-gray-700">
                            {item.batch?.timing || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase">Days</p>
                          <p className="text-xs font-medium text-gray-700">
                            {item.batch?.days || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Phone size={14} className="text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase">Contact</p>
                          <p className="text-xs font-medium text-gray-700">
                            {item.batch?.contact || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Course Progress</span>
                        <span className="text-xs font-medium text-[#FA8128]">{item.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-[#FA8128] h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
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

export default MyBatches;
