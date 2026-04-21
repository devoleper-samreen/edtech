import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Flame, Star, Search } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CallbackModal from "../components/CallbackModal";
import EnrollModal from "../components/EnrollModal";
// @ts-ignore
import { courseService } from "../services/courseService";
// @ts-ignore
import { categoryService } from "../services/categoryService";

interface Course {
  _id: string;
  title: string;
  name?: string;
  description: string;
  rating: number;
  thumbnail?: string;
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

function Courses() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollClick = (e: React.MouseEvent, courseTitle: string) => {
    e.stopPropagation();
    setSelectedCourse(courseTitle);
    setIsEnrollOpen(true);
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/course/${courseId}`);
    window.scrollTo(0, 0);
  };

  const getCategoryId = (course: Course) => {
    if (typeof course.category === 'object' && course.category !== null) {
      return course.category._id;
    }
    return course.category;
  };

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = activeCategory === "all" || getCategoryId(course) === activeCategory;
    const matchesSearch = (course.title || course.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const defaultImage = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop";

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-orange-50 via-white to-orange-100 py-10 sm:py-12 md:py-16">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 text-center">
          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Explore All Courses
          </motion.h1>
          <motion.p
            className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-6 sm:mb-8 px-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Discover industry-relevant courses designed to accelerate your career in technology.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            className="max-w-xl mx-auto relative px-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Search className="absolute left-5 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-3.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#FA8128] shadow-sm"
            />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full py-8 sm:py-10 md:py-12 bg-white">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 md:mb-10 justify-center">
            <button
              onClick={() => setActiveCategory("all")}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeCategory === "all"
                  ? "bg-[#FA8128] text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-[#FA8128] hover:text-white"
              }`}
            >
              <Flame size={16} className="sm:w-[18px] sm:h-[18px]" />
              All Courses
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setActiveCategory(category._id)}
                className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                  activeCategory === category._id
                    ? "bg-[#FA8128] text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-[#FA8128] hover:text-white"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Course Count */}
          <p className="text-gray-600 mb-5 sm:mb-6 text-sm sm:text-base">
            Showing {filteredCourses.length} courses
          </p>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-[#FA8128] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading courses...</p>
            </div>
          ) : (
            <>
              {/* Course Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => handleCourseClick(course._id)}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 cursor-pointer"
                  >
                    {/* Course Image */}
                    <div className="relative h-36 sm:h-40 overflow-hidden">
                      <img
                        src={course.thumbnail || defaultImage}
                        alt={course.title || course.name}
                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = defaultImage;
                        }}
                      />
                    </div>

                    {/* Course Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 text-md mb-2 line-clamp-1">
                        {course.title || course.name}
                      </h3>
                      <p className="text-gray-500 text-xs mb-3 line-clamp-2">
                        {course.description}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-4">
                        <span className="font-semibold text-gray-800">{course.rating || 4.5}</span>
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleEnrollClick(e, course.title || course.name || "")}
                          className="flex-1 bg-[#FA8128] hover:bg-[#FA8128] text-white font-medium py-2 rounded-lg transition-colors text-xs"
                        >
                          Enroll Now
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCourseClick(course._id);
                          }}
                          className="flex-1 border-2 border-[#FA8128] text-[#FA8128] hover:bg-blue-50 font-medium py-2 rounded-lg transition-colors text-xs"
                        >
                          Know more
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* No Results */}
              {filteredCourses.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">No courses found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setActiveCategory("all");
                      setSearchQuery("");
                    }}
                    className="mt-4 text-[#FA8128] hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
      <CallbackModal />

      {/* Enroll Modal */}
      <EnrollModal
        isOpen={isEnrollOpen}
        onClose={() => setIsEnrollOpen(false)}
        courseName={selectedCourse}
      />
    </div>
  );
}

export default Courses;
