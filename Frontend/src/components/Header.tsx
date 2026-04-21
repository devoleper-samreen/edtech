import { Menu, X, ChevronRight, Flame, Code, LogOut, LayoutDashboard, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
// @ts-ignore
import { useAuth } from "../context/AuthContext";
// @ts-ignore
import { courseService } from "../services/courseService";
// @ts-ignore
import { categoryService } from "../services/categoryService";
// @ts-ignore
import { authService } from "../services/authService";


interface Course {
  _id: string;
  title: string;
  name?: string;
  description: string;
  category: {
    _id: string;
    name: string;
  } | string;
}

interface Category {
  _id: string;
  name: string;
  status: string;
}

const navItems = [
  { name: "Summer Internship", path: "/summer-internship" },
  { name: "CRT Program", path: "/crt-program" },
  { name: "Hire From Us", path: "/hire-from-us" },
  { name: "Contact Us", path: "/contact-us" },
];
// Order: All Courses → Summer Internship → CRT Program → Hire From Us → Contact Us

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [bioOpen, setBioOpen] = useState(false);
  const [bioData, setBioData] = useState<any>(null);
  const [bioLoading, setBioLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>("all");
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, categoriesRes] = await Promise.all([
        courseService.getAllCourses({ status: 'published', limit: 100 }),
        categoryService.getAllCategories()
      ]);
      setCourses(coursesRes.data?.courses || coursesRes.data || []);
      // Backend returns data directly as array, not data.categories
      const allCategories = categoriesRes.data || [];
      const activeCategories = Array.isArray(allCategories)
        ? allCategories.filter((c: Category) => c.status === 'Active')
        : [];
      setCategories(activeCategories);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  const handleBioOpen = async () => {
    setProfileOpen(false);
    setBioOpen(true);
    setBioLoading(true);
    try {
      const res = await authService.getBio();
      setBioData(res.data);
    } catch {
      setBioData(null);
    } finally {
      setBioLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 1);
  };

  const getCategoryId = (course: Course) => {
    if (typeof course.category === 'object' && course.category !== null) {
      return course.category._id;
    }
    return course.category;
  };

  // Get courses for active category
  const activeCourses = activeCategory === "all"
    ? courses.slice(0, 9)
    : courses.filter((c) => getCategoryId(c) === activeCategory).slice(0, 9);

  return (
    <header className="w-full">
      {/* Top Contact Bar */}
      {/* <div className="w-full bg-[#FA8128] text-white text-sm py-2">
        <div className="w-full px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-1 md:gap-2">
            <WhatsappIcon />
            <span className="font-medium text-xs sm:text-sm">9686111919</span>
            <span className="hidden sm:inline font-medium text-xs sm:text-sm">9686700500</span>
            <span className="hidden md:inline font-medium">9686800700</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <a href="#" className="hover:opacity-80 transition-opacity"><YoutubeIcon /></a>
            <a href="#" className="hover:opacity-80 transition-opacity"><FacebookIcon /></a>
            <a href="#" className="hover:opacity-80 transition-opacity"><LinkedinIcon /></a>
            <a href="#" className="hover:opacity-80 transition-opacity hidden sm:inline"><TwitterIcon /></a>
            <a href="#" className="hover:opacity-80 transition-opacity hidden sm:inline"><InstagramIcon /></a>
            <a href="#" className="hover:opacity-80 transition-opacity"><WhatsappIcon /></a>
          </div>
        </div>
      </div> */}

      {/* Main Navbar */}
      <nav className="w-full bg-gradient-to-br from-orange-50 via-white to-orange-100 border-b border-orange-100 relative">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex items-center justify-between py-0">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/techfox_logo_transparent.png"
              alt="TechFox"
              className="h-20 sm:h-24 w-auto object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center gap-8 text-[0.85rem] font-medium text-gray-700">
            {/* All Courses with Dropdown */}
            <li className="relative">
              <button
                onClick={() => setCoursesOpen(!coursesOpen)}
                className={`flex items-center gap-1 transition-colors duration-200 py-2 border-b-2 ${
                  coursesOpen || location.pathname === "/courses" || location.pathname.startsWith("/course")
                    ? "text-[#FA8128] border-[#FA8128] font-semibold"
                    : "border-transparent hover:text-[#FA8128]"
                }`}
              >
                All Courses
                <ChevronRight size={16} className={`transition-transform ${coursesOpen ? "rotate-90" : ""}`} />
              </button>
              {coursesOpen && (
                <div className="absolute top-full -left-4 transform translate-y-2">
                  <div className="w-3 h-3 bg-[#FA8128] rotate-45 absolute left-8 -top-1.5"></div>
                </div>
              )}
            </li>

            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`transition-colors duration-200 py-2 border-b-2 ${
                    location.pathname === item.path
                      ? "text-[#FA8128] border-[#FA8128] font-semibold"
                      : "border-transparent hover:text-[#FA8128]"
                  }`}
                  onClick={() => setCoursesOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Auth Section - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                >
                  <div className="w-9 h-9 bg-[#FA8128] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {getInitials(user.name)}
                  </div>
                  <span className="font-medium text-gray-700 text-sm">{user.name}</span>
                </button>

                {profileOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                      <p className="text-xs text-gray-400 mt-1 capitalize">Role: {user.role}</p>
                    </div>
                    <Link
                      to={user.role === 'admin' ? '/admin' : '/student'}
                      onClick={() => setProfileOpen(false)}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LayoutDashboard size={16} />
                      {user.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}
                    </Link>
                    <button
                      onClick={handleBioOpen}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User size={16} />
                      My Profile
                    </button>
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
            ) : (
              <Link
                to="/login"
                className="bg-[#FA8128] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#FA8128] transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-gray-700 hover:text-[#FA8128] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mega Menu Dropdown */}
        {coursesOpen && (
          <div
            className="hidden lg:block absolute top-full left-0 right-0 z-50 px-8"
            onMouseLeave={() => setActiveCategory(null)}
          >
            <div className="flex max-w-[1100px] mx-auto bg-white shadow-xl border-t-4 border-[#FA8128] rounded-b-lg overflow-hidden">
              {/* Left Sidebar - Categories */}
              <div className="w-[260px] bg-gray-50 border-r border-gray-200 max-h-[450px] overflow-y-auto">
                {/* All Courses option */}
                <button
                  onMouseEnter={() => setActiveCategory("all")}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm hover:bg-white transition-colors ${
                    activeCategory === "all" ? "bg-white text-[#FA8128] border-r-2 border-[#FA8128]" : "text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Flame size={18} className={activeCategory === "all" ? "text-[#FA8128]" : "text-gray-500"} />
                    <span className="font-medium">Popular Courses</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>

                {/* Dynamic Categories */}
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onMouseEnter={() => setActiveCategory(category._id)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm hover:bg-white transition-colors ${
                      activeCategory === category._id ? "bg-white text-[#FA8128] border-r-2 border-[#FA8128]" : "text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                ))}
              </div>

              {/* Right Content - Courses */}
              <div className="flex-1 p-6 min-h-[400px]">
                {activeCategory ? (
                  activeCourses.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4">
                      {activeCourses.map((course) => (
                        <Link
                          key={course._id}
                          to={`/course/${course._id}`}
                          className="p-4 rounded-lg hover:bg-gray-50 hover:border-2 hover:border-[#FA8128] border-2 border-transparent transition-all duration-200 group"
                          onClick={() => {
                            setCoursesOpen(false);
                            window.scrollTo(0, 0);
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center flex-shrink-0">
                              <Code size={16} className="text-[#FA8128]" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800 text-sm group-hover:text-[#FA8128] transition-colors">
                                {course.title || course.name}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                                {course.description}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <p className="text-gray-500 text-sm">No courses in this category yet.</p>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-gray-500 text-sm">Please select a category</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            <ul className="flex flex-col text-base font-medium p-4 gap-1">
              <li>
                <Link
                  to="/courses"
                  className="block py-3 px-4 hover:bg-orange-50 hover:text-[#FA8128] rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  All Courses
                </Link>
              </li>
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="block py-3 px-4 hover:bg-orange-50 hover:text-[#FA8128] rounded-lg transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              {/* Mobile Auth */}
              {user ? (
                <>
                  <li className="border-t border-gray-200 mt-2 pt-2">
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="w-10 h-10 bg-[#FA8128] rounded-full flex items-center justify-center text-white font-semibold">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <Link
                      to={user.role === 'admin' ? '/admin' : '/student'}
                      className="w-full flex items-center gap-2 py-3 px-4 text-[#FA8128] hover:bg-orange-50 rounded-lg transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <LayoutDashboard size={18} />
                      {user.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                      className="w-full flex items-center gap-2 py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li className="border-t border-gray-200 mt-2 pt-2">
                  <Link
                    to="/login"
                    className="block bg-[#FA8128] text-white text-center py-3 px-4 rounded-lg hover:bg-[#FA8128] transition-colors font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>

      {/* Bio Modal */}
      {bioOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setBioOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-800">My Profile</h2>
              <button onClick={() => setBioOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            {bioLoading ? (
              <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
            ) : bioData ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-[#FA8128] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {bioData.name?.[0]?.toUpperCase()}
                  </div>
                </div>
                {[
                  { label: "Name", value: bioData.name },
                  { label: "Email", value: bioData.email },
                  { label: "Phone", value: bioData.phone },
                  { label: "Role", value: bioData.role },
                  { label: "Enrolled Courses", value: bioData.enrolledCourses },
                  { label: "Member Since", value: new Date(bioData.memberSince).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
                  { label: "Last Login", value: bioData.lastLogin ? new Date(bioData.lastLogin).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="font-medium text-gray-700 capitalize">{item.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-red-400 text-sm">Failed to load profile.</div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {coursesOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setCoursesOpen(false)}
          style={{ top: "120px" }}
        ></div>
      )}
    </header>
  );
}

export default Header;
