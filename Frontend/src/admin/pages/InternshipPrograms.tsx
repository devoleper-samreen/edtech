import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Search, Plus, Edit2, Trash2, BookOpen, X, Users, Upload } from "lucide-react";
// @ts-ignore
import { internshipService } from "../../services/internshipService";
// @ts-ignore
import api from "../../config/api";
import ConfirmModal from "../../components/ConfirmModal";

interface Program {
  _id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  thumbnail: string;
  earlyBirdDeadline: string;
  enrolledCount: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

const emptyForm = {
  title: "",
  description: "",
  duration: "",
  price: "",
  thumbnail: "",
  earlyBirdDeadline: "",
  status: "Active"
};

const InternshipPrograms = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  const [formData, setFormData] = useState({ ...emptyForm });
  const [formLoading, setFormLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPrograms();
  }, [statusFilter, searchTerm]);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter !== "All") params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;
      const response = await internshipService.getAllPrograms(params);
      setPrograms(response.data.programs || []);
    } catch (error) {
      console.error("Error fetching programs:", error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProgram(null);
    setFormData({ ...emptyForm });
    setIsModalOpen(true);
  };

  const openEditModal = (program: Program) => {
    setEditingProgram(program);
    setFormData({
      title: program.title,
      description: program.description,
      duration: program.duration || "",
      price: program.price?.toString() || "",
      thumbnail: program.thumbnail || "",
      earlyBirdDeadline: program.earlyBirdDeadline || "",
      status: program.status
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const form = new FormData();
      form.append('image', file);
      const res = await api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setFormData(prev => ({ ...prev, thumbnail: res.data.data.url }));
      toast.success('Image uploaded!');
    } catch {
      toast.error('Image upload failed');
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = {
        ...formData,
        price: formData.price ? Number(formData.price) : 0,
      };
      if (editingProgram) {
        await internshipService.updateProgram(editingProgram._id, payload);
        toast.success("Program updated successfully!");
      } else {
        await internshipService.createProgram(payload);
        toast.success("Program added successfully!");
      }
      setIsModalOpen(false);
      fetchPrograms();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await internshipService.deleteProgram(confirmDelete.id);
      toast.success("Program deleted successfully!");
      fetchPrograms();
    } catch {
      toast.error("Failed to delete program.");
    }
  };

  const activeCount = programs.filter(p => p.status === "Active").length;
  const totalEnrolled = programs.reduce((sum, p) => sum + (p.enrolledCount || 0), 0);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Internship Programs</h1>
          <p className="text-gray-500 text-xs">Manage summer internship programs</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 bg-[#FA8128] hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Program
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Total Programs</p>
          <p className="text-lg sm:text-xl font-bold text-gray-800">{programs.length}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Active</p>
          <p className="text-lg sm:text-xl font-bold text-green-600">{activeCount}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Total Enrolled</p>
          <p className="text-lg sm:text-xl font-bold text-[#FA8128]">{totalEnrolled}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1.5 flex-1">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search programs..."
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
            <option value="All">All</option>
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
            <p className="mt-3 text-gray-600 text-sm">Loading programs...</p>
          </div>
        ) : programs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <BookOpen size={40} className="text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-600">No programs yet</p>
            <p className="text-xs text-gray-400 mt-1">Add internship programs to display on the website</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Program</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Duration</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Price</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Enrolled</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Status</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((p) => (
                  <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        {p.thumbnail ? (
                          <img src={p.thumbnail} alt={p.title} className="w-8 h-8 rounded-lg object-cover" />
                        ) : (
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <BookOpen size={14} className="text-[#FA8128]" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-800">{p.title}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[200px]">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-xs text-gray-600">{p.duration || '—'}</td>
                    <td className="py-2.5 px-4 text-xs text-gray-600">
                      {p.price > 0 ? `₹${p.price.toLocaleString('en-IN')}` : 'Free'}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-1 text-xs text-[#FA8128] font-semibold">
                        <Users size={12} />
                        {p.enrolledCount || 0}
                      </div>
                    </td>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-800">
                {editingProgram ? "Edit Program" : "Add Program"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-md">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Full Stack Web Development"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#FA8128]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the program"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#FA8128] resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 6 Weeks"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#FA8128]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., 4999"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#FA8128]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Thumbnail</label>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                {formData.thumbnail ? (
                  <div className="relative">
                    <img src={formData.thumbnail} alt="thumbnail" className="w-full h-28 object-cover rounded-lg border border-gray-200" />
                    <button
                      type="button"
                      onClick={() => { setFormData({ ...formData, thumbnail: "" }); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageUploading}
                    className="w-full h-20 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-[#FA8128] transition-colors disabled:opacity-60"
                  >
                    {imageUploading ? (
                      <div className="w-5 h-5 border-2 border-[#FA8128] border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Upload size={18} className="text-gray-400" />
                        <span className="text-xs text-gray-400">Click to upload image</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Early Bird Deadline</label>
                  <input
                    type="text"
                    value={formData.earlyBirdDeadline}
                    onChange={(e) => setFormData({ ...formData, earlyBirdDeadline: e.target.value })}
                    placeholder="e.g., 30 April 2026"
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
                  {formLoading ? "Saving..." : editingProgram ? "Update" : "Add"}
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
        title="Delete Program"
        message="Are you sure you want to delete this internship program?"
      />
    </div>
  );
};

export default InternshipPrograms;
