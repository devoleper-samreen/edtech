import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Search, Trash2, ShieldCheck, Mail, X } from "lucide-react";
// @ts-ignore
import { userService } from "../../services/userService";

const Admins = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  useEffect(() => {
    fetchAdmins();
  }, [statusFilter, searchTerm]);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const params = {
        role: "admin",
        ...(statusFilter !== "All" && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      };
      const response = await userService.getAllUsers(params);
      setAdmins(response.data.users);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone && formData.phone.length !== 10) {
      toast.error("Phone number must be 10 digits");
      return;
    }
    try {
      const userData = {
        ...formData,
        role: "admin",
        phone: formData.phone ? `+91${formData.phone}` : ""
      };
      await userService.createUser(userData);
      toast.success("Admin created successfully!");
      setIsModalOpen(false);
      setFormData({ name: "", email: "", password: "", phone: "" });
      fetchAdmins();
    } catch (error:any) {
      console.error("Error creating admin:", error);
      toast.error(error.response?.data?.message || "Failed to create admin");
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await userService.toggleUserStatus(id);
      toast.success("Admin status updated!");
      fetchAdmins();
    } catch (error) {
      console.error("Error toggling admin status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        await userService.deleteUser(id);
        toast.success("Admin deleted successfully!");
        fetchAdmins();
      } catch (error) {
        console.error("Error deleting admin:", error);
        toast.error("Failed to delete admin");
      }
    }
  };

  const activeAdmins = admins.filter(a => a.isActive).length;
  const inactiveAdmins = admins.filter(a => !a.isActive).length;

  return (
    <div className="space-y-3">
      {/* Add Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between px-4 py-3">
              <h2 className="text-sm font-semibold text-gray-800">Add New Admin</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-[#FA8128]"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-[#FA8128]"
                  placeholder="admin@techfox.com"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-[#FA8128]"
                  placeholder="Enter password"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Phone
                </label>
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
                  Add Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Admins</h1>
          <p className="text-gray-500 text-xs">Manage admin users and their permissions</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 sm:gap-1.5 bg-[#FA8128] text-white px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm hover:bg-[#FA8128] transition-colors"
        >
          <Plus size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Add Admin</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Total Admins</p>
          <p className="text-lg sm:text-xl font-bold text-gray-800">{admins.length}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Active</p>
          <p className="text-lg sm:text-xl font-bold text-green-600">{activeAdmins}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-[10px] sm:text-xs text-gray-500">Inactive</p>
          <p className="text-lg sm:text-xl font-bold text-gray-400">{inactiveAdmins}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg shadow-sm p-3">
        <div className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1.5 max-w-md">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search admins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none w-full text-sm text-gray-600"
          />
        </div>
      </div>

      {/* Admins Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg">
          <div className="w-12 h-12 border-4 border-[#FA8128] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-600 text-sm">Loading admins...</p>
        </div>
      ) : filteredAdmins.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 bg-white rounded-lg text-center px-4">
          <ShieldCheck size={40} className="text-gray-300 mb-3 sm:w-12 sm:h-12" />
          <p className="text-sm font-medium text-gray-600">No admins found</p>
          <p className="text-xs text-gray-400 mt-1">Add your first admin to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {filteredAdmins.map((admin) => (
            <div key={admin._id} className="bg-white rounded-lg shadow-sm p-3 sm:p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#FA8128] rounded-full flex items-center justify-center text-white font-bold text-[10px] sm:text-sm shrink-0">
                    {getInitials(admin.name)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{admin.name}</h3>
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500">
                      <Mail size={10} className="sm:w-3 sm:h-3 shrink-0" />
                      <span className="truncate">{admin.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs text-gray-500">Role</span>
                  <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium bg-orange-100 text-orange-600 capitalize">
                    {admin.role}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs text-gray-500">Status</span>
                  <span
                    className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium ${
                      admin.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {admin.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                {admin.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs text-gray-500">Phone</span>
                    <span className="text-[10px] sm:text-xs text-gray-600">{admin.phone}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 pt-2 sm:pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleToggleStatus(admin._id)}
                  className="flex-1 py-1.5 px-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors text-[10px] sm:text-xs"
                >
                  {admin.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => handleDeleteAdmin(admin._id)}
                  className="p-1.5 hover:bg-red-50 rounded-md text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admins;
