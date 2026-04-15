import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Search, Trash2, Users as UsersIcon, Mail, Phone, UserCheck, UserX, Plus, X } from "lucide-react";
// @ts-ignore
import { userService } from "../../services/userService";
import ConfirmModal from "../../components/ConfirmModal";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

interface ConfirmDeleteState {
  isOpen: boolean;
  id: string | null;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    phone: ""
  });
  const [confirmDelete, setConfirmDelete] = useState<ConfirmDeleteState>({ isOpen: false, id: null });

  useEffect(() => {
    fetchUsers();
  }, [statusFilter, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        role: "student",
        ...(statusFilter !== "All" && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      };
      const response = await userService.getAllUsers(params);
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone && formData.phone.length !== 10) {
      toast.error("Phone number must be 10 digits");
      return;
    }
    try {
      const userData = {
        ...formData,
        role: "student",
        phone: formData.phone ? `+91${formData.phone}` : ""
      };
      await userService.createUser(userData);
      toast.success("Student created successfully!");
      setIsModalOpen(false);
      setFormData({ name: "", email: "", password: "", phone: "" });
      fetchUsers();
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error(error.response?.data?.message || "Failed to create student");
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await userService.toggleUserStatus(id);
      toast.success("Student status updated!");
      fetchUsers();
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDelete({ isOpen: true, id });
  };

  const handleDeleteUser = async () => {
    try {
      await userService.deleteUser(confirmDelete.id);
      toast.success("Student deleted successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete student");
    }
  };

  const activeUsers = users.filter((u: User) => u.isActive).length;
  const inactiveUsers = users.filter((u: User) => !u.isActive).length;

  return (
    <div className="space-y-3">
      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between px-4 py-3">
              <h2 className="text-sm font-semibold text-gray-800">Add New Student</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-md">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-[#FA8128]"
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-[#FA8128]"
                  placeholder="student@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-[#FA8128]"
                  placeholder="Minimum 6 characters"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-100 border border-r-0 border-gray-200 rounded-l-md">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({ ...formData, phone: value });
                    }}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-r-md outline-none focus:border-[#FA8128]"
                    placeholder="Enter 10 digit number"
                    maxLength={10}
                    pattern="[0-9]{10}"
                  />
                </div>
                {formData.phone && formData.phone.length !== 10 && (
                  <p className="text-xs text-red-500 mt-1">Phone number must be 10 digits</p>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 py-2 text-sm bg-[#FA8128] text-white rounded-md hover:bg-[#FA8128]"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Students</h1>
          <p className="text-gray-500 text-xs">Manage registered students</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 sm:gap-1.5 bg-[#FA8128] text-white px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm hover:bg-[#FA8128]"
        >
          <Plus size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Add Student</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Total Students</p>
          <p className="text-lg sm:text-xl font-bold text-gray-800">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Active</p>
          <p className="text-lg sm:text-xl font-bold text-green-600">{activeUsers}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Inactive</p>
          <p className="text-lg sm:text-xl font-bold text-gray-400">{inactiveUsers}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Students</p>
          <p className="text-lg sm:text-xl font-bold text-[#FA8128]">{users.filter((u: User) => u.role === 'student').length}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg shadow-sm p-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1.5 flex-1">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search users..."
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

      {/* Users List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#FA8128] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600 text-sm">Loading students...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
            <UsersIcon size={40} className="text-gray-300 mb-3 sm:w-12 sm:h-12" />
            <p className="text-sm font-medium text-gray-600">No students found</p>
            <p className="text-xs text-gray-400 mt-1">Add your first student to get started</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="sm:hidden divide-y divide-gray-100">
              {users.map((user: User) => (
                <div key={user._id} className="p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-[#FA8128] rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0">
                      {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium shrink-0 ${
                            user.isActive
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
                        <Mail size={10} />
                        <span className="truncate">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
                          <Phone size={10} />
                          <span>{user.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="px-1.5 py-0.5 bg-orange-50 text-[#FA8128] rounded-full text-[9px] font-medium capitalize">
                          {user.role}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleStatus(user._id)}
                            className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 transition-colors"
                            title={user.isActive ? "Deactivate" : "Activate"}
                          >
                            {user.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user._id)}
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
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">User</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Contact</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Role</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Status</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: User) => (
                    <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-[#FA8128] rounded-full flex items-center justify-center text-white text-[10px] font-semibold">
                            {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-800">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Mail size={12} />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <Phone size={12} />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 bg-orange-50 text-[#FA8128] rounded-full text-xs font-medium">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            user.isActive
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleStatus(user._id)}
                            className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 transition-colors"
                            title={user.isActive ? "Deactivate" : "Activate"}
                          >
                            {user.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user._id)}
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

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        onConfirm={handleDeleteUser}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Users;
