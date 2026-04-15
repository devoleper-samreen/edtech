import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Search, Plus, Edit2, Trash2, Quote, Star, X } from "lucide-react";
import { testimonialService } from "../../services/testimonialService";
import ConfirmModal from "../../components/ConfirmModal";

interface Testimonial {
  _id: string;
  company: string;
  contactPerson: string;
  designation: string;
  shortText: string;
  fullText: string;
  rating: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });

  const [formData, setFormData] = useState({
    company: "",
    contactPerson: "",
    designation: "",
    shortText: "",
    fullText: "",
    rating: 5,
    status: "Active"
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, [statusFilter]);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter !== "All") params.status = statusFilter;

      const response = await testimonialService.getAllTestimonials(params);
      setTestimonials(response.data.testimonials || []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        company: testimonial.company,
        contactPerson: testimonial.contactPerson,
        designation: testimonial.designation,
        shortText: testimonial.shortText,
        fullText: testimonial.fullText,
        rating: testimonial.rating,
        status: testimonial.status
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        company: "",
        contactPerson: "",
        designation: "",
        shortText: "",
        fullText: "",
        rating: 5,
        status: "Active"
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTestimonial(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.company || !formData.contactPerson || !formData.designation || !formData.shortText || !formData.fullText) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.shortText.length > 150) {
      toast.error("Short text must be 150 characters or less");
      return;
    }

    setFormLoading(true);
    try {
      if (editingTestimonial) {
        await testimonialService.updateTestimonial(editingTestimonial._id, formData);
        toast.success("Testimonial updated successfully!");
      } else {
        await testimonialService.createTestimonial(formData);
        toast.success("Testimonial created successfully!");
      }
      handleCloseModal();
      fetchTestimonials();
    } catch (error) {
      console.error("Error saving testimonial:", error);
      toast.error("Failed to save testimonial");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDelete({ isOpen: true, id });
  };

  const handleDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      await testimonialService.deleteTestimonial(confirmDelete.id);
      toast.success("Testimonial deleted successfully!");
      fetchTestimonials();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error("Failed to delete testimonial");
    }
  };

  const handleToggleStatus = async (testimonial: Testimonial) => {
    try {
      const newStatus = testimonial.status === 'Active' ? 'Inactive' : 'Active';
      await testimonialService.updateTestimonial(testimonial._id, { status: newStatus });
      toast.success(`Testimonial ${newStatus === 'Active' ? 'activated' : 'deactivated'}!`);
      fetchTestimonials();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const filteredTestimonials = testimonials.filter(t =>
    t.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = testimonials.filter(t => t.status === 'Active').length;

  return (
    <div className="space-y-3">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Testimonials</h1>
          <p className="text-gray-500 text-xs">Manage client testimonials</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-1 sm:gap-1.5 bg-[#FA8128] hover:bg-[#FA8128] text-white px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors"
        >
          <Plus size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Add Testimonial</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Total</p>
          <p className="text-lg sm:text-xl font-bold text-gray-800">{testimonials.length}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Active</p>
          <p className="text-lg sm:text-xl font-bold text-green-600">{activeCount}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Inactive</p>
          <p className="text-lg sm:text-xl font-bold text-gray-400">{testimonials.length - activeCount}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg shadow-sm p-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1.5 flex-1">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by company, contact..."
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

      {/* Testimonials Grid */}
      <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#FA8128] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600 text-sm">Loading testimonials...</p>
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
            <Quote size={40} className="text-gray-300 mb-3 sm:w-12 sm:h-12" />
            <p className="text-sm font-medium text-gray-600">No testimonials found</p>
            <p className="text-xs text-gray-400 mt-1">Add your first testimonial to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredTestimonials.map((testimonial) => (
              <div
                key={testimonial._id}
                className="border border-gray-100 rounded-xl p-3 sm:p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs sm:text-base shrink-0">
                      {testimonial.company.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{testimonial.company}</h3>
                      <p className="text-[10px] sm:text-xs text-gray-500 truncate">{testimonial.contactPerson}</p>
                    </div>
                  </div>
                  <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium shrink-0 ${
                    testimonial.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {testimonial.status}
                  </span>
                </div>

                <p className="text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2">{testimonial.designation}</p>

                <div className="flex items-center gap-0.5 mb-1.5 sm:mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      className={`sm:w-3 sm:h-3 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                    />
                  ))}
                </div>

                <p className="text-[10px] sm:text-xs text-gray-600 mb-2 sm:mb-3 line-clamp-3">"{testimonial.shortText}"</p>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleToggleStatus(testimonial)}
                    className={`text-[10px] sm:text-xs font-medium ${
                      testimonial.status === 'Active' ? 'text-orange-500 hover:text-orange-600' : 'text-green-500 hover:text-green-600'
                    }`}
                  >
                    {testimonial.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(testimonial)}
                      className="p-1.5 hover:bg-orange-50 rounded-md text-orange-600 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(testimonial._id)}
                      className="p-1.5 hover:bg-red-50 rounded-md text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 sticky top-0 bg-white">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-3 sm:space-y-4">
              {/* Company */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g., TechCorp India Pvt Ltd"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#FA8128]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Contact Person */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="e.g., Rahul Sharma"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#FA8128]"
                    required
                  />
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g., HR Manager"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#FA8128]"
                    required
                  />
                </div>
              </div>

              {/* Short Text */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Short Text <span className="text-red-500">*</span>
                  <span className="text-gray-400 font-normal ml-1">({formData.shortText.length}/150)</span>
                </label>
                <input
                  type="text"
                  value={formData.shortText}
                  onChange={(e) => setFormData({ ...formData, shortText: e.target.value.slice(0, 150) })}
                  placeholder="Brief testimonial preview (max 150 chars)"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#FA8128]"
                  required
                />
              </div>

              {/* Full Text */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Full Testimonial <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.fullText}
                  onChange={(e) => setFormData({ ...formData, fullText: e.target.value })}
                  placeholder="Complete testimonial text..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#FA8128] resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Rating */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="p-0.5 sm:p-1"
                      >
                        <Star
                          size={18}
                          className={`sm:w-5 sm:h-5 ${star <= formData.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Status</label>
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

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-2 text-sm font-medium bg-[#FA8128] hover:bg-[#FA8128] text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {formLoading ? 'Saving...' : editingTestimonial ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Testimonials;
