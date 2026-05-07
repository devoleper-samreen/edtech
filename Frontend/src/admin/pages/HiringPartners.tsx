import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit2, X, Building2 } from "lucide-react";
// @ts-ignore
import { hiringPartnerService } from "../../services/hiringPartnerService";
import ConfirmModal from "../../components/ConfirmModal";

interface Partner {
  _id: string;
  name: string;
  status: "Active" | "Inactive";
}

const HiringPartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [formData, setFormData] = useState({ name: "", status: "Active" });
  const [formLoading, setFormLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await hiringPartnerService.getAllPartners();
      setPartners(res.data || []);
    } catch {
      toast.error("Failed to load hiring partners");
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setFormData({ name: "", status: "Active" });
    setIsModalOpen(true);
  };

  const openEdit = (p: Partner) => {
    setEditing(p);
    setFormData({ name: p.name, status: p.status });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Partner name is required");
      return;
    }
    setFormLoading(true);
    try {
      if (editing) {
        await hiringPartnerService.updatePartner(editing._id, formData);
        toast.success("Partner updated!");
      } else {
        await hiringPartnerService.createPartner(formData);
        toast.success("Partner added!");
      }
      setIsModalOpen(false);
      fetchPartners();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await hiringPartnerService.deletePartner(confirmDelete.id);
      toast.success("Partner deleted!");
      fetchPartners();
    } catch {
      toast.error("Failed to delete partner");
    }
  };

  const activeCount = partners.filter(p => p.status === "Active").length;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Hiring Partners</h1>
          <p className="text-gray-500 text-xs">Manage companies shown in the marquee on the website</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 bg-[#FA8128] hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Partner
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Total</p>
          <p className="text-lg sm:text-xl font-bold text-gray-800">{partners.length}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Active</p>
          <p className="text-lg sm:text-xl font-bold text-green-600">{activeCount}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Inactive</p>
          <p className="text-lg sm:text-xl font-bold text-gray-400">{partners.length - activeCount}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#FA8128] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600 text-sm">Loading...</p>
          </div>
        ) : partners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <Building2 size={40} className="text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-600">No hiring partners yet</p>
            <p className="text-xs text-gray-400 mt-1">Add partner names to show in the marquee on the website</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">#</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Company Name</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Status</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((p, i) => (
                  <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 px-4 text-xs text-gray-400">{i + 1}</td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center text-[#FA8128] font-bold text-xs">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${p.status === "Active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-orange-50 rounded-md text-[#FA8128] transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => setConfirmDelete({ isOpen: true, id: p._id })} className="p-1.5 hover:bg-red-50 rounded-md text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-800">
                {editing ? "Edit Partner" : "Add Hiring Partner"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-md">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-4 py-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Infosys, TCS, Wipro"
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#FA8128]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#FA8128]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-2 text-xs bg-[#FA8128] text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-60"
                >
                  {formLoading ? "Saving..." : editing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Partner"
        message="Are you sure you want to remove this hiring partner?"
      />
    </div>
  );
};

export default HiringPartners;
