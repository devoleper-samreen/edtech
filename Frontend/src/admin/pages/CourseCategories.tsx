import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Search, Edit2, Trash2, FolderTree, X, TrendingUp, Layers } from "lucide-react";
// @ts-ignore
import { categoryService } from "../../services/categoryService";
import ConfirmModal from "../../components/ConfirmModal";

interface Category {
  _id: string;
  name: string;
  description?: string;
  status: string;
  coursesCount?: number;
}

interface FormData {
  name: string;
  description: string;
  status: string;
}

interface ConfirmDeleteState {
  isOpen: boolean;
  id: string | null;
}

const CourseCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<FormData>({ name: "", description: "", status: "Active" });
  const [confirmDelete, setConfirmDelete] = useState<ConfirmDeleteState>({ isOpen: false, id: null });

  useEffect(() => {
    fetchCategories();
  }, [searchTerm]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const params = searchTerm ? { search: searchTerm } : {};
      const response = await categoryService.getAllCategories(params);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory._id, formData);
        toast.success("Category updated successfully!");
      } else {
        await categoryService.createCategory(formData);
        toast.success("Category created successfully!");
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      setFormData({ name: "", description: "", status: "Active" });
      fetchCategories();
    } catch (error: any) {
      console.error("Error saving category:", error);
      toast.error(error.response?.data?.message || "Failed to save category");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description || "", status: category.status });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDelete({ isOpen: true, id });
  };

  const handleDelete = async () => {
    try {
      await categoryService.deleteCategory(confirmDelete.id);
      toast.success("Category deleted successfully!");
      fetchCategories();
    } catch (error: any) {
      console.error("Error deleting category:", error);
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-3">
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 sticky top-0 bg-white">
              <h2 className="text-sm font-semibold text-gray-800">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <button onClick={() => { setIsModalOpen(false); setEditingCategory(null); }} className="p-1 hover:bg-gray-100 rounded-md">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-[#FA8128]"
                  placeholder="e.g. Web Development"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-[#FA8128]"
                  placeholder="Enter category description (optional)"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-[#FA8128]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingCategory(null); }}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-3 py-2 text-sm bg-[#FA8128] text-white rounded-md hover:bg-[#FA8128]">
                  {editingCategory ? "Update" : "Add"} Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Course Categories</h1>
          <p className="text-gray-500 text-xs">Manage your course categories</p>
        </div>
        <button onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 sm:gap-1.5 bg-[#FA8128] text-white px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm hover:bg-[#FA8128]">
          <Plus size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Add Category</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="bg-orange-500 p-1.5 sm:p-2 rounded-md">
              <Layers size={14} className="text-white sm:w-[18px] sm:h-[18px]" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">{categories.length}</h3>
            <p className="text-gray-500 text-[10px] sm:text-xs">Total Categories</p>
            <p className="text-[10px] sm:text-xs text-green-600 mt-1">
              {categories.filter(c => c.status === "Active").length} Active
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="bg-orange-500 p-1.5 sm:p-2 rounded-md">
              <TrendingUp size={14} className="text-white sm:w-[18px] sm:h-[18px]" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-sm sm:text-xl font-bold text-gray-800 truncate">
              {categories.length > 0
                ? [...categories].sort((a, b) => (b.coursesCount || 0) - (a.coursesCount || 0))[0]?.name || "N/A"
                : "N/A"}
            </h3>
            <p className="text-gray-500 text-[10px] sm:text-xs">Top Category</p>
            <p className="text-[10px] sm:text-xs text-orange-600 mt-1">
              {categories.length > 0
                ? `${[...categories].sort((a, b) => (b.coursesCount || 0) - (a.coursesCount || 0))[0]?.coursesCount || 0} courses`
                : "0 courses"}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-3">
        <div className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1.5 max-w-md">
          <Search size={16} className="text-gray-400" />
          <input type="text" placeholder="Search categories..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none w-full text-sm text-gray-600" />
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#FA8128] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600 text-sm">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
            <FolderTree size={40} className="text-gray-300 mb-3 sm:w-12 sm:h-12" />
            <p className="text-sm font-medium text-gray-600">No categories yet</p>
            <p className="text-xs text-gray-400 mt-1">Create your first category to get started</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="sm:hidden divide-y divide-gray-100">
              {categories.map((category) => (
                <div key={category._id} className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center shrink-0">
                      <FolderTree size={14} className="text-[#FA8128]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{category.name}</p>
                          <p className="text-[10px] text-gray-500">{category.coursesCount || 0} courses</p>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium shrink-0 ${
                          category.status === "Active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}>
                          {category.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => handleEdit(category)}
                        className="p-1.5 hover:bg-orange-50 rounded-md text-[#FA8128] transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDeleteClick(category._id)}
                        className="p-1.5 hover:bg-red-50 rounded-md text-red-500 transition-colors">
                        <Trash2 size={14} />
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
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Category</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Courses</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Status</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-orange-100 rounded-md flex items-center justify-center">
                            <FolderTree size={14} className="text-[#FA8128]" />
                          </div>
                          <span className="text-sm font-medium text-gray-800">{category.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="text-xs text-gray-600">{category.coursesCount || 0} courses</span>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          category.status === "Active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}>
                          {category.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleEdit(category)}
                            className="p-1.5 hover:bg-orange-50 rounded-md text-[#FA8128] transition-colors">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDeleteClick(category._id)}
                            className="p-1.5 hover:bg-red-50 rounded-md text-red-500 transition-colors">
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
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default CourseCategories;
