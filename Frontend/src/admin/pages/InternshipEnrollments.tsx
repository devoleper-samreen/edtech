import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Search, Trash2, Mail, Phone, Briefcase } from "lucide-react";
// @ts-ignore
import api from "../../config/api";
import ConfirmModal from "../../components/ConfirmModal";

interface Enrollment {
  _id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  status: string;
  paymentStatus: string;
  amount: number;
  createdAt: string;
}

const InternshipEnrollments = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });

  useEffect(() => { fetchEnrollments(); }, [statusFilter, searchTerm]);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter !== "All") params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;
      const res = await api.get('/internship-enrollments', { params });
      setEnrollments(res.data.data.enrollments || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/internship-enrollments/${confirmDelete.id}`);
      toast.success("Enrollment deleted!");
      fetchEnrollments();
    } catch { toast.error("Failed to delete"); }
  };


  const unpaidCount = enrollments.filter(e => e.status === "Unpaid").length;
  const paidCount = enrollments.filter(e => e.status === "Paid").length;

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-lg font-bold text-gray-800">Internship Enrollments</h1>
        <p className="text-gray-500 text-xs">Manage internship program enrollments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Total</p>
          <p className="text-lg sm:text-xl font-bold text-gray-800">{enrollments.length}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Unpaid</p>
          <p className="text-lg sm:text-xl font-bold text-orange-600">{unpaidCount}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Paid</p>
          <p className="text-lg sm:text-xl font-bold text-green-600">{paidCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1.5 flex-1">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input type="text" placeholder="Search by name, email, program..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none w-full text-sm text-gray-600" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-md text-gray-600 outline-none focus:border-[#FA8128] w-full sm:w-auto">
            <option value="All">All Status</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#FA8128] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600 text-sm">Loading enrollments...</p>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <Briefcase size={40} className="text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-600">No internship enrollments yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Student</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Contact</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Program</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Amount</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Status</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((e) => (
                  <tr key={e._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center text-[#FA8128] font-bold text-xs">
                          {e.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{e.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600"><Mail size={12} />{e.email}</div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-600"><Phone size={12} />{e.phone}</div>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-xs text-gray-600 max-w-[150px] truncate">{e.program}</td>
                    <td className="py-2.5 px-4 text-xs font-medium text-gray-800">
                      {e.amount > 0 ? `₹${e.amount.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${e.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <button onClick={() => setConfirmDelete({ isOpen: true, id: e._id })}
                        className="p-1.5 hover:bg-red-50 rounded-md text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Enrollment"
        message="Are you sure you want to delete this enrollment?"
      />
    </div>
  );
};

export default InternshipEnrollments;
