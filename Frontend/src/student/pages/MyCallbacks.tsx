import { useState, useEffect } from "react";
import { PhoneCall, Clock, CheckCircle, Calendar, Eye, Building2 } from "lucide-react";
import { studentService } from "../../services/studentService";

interface Callback {
  _id: string;
  name: string;
  phone: string;
  email: string;
  type: string;
  company: string;
  requiredTraining: string;
  message: string;
  status: string;
  scheduledDate: string | null;
  createdAt: string;
}

const MyCallbacks = () => {
  const [callbacks, setCallbacks] = useState<Callback[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCallback, setSelectedCallback] = useState<Callback | null>(null);

  useEffect(() => {
    fetchCallbacks();
  }, [statusFilter]);

  const fetchCallbacks = async () => {
    setLoading(true);
    try {
      const params = statusFilter !== "All" ? { status: statusFilter } : {};
      const response = await studentService.getMyCallbacks(params);
      setCallbacks(response.data || []);
    } catch (error) {
      console.error("Error fetching callbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock size={14} className="text-yellow-600" />;
      case "Scheduled":
        return <Calendar size={14} className="text-orange-600" />;
      case "Completed":
        return <CheckCircle size={14} className="text-green-600" />;
      default:
        return <PhoneCall size={14} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-600";
      case "Scheduled":
        return "bg-orange-100 text-orange-600";
      case "Completed":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "General":
        return "bg-gray-100 text-gray-600";
      case "Corporate":
        return "bg-purple-100 text-purple-600";
      case "Hire":
        return "bg-orange-100 text-orange-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const pendingCount = callbacks.filter(c => c.status === "Pending").length;
  const scheduledCount = callbacks.filter(c => c.status === "Scheduled").length;
  const completedCount = callbacks.filter(c => c.status === "Completed").length;

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div>
        <h1 className="text-lg font-bold text-gray-800">My Callback Requests</h1>
        <p className="text-gray-500 text-xs">Track your callback request status</p>
      </div>

      {/* Stats - 2x2 grid on mobile, 4 columns on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Total Requests</p>
          <p className="text-xl font-bold text-gray-800">{callbacks.length}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Pending</p>
          <p className="text-xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Scheduled</p>
          <p className="text-xl font-bold text-orange-600">{scheduledCount}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Completed</p>
          <p className="text-xl font-bold text-green-600">{completedCount}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm p-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <span className="text-xs text-gray-500">Filter by Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-md text-gray-600 outline-none focus:border-[#FA8128] w-full sm:w-auto"
          >
            <option value="All">All Requests</option>
            <option value="Pending">Pending</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Callbacks List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#FA8128] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600 text-sm">Loading callback requests...</p>
          </div>
        ) : callbacks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
            <PhoneCall size={40} className="text-gray-300 mb-3 sm:w-12 sm:h-12" />
            <p className="text-sm font-medium text-gray-600">No callback requests found</p>
            <p className="text-xs text-gray-400 mt-1">You haven't requested any callbacks yet</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="sm:hidden divide-y divide-gray-100">
              {callbacks.map((callback) => (
                <div key={callback._id} className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                        {getStatusIcon(callback.status)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium ${getTypeColor(callback.type)}`}>
                            {callback.type}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium ${getStatusColor(callback.status)}`}>
                            {callback.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-1">{callback.phone}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(callback.createdAt)}</p>
                        {callback.scheduledDate && (
                          <p className="text-[10px] text-orange-600 mt-0.5 flex items-center gap-0.5">
                            <Calendar size={10} />
                            Scheduled: {formatDate(callback.scheduledDate)}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedCallback(callback)}
                      className="p-1.5 hover:bg-orange-50 rounded-md text-[#FA8128] transition-colors shrink-0"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Type</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Phone</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Status</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Scheduled</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Requested</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {callbacks.map((callback) => (
                    <tr key={callback._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center">
                            {getStatusIcon(callback.status)}
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getTypeColor(callback.type)}`}>
                            {callback.type}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-sm text-gray-800">{callback.phone}</td>
                      <td className="py-2.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(callback.status)}`}>
                          {callback.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-xs text-gray-500">
                        {callback.scheduledDate ? formatDate(callback.scheduledDate) : "-"}
                      </td>
                      <td className="py-2.5 px-4 text-xs text-gray-500">
                        {formatDate(callback.createdAt)}
                      </td>
                      <td className="py-2.5 px-4">
                        <button
                          onClick={() => setSelectedCallback(callback)}
                          className="p-1.5 hover:bg-orange-50 rounded-md text-[#FA8128] transition-colors"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* View Modal */}
      {selectedCallback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-sm font-semibold text-gray-800">Callback Request Details</h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex flex-wrap gap-3">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">Type</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getTypeColor(selectedCallback.type)}`}>
                    {selectedCallback.type}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">Status</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(selectedCallback.status)}`}>
                    {selectedCallback.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 uppercase">Phone</p>
                <p className="text-sm text-gray-800">{selectedCallback.phone}</p>
              </div>

              {selectedCallback.email && (
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">Email</p>
                  <p className="text-sm text-gray-800 break-all">{selectedCallback.email}</p>
                </div>
              )}

              {selectedCallback.company && (
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">Company</p>
                  <p className="text-sm text-gray-800 flex items-center gap-1">
                    <Building2 size={12} className="text-gray-400" />
                    {selectedCallback.company}
                  </p>
                </div>
              )}

              {selectedCallback.requiredTraining && (
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">Required Training</p>
                  <p className="text-sm text-gray-800">{selectedCallback.requiredTraining}</p>
                </div>
              )}

              {selectedCallback.message && (
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">Message</p>
                  <p className="text-sm text-gray-800">{selectedCallback.message}</p>
                </div>
              )}

              {selectedCallback.scheduledDate && (
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">Scheduled Date</p>
                  <p className="text-sm text-gray-800 flex items-center gap-1">
                    <Calendar size={12} className="text-[#FA8128]" />
                    {formatDate(selectedCallback.scheduledDate)}
                  </p>
                </div>
              )}

              <div>
                <p className="text-[10px] text-gray-400 uppercase">Requested On</p>
                <p className="text-sm text-gray-800">{formatDate(selectedCallback.createdAt)}</p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 sticky bottom-0 bg-white">
              <button
                onClick={() => setSelectedCallback(null)}
                className="w-full px-3 py-2.5 text-sm bg-gray-100 rounded-md hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCallbacks;
