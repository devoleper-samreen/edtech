import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Search, Eye, Trash2, MessageSquare, Mail, Phone } from "lucide-react";
// @ts-ignore
import { enquiryService } from "../../services/enquiryService";
import ConfirmModal from "../../components/ConfirmModal";

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  message: string;
  status: string;
  createdAt?: string;
}

interface ConfirmDeleteState {
  isOpen: boolean;
  id: string | null;
}

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ConfirmDeleteState>({ isOpen: false, id: null });

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter, searchTerm]);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const params = {
        ...(statusFilter !== "All" && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      };
      const response = await enquiryService.getAllEnquiries(params);
      setEnquiries(response.data.enquiries);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await enquiryService.updateEnquiry(id, { status });
      toast.success("Enquiry status updated!");
      fetchEnquiries();
    } catch (error) {
      console.error("Error updating enquiry:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDelete({ isOpen: true, id });
  };

  const handleDelete = async () => {
    try {
      await enquiryService.deleteEnquiry(confirmDelete.id);
      toast.success("Enquiry deleted successfully!");
      fetchEnquiries();
    } catch (error) {
      console.error("Error deleting enquiry:", error);
      toast.error("Failed to delete enquiry");
    }
  };

  const newCount = enquiries.filter((e: Enquiry) => e.status === "New").length;
  const contactedCount = enquiries.filter((e: Enquiry) => e.status === "Contacted").length;
  const resolvedCount = enquiries.filter((e: Enquiry) => e.status === "Resolved").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-orange-100 text-orange-600";
      case "Contacted": return "bg-yellow-100 text-yellow-600";
      case "Resolved": return "bg-green-100 text-green-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-3">
      {/* Page Header */}
      <div>
        <h1 className="text-lg font-bold text-gray-800">Enquiries</h1>
        <p className="text-gray-500 text-xs">Manage and respond to student enquiries</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Total Enquiries</p>
          <p className="text-lg sm:text-xl font-bold text-gray-800">{enquiries.length}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">New</p>
          <p className="text-lg sm:text-xl font-bold text-orange-600">{newCount}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Contacted</p>
          <p className="text-lg sm:text-xl font-bold text-yellow-600">{contactedCount}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Resolved</p>
          <p className="text-lg sm:text-xl font-bold text-green-600">{resolvedCount}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg shadow-sm p-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1.5 flex-1">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search enquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none w-full text-sm text-gray-600"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-md text-gray-600 outline-none focus:border-[#FA8128] w-full sm:w-auto"
          >
            <option value="All">All Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Enquiries List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#FA8128] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600 text-sm">Loading enquiries...</p>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
            <MessageSquare size={40} className="text-gray-300 mb-3 sm:w-12 sm:h-12" />
            <p className="text-sm font-medium text-gray-600">No enquiries yet</p>
            <p className="text-xs text-gray-400 mt-1">Student enquiries will appear here</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="sm:hidden divide-y divide-gray-100">
              {enquiries.map((enquiry) => (
                <div key={enquiry._id} className="p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                      <MessageSquare size={14} className="text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-gray-800 truncate">{enquiry.name}</p>
                        <select
                          value={enquiry.status}
                          onChange={(e) => handleUpdateStatus(enquiry._id, e.target.value)}
                          className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium border-0 outline-none cursor-pointer ${getStatusColor(enquiry.status)}`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5 truncate">{enquiry.course}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{enquiry.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                          <Phone size={10} />
                          <span>{enquiry.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelectedEnquiry(enquiry)}
                            className="p-1.5 hover:bg-orange-50 rounded-md text-[#FA8128] transition-colors"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(enquiry._id)}
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
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Student</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Contact</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Course</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Message</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Status</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((enquiry) => (
                    <tr key={enquiry._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center">
                            <MessageSquare size={12} className="text-purple-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-800">{enquiry.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Mail size={12} />
                            {enquiry.email}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Phone size={12} />
                            {enquiry.phone}
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-xs text-gray-600">{enquiry.course}</td>
                      <td className="py-2.5 px-4">
                        <p className="text-gray-600 text-xs truncate max-w-[150px]" title={enquiry.message}>
                          {enquiry.message}
                        </p>
                      </td>
                      <td className="py-2.5 px-4">
                        <select
                          value={enquiry.status}
                          onChange={(e) => handleUpdateStatus(enquiry._id, e.target.value)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium border-0 outline-none ${getStatusColor(enquiry.status)}`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelectedEnquiry(enquiry)}
                            className="p-1.5 hover:bg-orange-50 rounded-md text-[#FA8128] transition-colors"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(enquiry._id)}
                            className="p-1.5 hover:bg-red-50 rounded-md text-red-500 transition-colors"
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

      {/* View Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sticky top-0 bg-white">
              <h2 className="text-sm font-semibold text-gray-800">Enquiry Details</h2>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Name</p>
                <p className="text-sm text-gray-800">{selectedEnquiry.name}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Email</p>
                <p className="text-sm text-gray-800 break-all">{selectedEnquiry.email}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Phone</p>
                <p className="text-sm text-gray-800">{selectedEnquiry.phone}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Course</p>
                <p className="text-sm text-gray-800">{selectedEnquiry.course}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Message</p>
                <p className="text-sm text-gray-800">{selectedEnquiry.message}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Status</p>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(selectedEnquiry.status)}`}>
                  {selectedEnquiry.status}
                </span>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 sticky bottom-0 bg-white">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="w-full px-3 py-2.5 text-sm bg-gray-100 rounded-md hover:bg-gray-200 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Enquiry"
        message="Are you sure you want to delete this enquiry? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Enquiries;
