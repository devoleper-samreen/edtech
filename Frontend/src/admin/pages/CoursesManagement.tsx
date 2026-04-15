import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Search, Edit2, Trash2, BookOpen, X } from "lucide-react";
// @ts-ignore
import { courseService } from "../../services/courseService";
// @ts-ignore
import { categoryService } from "../../services/categoryService";
import ConfirmModal from "../../components/ConfirmModal";

const CoursesManagement = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: "" });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    instructor: "",
    price: "",
    duration: "",
    level: "Beginner",
    status: "draft",
  });

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseService.getAllCourses();
      const coursesData = response.data?.courses || response.data || [];
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || course.category?._id === categoryFilter;
    const matchesStatus = !statusFilter || course.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: courses.length,
    published: courses.filter(c => c.status === 'published').length,
    draft: courses.filter(c => c.status === 'draft').length,
    totalStudents: courses.reduce((sum, c) => sum + (c.enrolledStudents || 0), 0),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await courseService.updateCourse(editingCourse._id, formData);
        toast.success("Course updated successfully!");
      } else {
        await courseService.createCourse(formData);
        toast.success("Course created successfully!");
      }
      setIsModalOpen(false);
      setEditingCourse(null);
      setFormData({
        title: "",
        description: "",
        category: "",
        instructor: "",
        price: "",
        duration: "",
        level: "Beginner",
        status: "draft",
      });
      fetchCourses();
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error("Failed to save course");
    }
  };

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category?._id || "",
      instructor: course.instructor,
      price: course.price?.toString() || "",
      duration: course.duration || "",
      level: course.level || "Beginner",
      status: course.status,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDelete({ isOpen: true, id });
  };

  const handleDelete = async () => {
    try {
      await courseService.deleteCourse(confirmDelete.id);
      toast.success("Course deleted successfully!");
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course");
    }
  };

  return (
    <div className="space-y-3">
      {/* Add/Edit Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 sticky top-0 bg-white">
              <h2 className="text-sm font-semibold text-gray-800">
                {editingCourse ? "Edit Course" : "Add New Course"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingCourse(null);
                }}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-[#FA8128]"
                  placeholder="Enter course title"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-[#FA8128]"
                  placeholder="Enter course description"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-[#FA8128]"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Instructor
                  </label>
                  <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-[#FA8128]"
                    placeholder="Instructor name"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-[#FA8128]"
                    placeholder="49999"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-[#FA8128]"
                    placeholder="e.g. 6 months"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-[#FA8128]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-[#FA8128]"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingCourse(null);
                  }}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 py-2 text-sm bg-[#FA8128] text-white rounded-md hover:bg-[#FA8128]"
                >
                  {editingCourse ? "Update Course" : "Add Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Courses Management</h1>
          <p className="text-gray-500 text-xs">Create, edit and manage your courses</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-1.5 bg-[#FA8128] text-white px-3 py-1.5 rounded-md text-sm hover:bg-[#FA8128] transition-colors w-full sm:w-auto"
        >
          <Plus size={16} />
          Add Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Total Courses</p>
          <p className="text-lg sm:text-xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Published</p>
          <p className="text-lg sm:text-xl font-bold text-green-600">{stats.published}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Drafts</p>
          <p className="text-lg sm:text-xl font-bold text-yellow-600">{stats.draft}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Total Students</p>
          <p className="text-lg sm:text-xl font-bold text-[#FA8128]">{stats.totalStudents}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg shadow-sm p-3">
        <div className="flex flex-col gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1.5">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none w-full text-sm text-gray-600"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-600 outline-none focus:border-[#FA8128]"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-600 outline-none focus:border-[#FA8128]"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#FA8128] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600 text-sm">Loading courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
            <BookOpen size={40} className="text-gray-300 mb-3 sm:w-12 sm:h-12" />
            <p className="text-sm font-medium text-gray-600">No courses found</p>
            <p className="text-xs text-gray-400 mt-1">
              {courses.length === 0 ? "Add your first course to get started" : "Try adjusting your filters"}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="sm:hidden divide-y divide-gray-100">
              {filteredCourses.map((course) => (
                <div key={course._id} className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-md flex items-center justify-center shrink-0">
                      <BookOpen size={16} className="text-[#FA8128]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{course.title}</p>
                          <p className="text-[10px] text-gray-500">{course.level} • {course.duration}</p>
                        </div>
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium shrink-0 ${
                            course.status === "published"
                              ? "bg-green-100 text-green-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {course.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs">
                          <span className="text-gray-500">{course.category?.name || "N/A"}</span>
                          <span className="mx-1 text-gray-300">•</span>
                          <span className="font-medium text-gray-800">₹{course.price?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(course)}
                            className="p-1.5 hover:bg-orange-50 rounded-md text-[#FA8128] transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(course._id)}
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
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Category</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Instructor</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Duration</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Price</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Status</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr key={course._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-orange-100 rounded-md flex items-center justify-center">
                            <BookOpen size={14} className="text-[#FA8128]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{course.title}</p>
                            <p className="text-[10px] text-gray-500">{course.level}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-xs text-gray-600">
                        {course.category?.name || "N/A"}
                      </td>
                      <td className="py-2.5 px-4 text-xs text-gray-600">{course.instructor}</td>
                      <td className="py-2.5 px-4 text-xs text-gray-600">{course.duration}</td>
                      <td className="py-2.5 px-4 text-xs font-medium text-gray-800">
                        ₹{course.price?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                            course.status === "published"
                              ? "bg-green-100 text-green-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {course.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(course)}
                            className="p-1.5 hover:bg-orange-50 rounded-md text-[#FA8128] transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(course._id)}
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

            {/* Pagination */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Showing {filteredCourses.length} of {courses.length} courses
              </p>
            </div>
          </>
        )}
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: "" })}
        onConfirm={handleDelete}
        title="Delete Course"
        message="Are you sure you want to delete this course? This action cannot be undone and will remove all associated data."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default CoursesManagement;
