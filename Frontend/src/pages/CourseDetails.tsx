import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, CheckCircle, Play, Facebook, Instagram, Calendar } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CallbackModal from "../components/CallbackModal";
import EnrollModal from "../components/EnrollModal";
import HiringPartners from "../components/HiringPartners";
import FAQ from "../components/FAQ";
// @ts-ignore
import { courseService } from "../services/courseService";
import { batchService } from "../services/batchService";

interface BatchData {
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
  status: string;
}

// Social Icons
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF0000">
    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
  </svg>
);

interface CourseData {
  _id: string;
  title: string;
  name?: string;
  description: string;
  rating: number;
  thumbnail?: string;
  highlights?: string[];
  whoIsFor?: string[];
  whyTake?: string[];
  whatLearn?: string[];
  category?: {
    _id: string;
    name: string;
  };
}

// Placement data
const placements = [
  { name: "Akshata Kasar", degree: "btech", score: "73.15", year: "2025", dept: "computer science" },
  { name: "Shaik Yaseen", degree: "be", score: "83.20", year: "2025", dept: "computer science" },
  { name: "Rasika Baviskar", degree: "", score: "0.00", year: "2025", dept: "N/A" },
  { name: "Pallavi Sharma", degree: "btech", score: "76.00", year: "2025", dept: "information technology" },
  { name: "Mirza Altamash Baig", degree: "bca", score: "87.12", year: "2025", dept: "computer science" },
  { name: "Mayuresh Avhad", degree: "be", score: "72.96", year: "2025", dept: "electronics and teleco..." },
];

// Default content for courses
const defaultHighlights = [
  "Gain expertise in core technologies and frameworks essential for the industry.",
  "Implementing best practices and methodologies for efficient development.",
  "Engage in hands-on projects and real-world scenarios to enhance your skills.",
];

const defaultWhoIsFor = [
  "Individuals keen on building a career in IT industry.",
  "Developers looking to expand their skills and knowledge.",
  "Professionals shifting into technology roles.",
];

const defaultWhyTake = [
  "Gain proficiency in industry-standard technologies and tools.",
  "Acquire in-demand skills boosting your employability.",
  "Stay competitive in the field and enhance your career prospects.",
];

const defaultWhatLearn = [
  "Master core technologies and frameworks used in the industry.",
  "Learn to build scalable and efficient applications.",
  "Gain proficiency in designing and implementing professional solutions.",
];

function CourseDetails() {
  const { id } = useParams<{ id: string }>();
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [course, setCourse] = useState<CourseData | null>(null);
  const [batches, setBatches] = useState<BatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [batchesLoading, setBatchesLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCourse();
      fetchBatches();
    }
  }, [id]);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const response = await courseService.getCourse(id!);
      setCourse(response.data.course || response.data);
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBatches = async () => {
    setBatchesLoading(true);
    try {
      const response = await batchService.getBatchesByCourse(id!);
      setBatches(response.data || []);
    } catch (error) {
      console.error("Error fetching batches:", error);
    } finally {
      setBatchesLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-[#FA8128] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-gray-600 text-lg">Course not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const courseTitle = course.title || course.name || "Course Details";
  const courseDescription = course.description || "Master comprehensive training with both theoretical knowledge and practical skills.";
  const courseRating = course.rating || 4.5;
  const courseImage = course.thumbnail;
  const highlights = course.highlights?.length ? course.highlights : defaultHighlights;
  const whoIsFor = course.whoIsFor?.length ? course.whoIsFor : defaultWhoIsFor;
  const whyTake = course.whyTake?.length ? course.whyTake : defaultWhyTake;
  const whatLearn = course.whatLearn?.length ? course.whatLearn : defaultWhatLearn;

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className="w-full bg-[#fef7f0]">
        <div className="w-full max-w-[1100px] mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Content */}
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Title and Rating */}
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  {courseTitle}
                </h1>
                <motion.div
                  className="flex items-center gap-1 bg-white px-3 py-1 rounded-lg shadow-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Star size={18} className="text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-gray-800">{courseRating}</span>
                </motion.div>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-6">
                {courseDescription}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 mb-6">
                {[
                  { value: "100,000+", label: "Students placed" },
                  { value: "2,500+", label: "Hiring Companies" },
                  { value: "50,000+", label: "Non IT Students placed" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  >
                    <p className="text-2xl font-bold text-[#FA8128]">{stat.value}</p>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Highlights */}
              <div className="space-y-3 mb-6">
                {highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  >
                    <CheckCircle size={20} className="text-[#FA8128] flex-shrink-0 mt-0.5" />
                    <p className="text-gray-600 text-sm leading-relaxed">{highlight}</p>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.button
                onClick={() => setIsEnrollOpen(true)}
                className="bg-[#FA8128] hover:bg-[#FA8128] text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Enroll For Demo Class
              </motion.button>
            </motion.div>

            {/* Right Image */}
            <motion.div
              className="lg:w-[300px] flex-shrink-0"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-full h-[200px] bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg overflow-hidden">
                {courseImage ? (
                  <img
                    src={courseImage}
                    alt={courseTitle}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-orange-400">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="2" y="3" width="20" height="14" rx="2"/>
                      <path d="M8 21h8M12 17v4"/>
                    </svg>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming Batches Section */}
      <section className="max-w-[1280px] mx-auto w-full py-12 bg-white">
        <div className="w-full max-w-[1100px] mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Batches</h2>

          {/* Batch Table */}
          <div className="overflow-x-auto">
            {batchesLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-10 h-10 border-4 border-[#FA8128] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-3 text-gray-500 text-sm">Loading batches...</p>
              </div>
            ) : batches.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar size={48} className="text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">No upcoming batches available for this course.</p>
                <p className="text-gray-400 text-xs mt-1">Please check back later or contact us for more information.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Mode</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Contact</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Start Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Timings</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Days</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map((batch) => (
                    <tr key={batch._id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          batch.mode === 'Online' ? 'bg-purple-100 text-purple-600' :
                          batch.mode === 'Offline' ? 'bg-orange-100 text-orange-600' :
                          'bg-teal-100 text-teal-600'
                        }`}>
                          {batch.mode}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-[#FA8128]">{batch.contact || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{formatDate(batch.startDate)}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{batch.timing}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{batch.days}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setIsEnrollOpen(true)}
                          className="border border-[#FA8128] text-[#FA8128] hover:bg-orange-50 text-xs font-medium py-1.5 px-4 rounded-full transition-colors"
                        >
                          Enroll Now
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

      {/* Hiring Partners */}
      <HiringPartners />

      {/* Our Placements Section */}
      <section className="max-w-[1280px] mx-auto w-full py-12 bg-white">
        <div className="w-full max-w-[1100px] mx-auto px-6">
          <motion.h2
            className="text-2xl font-bold text-gray-800 mb-8"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            Our Placements
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placements.map((student, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex gap-4">
                  {/* Student Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-orange-500 font-semibold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm">{student.name}</h4>
                        <p className="text-xs text-gray-500">
                          {student.degree} ({student.score}) - {student.year}
                        </p>
                        <p className="text-xs text-gray-500">{student.dept}</p>
                      </div>
                    </div>

                    {/* Social Icons */}
                    <div className="flex items-center gap-2 mt-3">
                      <a href="#" className="text-orange-600 hover:opacity-80"><Facebook size={16} /></a>
                      <a href="#" className="text-gray-800 hover:opacity-80"><XIcon /></a>
                      <a href="#" className="text-pink-500 hover:opacity-80"><Instagram size={16} /></a>
                      <a href="#" className="hover:opacity-80"><GoogleIcon /></a>
                      <a href="#" className="hover:opacity-80"><YoutubeIcon /></a>
                    </div>
                  </div>

                  {/* Congratulations Card & Video */}
                  <div className="w-[100px] space-y-2">
                    <div className="w-full h-[60px] bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg flex items-center justify-center">
                      <span className="text-amber-600 text-xs font-medium">Congrats!</span>
                    </div>
                    <div className="w-full h-[60px] bg-gray-100 rounded-lg flex items-center justify-center relative">
                      <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
                        <Play size={14} className="text-gray-600 ml-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View More Button */}
          <div className="flex justify-center mt-8">
            <motion.button
              className="bg-[#FA8128] hover:bg-[#FA8128] text-white font-medium py-2.5 px-8 rounded-lg transition-colors text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View More
            </motion.button>
          </div>
        </div>
      </section>

      {/* Highlights about the Course */}
      <section className="w-full py-12 bg-gray-50">
        <div className="w-full max-w-[1100px] mx-auto px-6">
          <motion.h2
            className="text-2xl font-bold text-gray-800 mb-8"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            Highlights about the Course
          </motion.h2>

          {/* Who this course is for? */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Who this course is for?</h3>
            <ul className="space-y-2">
              {whoIsFor.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600">
                  <span className="text-[#FA8128] mt-1.5">&#8226;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Why take this course? */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Why take this course?</h3>
            <ul className="space-y-2">
              {whyTake.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600">
                  <span className="text-[#FA8128] mt-1.5">&#8226;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* What you will learn? */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">What you will learn?</h3>
            <ul className="space-y-2">
              {whatLearn.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600">
                  <span className="text-[#FA8128] mt-1.5">&#8226;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      <Footer />
      <CallbackModal />

      {/* Enroll Modal */}
      <EnrollModal
        isOpen={isEnrollOpen}
        onClose={() => setIsEnrollOpen(false)}
        courseName={courseTitle}
      />
    </div>
  );
}

export default CourseDetails;
