import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Search, Plus, Edit2, Trash2, Calendar, Clock, X } from "lucide-react";
import { batchService } from "../../services/batchService";

interface Batch {
  _id: string;
  course: {
    _id: string;
    title: string;
    name?: string;
  } | string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  startDate: string;
  timing: string;
  days: 'Weekday' | 'Weekend' | 'Daily';
  contact: string;
  maxStudents: number;
  enrolledCount: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}
// @ts-ignore
import { courseService } from "../../services/courseService";
import ConfirmModal from "../../components/ConfirmModal";

interface Course {
  _id: string;
  title: string;
  name?: string;
}

const Batches = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });

  const [formData, setFormData] = useState({
    course: "",
    mode: "Online",
    startDate: "",
    timing: "",
    days: "Weekday",
    contact: "",
    maxStudents: 30,
    status: "Upcoming"
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchBatches();
    fetchCourses();
  }, [statusFilter, courseFilter]);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter !== "All") params.status = statusFilter;
      if (courseFilter !== "All") params.course = courseFilter;

      const response = await batchService.getAllBatches(params);
      setBatches(response.data.batches || []);
    } catch (error) {
      console.error("Error fetching batches:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await courseService.getAllCourses({ limit: 100 });
      setCourses(response.data?.courses || response.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleOpenModal = (batch?: Batch) => {
    if (batch) {
      setEditingBatch(batch);
      const courseId = typeof batch.course === 'object' ? batch.course._id : batch.course;
      setFormData({
        course: courseId,
        mode: batch.mode,
        startDate: new Date(batch.startDate).toISOString().split('T')[0],
        timing: batch.timing,
        days: batch.days,
        contact: batch.contact || "",
        maxStudents: batch.maxStudents,
        status: batch.status
      });
    } else {
      setEditingBatch(null);
      setFormData({
        course: "",
        mode: "Online",
        startDate: "",
        timing: "",
        days: "Weekday",
        contact: "",
        maxStudents: 30,
        status: "Upcoming"
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBatch(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.course || !formData.startDate || !formData.timing) {
      toast.error("Please fill all required fields");
      return;
    }

    setFormLoading(true);
    try {
      if (editingBatch) {
        await batchService.updateBatch(editingBatch._id, formData);
        toast.success("Batch updated successfully!");
      } else {
        await batchService.createBatch(formData);
        toast.success("Batch created successfully!");
      }
      handleCloseModal();
      fetchBatches();
    } catch (error) {
      console.error("Error saving batch:", error);
      toast.error("Failed to save batch");
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
      await batchService.deleteBatch(confirmDelete.id);
      toast.success("Batch deleted successfully!");
      fetchBatches();
    } catch (error) {
      console.error("Error deleting batch:", error);
      toast.error("Failed to delete batch");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming': return 'bg-orange-100 text-orange-600';
      case 'Ongoing': return 'bg-green-100 text-green-600';
      case 'Completed': return 'bg-gray-100 text-gray-600';
      case 'Cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'Online': return 'bg-purple-100 text-purple-600';
      case 'Offline': return 'bg-orange-100 text-orange-600';
      case 'Hybrid': return 'bg-teal-100 text-teal-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getCourseName = (course: Batch['course']) => {
    if (typeof course === 'object' && course !== null) {
      return course.title || course.name || 'Unknown';
    }
    return 'Unknown';
  };

  const filteredBatches = batches.filter(batch => {
    const courseName = getCourseName(batch.course).toLowerCase();
    return courseName.includes(searchTerm.toLowerCase()) ||
           batch.timing.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const upcomingCount = batches.filter(b => b.status === 'Upcoming').length;
  const ongoingCount = batches.filter(b => b.status === 'Ongoing').length;

  return (
    <div className="space-y-3">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Batches</h1>
          <p className="text-gray-500 text-xs">Manage course batches and schedules</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-1 sm:gap-1.5 bg-[#FA8128] hover:bg-[#FA8128] text-white px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors"
        >
          <Plus size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Add Batch</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Total Batches</p>
          <p className="text-lg sm:text-xl font-bold text-gray-800">{batches.length}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Upcoming</p>
          <p className="text-lg sm:text-xl font-bold text-orange-600">{upcomingCount}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Ongoing</p>
          <p className="text-lg sm:text-xl font-bold text-green-600">{ongoingCount}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Total Courses</p>
          <p className="text-lg sm:text-xl font-bold text-purple-600">{courses.length}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg shadow-sm p-3">
        <div className="flex flex-col gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1.5">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by course, timing..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none w-full text-sm text-gray-600"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 text-sm border border-gray-200 rounded-md text-gray-600 outline-none focus:border-[#FA8128]"
            >
              <option value="All">All Courses</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>{course.title || course.name}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 text-sm border border-gray-200 rounded-md text-gray-600 outline-none focus:border-[#FA8128]"
            >
              <option value="All">All Status</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Batches List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#FA8128] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600 text-sm">Loading batches...</p>
          </div>
        ) : filteredBatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
            <Calendar size={40} className="text-gray-300 mb-3 sm:w-12 sm:h-12" />
            <p className="text-sm font-medium text-gray-600">No batches found</p>
            <p className="text-xs text-gray-400 mt-1">Create a new batch to get started</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="sm:hidden divide-y divide-gray-100">
              {filteredBatches.map((batch) => (
                <div key={batch._id} className="p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                      <Calendar size={14} className="text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-gray-800 truncate">{getCourseName(batch.course)}</p>
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium shrink-0 ${getStatusColor(batch.status)}`}>
                          {batch.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium ${getModeColor(batch.mode)}`}>
                          {batch.mode}
                        </span>
                        <span className="text-[10px] text-gray-500">{batch.days}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-1">
                        <Clock size={10} />
                        <span>{batch.timing}</span>
                        <span className="mx-1">|</span>
                        <span>{formatDate(batch.startDate)}</span>
                      </div>
                      {batch.contact && (
                        <p className="text-[10px] text-[#FA8128] mt-0.5">Contact: {batch.contact}</p>
                      )}
                      <div className="flex items-center justify-end mt-2">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenModal(batch)}
                            className="p-1.5 hover:bg-orange-50 rounded-md text-orange-600 transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(batch._id)}
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
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Course</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Mode</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Start Date</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Timing</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Days</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Contact</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Status</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBatches.map((batch) => (
                    <tr key={batch._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center">
                            <Calendar size={12} className="text-orange-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-800 max-w-[200px] truncate">
                            {getCourseName(batch.course)}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getModeColor(batch.mode)}`}>
                          {batch.mode}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-xs text-gray-600">{formatDate(batch.startDate)}</td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Clock size={12} />
                          {batch.timing}
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-xs text-gray-600">{batch.days}</td>
                      <td className="py-2.5 px-4 text-xs text-[#FA8128]">{batch.contact || '-'}</td>
                      <td className="py-2.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(batch.status)}`}>
                          {batch.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenModal(batch)}
                            className="p-1.5 hover:bg-orange-50 rounded-md text-orange-600 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(batch._id)}
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 sticky top-0 bg-white">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                {editingBatch ? 'Edit Batch' : 'Add New Batch'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-3 sm:space-y-4">
              {/* Course Select */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Course <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#FA8128]"
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>{course.title || course.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Mode */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Mode</label>
                  <select
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#FA8128]"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                {/* Days */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Days</label>
                  <select
                    value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#FA8128]"
                  >
                    <option value="Weekday">Weekday</option>
                    <option value="Weekend">Weekend</option>
                    <option value="Daily">Daily</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Start Date */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#FA8128]"
                    required
                  />
                </div>

                {/* Timing */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Timing <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.timing}
                    onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                    placeholder="e.g., 07:00 PM"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#FA8128]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Contact */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Contact</label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="e.g., 8951965091"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#FA8128]"
                  />
                </div>

                {/* Max Students */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Max Students</label>
                  <input
                    type="number"
                    value={formData.maxStudents}
                    onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#FA8128]"
                  />
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
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
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
                  {formLoading ? 'Saving...' : editingBatch ? 'Update' : 'Create'}
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
        title="Delete Batch"
        message="Are you sure you want to delete this batch? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Batches;
