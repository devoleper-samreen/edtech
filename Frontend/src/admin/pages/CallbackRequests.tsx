import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Search, Trash2, PhoneCall, Phone, CheckCircle, Mail, Building2, BookOpen, MessageSquare, X } from "lucide-react";
// @ts-ignore
import { callbackService } from "../../services/callbackService";
import ConfirmModal from "../../components/ConfirmModal";

interface Callback {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  type: 'General' | 'Corporate' | 'Hire';
  company?: string;
  requiredTraining?: string;
  message?: string;
  status: 'Pending' | 'Scheduled' | 'Completed';
  notes?: string;
  createdAt: string;
}

const CallbackRequests = () => {
  const [callbacks, setCallbacks] = useState<Callback[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  const [viewDetails, setViewDetails] = useState<Callback | null>(null);

  useEffect(() => {
    fetchCallbacks();
  }, [statusFilter, searchTerm, typeFilter]);

  const fetchCallbacks = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter !== "All") params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await callbackService.getAllCallbacks(params);
      let data = response.data.callbacks || [];

      // Filter by type on frontend since backend doesn't have type filter yet
      if (typeFilter !== "All") {
        data = data.filter((c: Callback) => c.type === typeFilter);
      }

      setCallbacks(data);
    } catch (error) {
      console.error("Error fetching callbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await callbackService.updateCallback(id, { status });
      toast.success("Callback status updated!");
      fetchCallbacks();
    } catch (error) {
      console.error("Error updating callback:", error);
      toast.error("Failed to update status");
    }
  };

  const handleMarkCompleted = async (id: string) => {
    try {
      await callbackService.markCompleted(id);
      toast.success("Callback marked as completed!");
      fetchCallbacks();
    } catch (error) {
      console.error("Error marking callback as completed:", error);
      toast.error("Failed to mark as completed");
    }
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDelete({ isOpen: true, id });
  };

  const handleDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      await callbackService.deleteCallback(confirmDelete.id);
      toast.success("Callback deleted successfully!");
      fetchCallbacks();
    } catch (error) {
      console.error("Error deleting callback:", error);
      toast.error("Failed to delete callback");
    }
  };

  const pendingCount = callbacks.filter(c => c.status === "Pending").length;
  const scheduledCount = callbacks.filter(c => c.status === "Scheduled").length;
  const completedCount = callbacks.filter(c => c.status === "Completed").length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Corporate': return 'bg-purple-100 text-purple-600';
      case 'Hire': return 'bg-teal-100 text-teal-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-3">
      {/* Page Header */}
      <div>
        <h1 className="text-lg font-bold text-gray-800">Callback Requests</h1>
        <p className="text-gray-500 text-xs">Manage callback requests from potential students</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Total Requests</p>
          <p className="text-lg sm:text-xl font-bold text-gray-800">{callbacks.length}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Pending</p>
          <p className="text-lg sm:text-xl font-bold text-orange-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Scheduled</p>
          <p className="text-lg sm:text-xl font-bold text-orange-600">{scheduledCount}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Completed</p>
          <p className="text-lg sm:text-xl font-bold text-green-600">{completedCount}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg shadow-sm p-3">
        <div className="flex flex-col gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1.5">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by name, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none w-full text-sm text-gray-600"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 text-sm border border-gray-200 rounded-md text-gray-600 outline-none focus:border-[#FA8128]"
            >
              <option value="All">All Types</option>
              <option value="General">General</option>
              <option value="Corporate">Corporate</option>
              <option value="Hire">Hire From Us</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 text-sm border border-gray-200 rounded-md text-gray-600 outline-none focus:border-[#FA8128]"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
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
            <p className="text-sm font-medium text-gray-600">No callback requests yet</p>
            <p className="text-xs text-gray-400 mt-1">Callback requests will appear here</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="sm:hidden divide-y divide-gray-100">
              {callbacks.map((callback) => (
                <div key={callback._id} className="p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                      <PhoneCall size={14} className="text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-gray-800 truncate">{callback.name}</p>
                        <select
                          value={callback.status}
                          onChange={(e) => handleUpdateStatus(callback._id, e.target.value)}
                          className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium border-0 outline-none cursor-pointer ${
                            callback.status === "Pending"
                              ? "bg-orange-100 text-orange-600"
                              : callback.status === "Scheduled"
                              ? "bg-orange-100 text-orange-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Scheduled">Scheduled</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium ${getTypeColor(callback.type)}`}>
                          {callback.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-1">
                        <Phone size={10} />
                        <span className="truncate">{callback.phone}</span>
                      </div>
                      {callback.type === 'Corporate' && callback.requiredTraining && (
                        <p className="text-[10px] text-gray-500 mt-0.5 truncate">Training: {callback.requiredTraining}</p>
                      )}
                      {callback.type === 'Hire' && callback.company && (
                        <p className="text-[10px] text-gray-500 mt-0.5 truncate">Company: {callback.company}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-gray-400">{formatDate(callback.createdAt)}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setViewDetails(callback)}
                            className="p-1.5 hover:bg-orange-50 rounded-md text-[#FA8128] transition-colors"
                          >
                            <MessageSquare size={14} />
                          </button>
                          {callback.status !== "Completed" && (
                            <button
                              onClick={() => handleMarkCompleted(callback._id)}
                              className="p-1.5 hover:bg-green-50 rounded-md text-green-600 transition-colors"
                            >
                              <CheckCircle size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteClick(callback._id)}
                            className="p-1.5 hover:bg-red-50 rounded-md text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Name</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Contact</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Type</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Details</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Date</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Status</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {callbacks.map((callback) => (
                    <tr key={callback._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center">
                            <PhoneCall size={12} className="text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{callback.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Phone size={12} />
                            {callback.phone}
                          </div>
                          {callback.email && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Mail size={12} />
                              {callback.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getTypeColor(callback.type)}`}>
                          {callback.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex flex-col gap-0.5 max-w-[200px]">
                          {callback.type === 'Corporate' && callback.requiredTraining && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <BookOpen size={12} className="flex-shrink-0" />
                              <span className="truncate">{callback.requiredTraining}</span>
                            </div>
                          )}
                          {callback.type === 'Hire' && callback.company && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <Building2 size={12} className="flex-shrink-0" />
                              <span className="truncate">{callback.company}</span>
                            </div>
                          )}
                          {callback.message && (
                            <button
                              onClick={() => setViewDetails(callback)}
                              className="flex items-center gap-1 text-[10px] text-orange-600 hover:underline"
                            >
                              <MessageSquare size={10} />
                              View Message
                            </button>
                          )}
                          {!callback.requiredTraining && !callback.company && !callback.message && (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="text-xs text-gray-500">{formatDate(callback.createdAt)}</span>
                      </td>
                      <td className="py-2.5 px-4">
                        <select
                          value={callback.status}
                          onChange={(e) => handleUpdateStatus(callback._id, e.target.value)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium border-0 outline-none cursor-pointer ${
                            callback.status === "Pending"
                              ? "bg-orange-100 text-orange-600"
                              : callback.status === "Scheduled"
                              ? "bg-orange-100 text-orange-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Scheduled">Scheduled</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-1">
                          {callback.status !== "Completed" && (
                            <button
                              onClick={() => handleMarkCompleted(callback._id)}
                              className="p-1.5 hover:bg-green-50 rounded-md text-green-600 transition-colors"
                              title="Mark as Completed"
                            >
                              <CheckCircle size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteClick(callback._id)}
                            className="p-1.5 hover:bg-red-50 rounded-md text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Callback Request"
        message="Are you sure you want to delete this callback request? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* View Details Modal */}
      {viewDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-4">
              <h3 className="text-lg font-semibold text-gray-800">Callback Details</h3>
              <button
                onClick={() => setViewDetails(null)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Name</p>
                  <p className="text-sm font-medium text-gray-800">{viewDetails.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Type</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getTypeColor(viewDetails.type)}`}>
                    {viewDetails.type}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <p className="text-sm text-gray-700">{viewDetails.phone}</p>
                </div>
                {viewDetails.email && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-sm text-gray-700">{viewDetails.email}</p>
                  </div>
                )}
              </div>
              {viewDetails.type === 'Corporate' && viewDetails.requiredTraining && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Required Training</p>
                  <p className="text-sm text-gray-700">{viewDetails.requiredTraining}</p>
                </div>
              )}
              {viewDetails.type === 'Hire' && viewDetails.company && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Company</p>
                  <p className="text-sm text-gray-700">{viewDetails.company}</p>
                </div>
              )}
              {viewDetails.message && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Message</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{viewDetails.message}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    viewDetails.status === "Pending"
                      ? "bg-orange-100 text-orange-600"
                      : viewDetails.status === "Scheduled"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-green-100 text-green-600"
                  }`}>
                    {viewDetails.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Submitted On</p>
                  <p className="text-sm text-gray-700">{formatDate(viewDetails.createdAt)}</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setViewDetails(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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

export default CallbackRequests;
