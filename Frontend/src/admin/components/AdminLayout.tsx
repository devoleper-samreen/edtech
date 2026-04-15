import { Outlet } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import { LogOut, Home, Menu } from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close sidebar on window resize (when going to desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 1);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        {/* Top Header */}
        <header className="bg-white shadow-sm px-3 sm:px-4 py-2 flex items-center justify-between shrink-0">
          {/* Left Side - Menu & Home */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={20} className="text-gray-600" />
            </button>

            {/* Back to Home */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 text-gray-600 hover:text-[#FA8128] transition-colors text-sm"
            >
              <Home size={16} />
              <span className="hidden sm:inline">Back to Home</span>
            </button>
          </div>

          {/* Right Side - Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1.5 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-[#FA8128] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user ? getInitials(user.name) : "A"}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-gray-800 text-left">{user?.name || "Admin"}</p>
                  <p className="text-[10px] text-gray-500 capitalize">{user?.role || "Admin"}</p>
                </div>
              </button>

              {profileOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-800 text-sm">{user?.name || "Admin"}</p>
                    <p className="text-xs text-gray-500 mt-1 truncate">{user?.email || ""}</p>
                    <p className="text-xs text-gray-400 mt-1 capitalize">Role: {user?.role || "admin"}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content - Scrollable */}
        <main className="flex-1 p-3 sm:p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
