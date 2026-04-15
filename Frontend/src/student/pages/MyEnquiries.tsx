import { useState, useEffect } from "react";
import { MessageSquare, Clock, CheckCircle, AlertCircle, Eye } from "lucide-react";
import { studentService } from "../../services/studentService";

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  message: string;
  status: string;
  createdAt: string;
}

const MyEnquiries = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const params = statusFilter !== "All" ? { status: statusFilter } : {};
      const response = await studentService.getMyEnquiries(params);
      setEnquiries(response.data || []);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
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
      case "New":
        return <AlertCircle size={14} className="text-orange-600" />;
      case "Contacted":
        return <Clock size={14} className="text-yellow-600" />;
      case "Resolved":
        return <CheckCircle size={14} className="text-green-600" />;
      default:
        return <MessageSquare size={14} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-orange-100 text-orange-600";
      case "Contacted":
        return "bg-yellow-100 text-yellow-600";
      case "Resolved":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const newCount = enquiries.filter(e => e.status === "New").length;
  const contactedCount = enquiries.filter(e => e.status === "Contacted").length;
  const resolvedCount = enquiries.filter(e => e.status === "Resolved").length;

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div>
        <h1 className="text-lg font-bold text-gray-800">My Enquiries</h1>
        <p className="text-gray-500 text-xs">Track the status of your enquiries</p>
      </div>

      {/* Stats - 2x2 grid on mobile, 4 columns on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Total Enquiries</p>
          <p className="text-xl font-bold text-gray-800">{enquiries.length}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">New</p>
          <p className="text-xl font-bold text-orange-600">{newCount}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Contacted</p>
          <p className="text-xl font-bold text-yellow-600">{contactedCount}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Resolved</p>
          <p className="text-xl font-bold text-green-600">{resolvedCount}</p>
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
            <option value="All">All Enquiries</option>
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
            <p className="text-sm font-medium text-gray-600">No enquiries found</p>
            <p className="text-xs text-gray-400 mt-1">You haven't submitted any enquiries yet</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="sm:hidden divide-y divide-gray-100">
              {enquiries.map((enquiry) => (
                <div key={enquiry._id} className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                      <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        {getStatusIcon(enquiry.status)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-800 truncate">{enquiry.course}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{enquiry.message}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{formatDate(enquiry.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium ${getStatusColor(enquiry.status)}`}>
                        {enquiry.status}
                      </span>
                      <button
                        onClick={() => setSelectedEnquiry(enquiry)}
                        className="p-1.5 hover:bg-orange-50 rounded-md text-[#FA8128] transition-colors"
                      >
                        <Eye size={14} />
                      </button>
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
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Course</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Message</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Status</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Date</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((enquiry) => (
                    <tr key={enquiry._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center">
                            {getStatusIcon(enquiry.status)}
                          </div>
                          <span className="text-sm font-medium text-gray-800">{enquiry.course}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <p className="text-gray-600 text-xs truncate max-w-[200px]" title={enquiry.message}>
                          {enquiry.message}
                        </p>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(enquiry.status)}`}>
                          {enquiry.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-xs text-gray-500">
                        {formatDate(enquiry.createdAt)}
                      </td>
                      <td className="py-2.5 px-4">
                        <button
                          onClick={() => setSelectedEnquiry(enquiry)}
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
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-sm font-semibold text-gray-800">Enquiry Details</h2>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Course</p>
                <p className="text-sm text-gray-800">{selectedEnquiry.course}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Message</p>
                <p className="text-sm text-gray-800">{selectedEnquiry.message}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">Status</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(selectedEnquiry.status)}`}>
                    {selectedEnquiry.status}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">Submitted On</p>
                  <p className="text-sm text-gray-800">{formatDate(selectedEnquiry.createdAt)}</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 sticky bottom-0 bg-white">
              <button
                onClick={() => setSelectedEnquiry(null)}
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

export default MyEnquiries;
