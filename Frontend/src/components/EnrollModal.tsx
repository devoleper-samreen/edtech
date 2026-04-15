import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import toast from "react-hot-toast";
// @ts-ignore
import { courseService } from "../services/courseService";
// @ts-ignore
import { enrollmentService } from "../services/enrollmentService";

interface EnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseName?: string;
}

interface Course {
  _id: string;
  title: string;
  name?: string;
}

function EnrollModal({ isOpen, onClose, courseName }: EnrollModalProps) {
  const [selectedCourse, setSelectedCourse] = useState(courseName || "");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  useEffect(() => {
    if (isOpen) {
      fetchCourses();
    }
  }, [isOpen]);

  useEffect(() => {
    if (courseName) {
      setSelectedCourse(courseName);
    }
  }, [courseName]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await courseService.getAllCourses({ status: 'published', limit: 100 });
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      // Fallback to empty array if API fails
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !selectedCourse) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.phone.length !== 10) {
      toast.error("Phone number must be 10 digits");
      return;
    }

    setSubmitting(true);
    try {
      await enrollmentService.createEnrollment({
        name: formData.name,
        email: formData.email,
        phone: `+91${formData.phone}`,
        course: selectedCourse,
        message: formData.message
      });
      toast.success("Enrollment submitted successfully! We will contact you soon.");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setSelectedCourse("");
      onClose();
    } catch (error: any) {
      console.error("Error submitting enrollment:", error);
      toast.error(error.response?.data?.message || "Failed to submit enrollment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg sm:rounded-xl shadow-2xl z-50 w-[95%] sm:w-[90%] max-w-[600px] max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <motion.div
              className="flex items-center justify-between p-4 sm:p-5"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Enroll now</h2>
              <motion.button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} className="sm:w-[22px] sm:h-[22px]" />
              </motion.button>
            </motion.div>

            {/* Form */}
            <motion.div
              className="p-4 sm:p-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="text-red-500">*</span> Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FA8128]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="text-red-500">*</span> Email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FA8128]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="text-red-500">*</span> Mobile Number
                    </label>
                    <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                      <div className="flex items-center gap-1 px-3 bg-gray-50 border-r border-gray-200">
                        <span className="text-sm text-gray-600">+91</span>
                      </div>
                      <input
                        type="tel"
                        placeholder="Enter 10 digit number"
                        value={formData.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setFormData({ ...formData, phone: value });
                        }}
                        className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
                        maxLength={10}
                        required
                      />
                    </div>
                    {formData.phone && formData.phone.length !== 10 && (
                      <p className="text-xs text-red-500 mt-1">Phone number must be 10 digits</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="text-red-500">*</span> Course
                    </label>
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FA8128] bg-white"
                      required
                    >
                      <option value="">Select a course</option>
                      {loading ? (
                        <option disabled>Loading courses...</option>
                      ) : (
                        courses.map((course) => (
                          <option key={course._id} value={course.title || course.name}>
                            {course.title || course.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    placeholder="Enter your message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FA8128] resize-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#FA8128] hover:bg-[#FA8128] text-white font-medium py-2.5 px-8 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default EnrollModal;
