import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Flame, ChevronRight, Star } from "lucide-react";
import EnrollModal from "./EnrollModal";
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


function ExploreCourses() {
  const [activeCategory, setActiveCategory] = useState("all");
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
      const backendCourses = coursesRes.data?.courses || coursesRes.data || [];
      setCourses(backendCourses);

      const allCategories = categoriesRes.data || [];
      const backendCategories = Array.isArray(allCategories)
        ? allCategories.filter((c: Category) => c.status === 'Active')
        : [];
      setCategories(backendCategories);
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

  // Filter courses based on category
  const filteredCourses = activeCategory === "all"
    ? courses.slice(0, 6) // Show first 6 courses for "All"
    : courses.filter((course) => getCategoryId(course) === activeCategory).slice(0, 6);

  const defaultImage = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop";

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 bg-white">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Explore Our Courses
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Sidebar - Categories */}
          <div className="lg:w-72 flex-shrink-0">
            {/* Mobile: Horizontal Scroll */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setActiveCategory("all")}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap ${
                  activeCategory === "all"
                    ? "bg-[#FA8128] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-[#FA8128] hover:text-white"
                }`}
              >
                <Flame size={16} />
                <span className="font-medium text-sm">Popular</span>
              </button>

              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => setActiveCategory(category._id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap ${
                    activeCategory === category._id
                      ? "bg-[#FA8128] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-[#FA8128] hover:text-white"
                  }`}
                >
                  <span className="font-medium text-sm">{category.name}</span>
                </button>
              ))}
            </div>

            {/* Desktop: Vertical List */}
            <div className="hidden lg:block bg-gray-50 rounded-xl overflow-hidden">
              {/* All Courses option */}
              <button
                onClick={() => setActiveCategory("all")}
                className={`w-full flex items-center justify-between px-5 py-4 transition-all duration-200 ${
                  activeCategory === "all"
                    ? "bg-[#FA8128] text-white"
                    : "bg-transparent text-gray-700 hover:bg-[#FA8128] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Flame size={20} />
                  <span className="font-medium text-sm">Popular Courses</span>
                </div>
                <ChevronRight size={18} />
              </button>

              {/* Dynamic Categories */}
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => setActiveCategory(category._id)}
                  className={`w-full flex items-center justify-between px-5 py-4 transition-all duration-200 ${
                    activeCategory === category._id
                      ? "bg-[#FA8128] text-white"
                      : "bg-transparent text-gray-700 hover:bg-[#FA8128] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm">{category.name}</span>
                  </div>
                  <ChevronRight size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Course Cards Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-12 h-12 border-4 border-[#FA8128] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading courses...</p>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-gray-500">No courses found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => handleCourseClick(course._id)}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 cursor-pointer"
                  >
                    {/* Course Image */}
                    <div className="relative h-36 sm:h-40 md:h-44 overflow-hidden">
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
                    <div className="px-4 py-3">
                      <h3 className="font-bold text-gray-800 text-md mb-2 line-clamp-2">
                        {course.title || course.name}
                      </h3>
                      <p className="text-gray-500 text-[12px] mb-3 line-clamp-2">
                        {course.description}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-4">
                        <span className="font-semibold text-gray-800">{course.rating || 4.5}</span>
                        <Star size={16} className="fill-yellow-400 text-yellow-400" />
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={(e) => handleEnrollClick(e, course.title || course.name || "")}
                          className="flex-1 bg-[#FA8128] hover:bg-[#FA8128] text-white font-medium py-1 px-1 rounded-lg transition-colors text-[12px]"
                        >
                          Enroll Now
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCourseClick(course._id);
                          }}
                          className="flex-1 border-2 border-[#FA8128] text-[#FA8128] hover:bg-orange-50 font-medium py-2 px-4 rounded-lg transition-colors text-[12px]"
                        >
                          Know more
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* View All Courses Button */}
        <div className="flex justify-center mt-10">
          <motion.button
            onClick={() => navigate("/courses")}
            className="bg-[#FA8128] hover:bg-[#FA8128] text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Courses
          </motion.button>
        </div>
      </div>

      {/* Enroll Modal */}
      <EnrollModal
        isOpen={isEnrollOpen}
        onClose={() => setIsEnrollOpen(false)}
        courseName={selectedCourse}
      />
    </section>
  );
}

export default ExploreCourses;
