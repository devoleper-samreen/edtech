import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Search, Plus, Edit2, Trash2, Trophy, X } from "lucide-react";
// @ts-ignore
import { placementService } from "../../services/placementService";
// @ts-ignore
import api from "../../config/api";
import ConfirmModal from "../../components/ConfirmModal";

interface Placement {
  _id: string;
  name: string;
  degree: string;
  score: string;
  year: string;
  dept: string;
  company: string;
  xLink: string;
  linkedinLink: string;
  instagramLink: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

const emptyForm = {
  name: "",
  degree: "",
  score: "",
  year: "",
  dept: "",
  company: "",
  xLink: "",
  linkedinLink: "",
  instagramLink: "",
  status: "Active"
};

const Placements = () => {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState<Placement | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  const [formData, setFormData] = useState({ ...emptyForm });
  const [formLoading, setFormLoading] = useState(false);
  const [showSection, setShowSection] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);

  useEffect(() => {
    fetchPlacements();
    fetchVisibility();
  }, [statusFilter, searchTerm]);

  const fetchVisibility = async () => {
    try {
      const res = await api.get('/settings/show_placements_section');
      setShowSection(res.data.data !== false);
    } catch {}
  };

  const handleToggle = async () => {
    setToggleLoading(true);
    try {
      const newVal = !showSection;
      await api.put('/settings/show_placements_section', { value: newVal });
      setShowSection(newVal);
      toast.success(`Placements section ${newVal ? 'visible' : 'hidden'} on website`);
    } catch {
      toast.error('Failed to update visibility');
    } finally {
      setToggleLoading(false);
    }
  };

  const fetchPlacements = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter !== "All") params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;
      const response = await placementService.getAllPlacements(params);
      setPlacements(response.data.placements || []);
    } catch (error) {
      console.error("Error fetching placements:", error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingPlacement(null);
    setFormData({ ...emptyForm });
    setIsModalOpen(true);
  };

  const openEditModal = (placement: Placement) => {
    setEditingPlacement(placement);
    setFormData({
      name: placement.name,
      degree: placement.degree,
      score: placement.score,
      year: placement.year,
      dept: placement.dept,
      company: placement.company,
      xLink: placement.xLink || "",
      linkedinLink: placement.linkedinLink || "",
      instagramLink: placement.instagramLink || "",
      status: placement.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingPlacement) {
        await placementService.updatePlacement(editingPlacement._id, formData);
        toast.success("Placement updated successfully!");
      } else {
        await placementService.createPlacement(formData);
        toast.success("Placement added successfully!");
      }
      setIsModalOpen(false);
      fetchPlacements();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await placementService.deletePlacement(confirmDelete.id);
      toast.success("Placement deleted successfully!");
      fetchPlacements();
    } catch (error) {
      toast.error("Failed to delete placement.");
    }
  };

  const activeCount = placements.filter(p => p.status === "Active").length;
  const inactiveCount = placements.filter(p => p.status === "Inactive").length;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Our Placements</h1>
          <p className="text-gray-500 text-xs">Manage student placement records</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Visibility Toggle */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
            <span className="text-xs text-gray-600 font-medium">Show on Website</span>
            <button
              onClick={handleToggle}
              disabled={toggleLoading}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-60 ${showSection ? 'bg-[#FA8128]' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${showSection ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 bg-[#FA8128] hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Add Placement
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Total</p>
          <p className="text-lg sm:text-xl font-bold text-gray-800">{placements.length}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Active</p>
          <p className="text-lg sm:text-xl font-bold text-green-600">{activeCount}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Inactive</p>
          <p className="text-lg sm:text-xl font-bold text-gray-400">{inactiveCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1.5 flex-1">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by name, department, company..."
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
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#FA8128] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600 text-sm">Loading placements...</p>
          </div>
        ) : placements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <Trophy size={40} className="text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-600">No placements yet</p>
            <p className="text-xs text-gray-400 mt-1">Add placement records to display on the website</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Student</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Degree / Dept</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Score</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Year</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Company</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Status</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {placements.map((p) => (
                  <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center text-[#FA8128] font-bold text-xs">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-xs text-gray-600">
                      <span className="uppercase">{p.degree || '—'}</span>
                      {p.dept && <span className="block text-gray-400">{p.dept}</span>}
                    </td>
                    <td className="py-2.5 px-4 text-xs text-gray-600">{p.score || '—'}</td>
                    <td className="py-2.5 px-4 text-xs text-gray-600">{p.year || '—'}</td>
                    <td className="py-2.5 px-4 text-xs text-gray-600">{p.company || '—'}</td>
                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${p.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEditModal(p)} className="p-1.5 hover:bg-orange-50 rounded-md text-[#FA8128] transition-colors">
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-800">
                {editingPlacement ? "Edit Placement" : "Add Placement"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-md">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-4 py-3">
              <div className="grid grid-cols-2 gap-x-5 gap-y-2">

                {/* Left Column */}
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Student Info</p>
                  {[
                    { label: "Student Name *", key: "name", placeholder: "e.g., Akshata Kasar", required: true },
                    { label: "Degree", key: "degree", placeholder: "e.g., btech, be, bca" },
                    { label: "Department", key: "dept", placeholder: "e.g., computer science" },
                    { label: "Score / CGPA", key: "score", placeholder: "e.g., 8.5 or 73.15%" },
                    { label: "Year", key: "year", placeholder: "e.g., 2025" },
                    { label: "Company Placed At", key: "company", placeholder: "e.g., TCS, Infosys" },
                  ].map(({ label, key, placeholder, required }) => (
                    <div key={key}>
                      <label className="block text-[10px] font-medium text-gray-600 mb-0.5">{label}</label>
                      <input
                        type="text"
                        required={required}
                        value={formData[key as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        placeholder={placeholder}
                        className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-md outline-none focus:border-[#FA8128]"
                      />
                    </div>
                  ))}
                </div>

                {/* Right Column */}
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Social Links (optional)</p>
                  {[
                    { label: "X (Twitter)", key: "xLink", placeholder: "https://x.com/username" },
                    { label: "LinkedIn", key: "linkedinLink", placeholder: "https://linkedin.com/in/username" },
                    { label: "Instagram", key: "instagramLink", placeholder: "https://instagram.com/username" },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="block text-[10px] font-medium text-gray-600 mb-0.5">{label}</label>
                      <input
                        type="url"
                        value={formData[key as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        placeholder={placeholder}
                        className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-md outline-none focus:border-[#FA8128]"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-[10px] font-medium text-gray-600 mb-0.5">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-md outline-none focus:border-[#FA8128]"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

              </div>

              <div className="flex gap-2 pt-3 mt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-1.5 text-xs bg-[#FA8128] text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-60"
                >
                  {formLoading ? "Saving..." : editingPlacement ? "Update" : "Add"}
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
        title="Delete Placement"
        message="Are you sure you want to delete this placement record?"
      />
    </div>
  );
};

export default Placements;
