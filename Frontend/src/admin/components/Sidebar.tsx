import { NavLink, Link, useNavigate } from "react-router-dom";
// @ts-ignore
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  FolderTree,
  BookOpen,
  MessageSquare,
  PhoneCall,
  Users,
  ShieldCheck,
  LogOut,
  GraduationCap,
  Calendar,
  Quote,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Categories", path: "/admin/categories", icon: FolderTree },
  { name: "Courses", path: "/admin/courses", icon: BookOpen },
  { name: "Batches", path: "/admin/batches", icon: Calendar },
  { name: "Enrollments", path: "/admin/enrollments", icon: GraduationCap },
  { name: "Callbacks", path: "/admin/callbacks", icon: PhoneCall },
  { name: "Testimonials", path: "/admin/testimonials", icon: Quote },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Admins", path: "/admin/admins", icon: ShieldCheck },
  { name: "Enquiries", path: "/admin/enquiries", icon: MessageSquare },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 lg:w-56 h-screen bg-[#0f172a] text-white
          flex flex-col shrink-0
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-white hover:opacity-80 transition-opacity">
            Tech<span className="text-[#FA8128]">Fox</span>
            <span className="text-xs font-normal text-slate-400 ml-1">Admin</span>
          </Link>
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-slate-700 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 overflow-y-auto">
          <ul className="px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/admin"}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-[#FA8128] text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                >
                  <item.icon size={18} />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-2 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2.5 w-full rounded-md text-sm text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
