import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, CheckCircle, Instagram, Calendar, Linkedin } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CallbackModal from "../components/CallbackModal";
import EnrollModal from "../components/EnrollModal";
import HiringPartners from "../components/HiringPartners";
import FAQ from "../components/FAQ";
// @ts-ignore
import { courseService } from "../services/courseService";
import { batchService } from "../services/batchService";
// @ts-ignore
import { placementService } from "../services/placementService";

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
  const [placements, setPlacements] = useState<any[]>([]);
  const [showPlacements, setShowPlacements] = useState(true);
  const [loading, setLoading] = useState(true);
  const [batchesLoading, setBatchesLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCourse();
      fetchBatches();
    }
    fetchPlacements();
  }, [id]);

  const fetchPlacements = async () => {
    try {
      const [placementsRes, visibilityRes] = await Promise.all([
        placementService.getActivePlacements(6),
        placementService.getPlacementsVisibility()
      ]);
      setPlacements(placementsRes.data || []);
      setShowPlacements(visibilityRes.data !== false);
    } catch (error) {
      console.error("Error fetching placements:", error);
    }
  };

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
      {showPlacements &&
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
                    {(student.xLink || student.linkedinLink || student.instagramLink) && (
                      <div className="flex items-center gap-2 mt-3">
                        {student.xLink && (
                          <a href={student.xLink} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:opacity-80"><XIcon /></a>
                        )}
                        {student.linkedinLink && (
                          <a href={student.linkedinLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:opacity-80"><Linkedin size={16} /></a>
                        )}
                        {student.instagramLink && (
                          <a href={student.instagramLink} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:opacity-80"><Instagram size={16} /></a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Congratulations Card */}
                  <div className="w-[100px]">
                    <div className="w-full h-[60px] bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg flex items-center justify-center">
                      <span className="text-amber-600 text-xs font-medium">Congrats!</span>
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
      </section>}

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
