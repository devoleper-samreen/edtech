import { User, Mail, Phone, Building2, X, Quote, Star } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CallbackModal from "../components/CallbackModal";
import HiringPartners from "../components/HiringPartners";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { testimonialService } from "../services/testimonialService";
// @ts-ignore
import { callbackService } from "../services/callbackService";

interface Testimonial {
  _id: string;
  company: string;
  shortText: string;
  fullText: string;
  contactPerson: string;
  designation: string;
  rating: number;
}

// Icons for hiring process

function HireFromUs() {

  const domains = [
    { title: "AI & Machine Learning", color: "#FA8128" },
    { title: "Data Science", color: "#f59e0b" },
    { title: "Internet of Things (IoT)", color: "#22c55e" },
    { title: "Software Development", color: "#8b5cf6" },
    { title: "AWS Cloud Computing", color: "#06b6d4" },
    { title: "Cyber Security", color: "#ef4444" },
    { title: "DevOps", color: "#0ea5e9" },
    { title: "Database & Analytics", color: "#14b8a6" },
  ];

  const sliderRef = useRef<HTMLDivElement>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });
  const [formLoading, setFormLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setTestimonialsLoading(true);
    try {
      const response = await testimonialService.getActiveTestimonials();
      setTestimonials(response.data || []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setTestimonialsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 10) {
        setFormData(prev => ({ ...prev, phone: digitsOnly }));
        if (digitsOnly.length > 0 && digitsOnly.length !== 10) {
          setPhoneError("Phone number must be 10 digits");
        } else {
          setPhoneError("");
        }
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!formData.phone || formData.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setFormLoading(true);
    try {
      await callbackService.createCallback({
        name: formData.name.trim(),
        phone: `+91${formData.phone}`,
        email: formData.email.trim(),
        type: "Hire",
        company: formData.company.trim(),
        message: formData.message.trim()
      });

      toast.success("Request submitted successfully! We will contact you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -350, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 350, behavior: "smooth" });
  };

  return (
    <div>
      <Header />

      {/* HERO SECTION */}
      <section
        className="w-full relative overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#fef3e2] via-[#fef9f3] to-white">
          {/* Decorative circle */}
          <div className="absolute left-[15%] top-[20%] w-[200px] h-[200px] rounded-full bg-[#fed7aa] opacity-60"></div>
        </div>

        <div className="relative z-10 w-full max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-start">
            {/* LEFT TEXT SECTION */}
            <motion.div
              className="space-y-4 sm:space-y-5"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl sm:text-3xl md:text-[36px] lg:text-[42px] font-bold leading-tight text-gray-800">
                Welcome To The{" "}
                <span className="text-[#FA8128]">Hire From Us Platform</span>,
                Hire Candidates With Just A Click.
              </h1>

              <motion.p
                className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Your gateway to skilled software Candidates. With just a click,
                ensure your code meets the highest standards, backed by
                proficient testing professionals.
              </motion.p>

              {/* Contact Section */}
              <motion.div
                className="pt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <p className="font-medium text-gray-700 mb-3">
                  For more details contact :
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-teal-600" />
                    <span>Mr. Sagar</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-green-600" />
                    <span>+91 97424 90958</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-blue-600" />
                    <span>sagar@macrosolutions.com</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* RIGHT FORM CARD */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg border-2 border-[#FA8128] p-4 sm:p-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <form className="space-y-3 sm:space-y-4" onSubmit={handleFormSubmit}>
                {/* Full Name */}
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-white hover:border-gray-300 transition-colors">
                  <User className="text-gray-400" size={18} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name *"
                    className="bg-transparent w-full outline-none text-gray-700 text-sm"
                  />
                </div>

                {/* Email */}
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-white hover:border-gray-300 transition-colors">
                  <Mail className="text-gray-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="bg-transparent w-full outline-none text-gray-700 text-sm"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 bg-white transition-colors ${phoneError ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'}`}>
                    <span className="text-base">🇮🇳</span>
                    <span className="text-gray-600 text-sm font-medium">+91</span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter mobile number *"
                      className="bg-transparent w-full outline-none text-gray-700 text-sm"
                    />
                  </div>
                  {phoneError && <p className="text-red-500 text-xs mt-1 ml-1">{phoneError}</p>}
                </div>

                {/* Company Name */}
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-white hover:border-gray-300 transition-colors">
                  <Building2 className="text-gray-400" size={18} />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Company name"
                    className="bg-transparent w-full outline-none text-gray-700 text-sm"
                  />
                </div>

                {/* Message */}
                <div className="border border-gray-200 rounded-xl px-4 py-3 bg-white hover:border-gray-300 transition-colors">
                  <textarea
                    rows={3}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Enter your message"
                    className="bg-transparent w-full outline-none text-gray-700 text-sm resize-none"
                  ></textarea>
                </div>

                {/* Button */}
                <div className="flex justify-center pt-2">
                  <motion.button
                    type="submit"
                    disabled={formLoading}
                    className="bg-[#FA8128] hover:bg-[#FA8128] text-white font-medium py-2.5 px-8 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {formLoading ? "Sending..." : "Send Request"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hiring Partners Section */}
      <HiringPartners />


      {/* Domains Section */}
      <section className="w-full py-12 sm:py-16 bg-[#fef7f4]">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10 sm:mb-14 px-4">
          Find our talents in different Domains
        </h2>

        <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {domains.map((domain, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Placeholder icon circle */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${domain.color}20` }}
                >
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: domain.color, opacity: 0.6 }}
                  ></div>
                </div>
                <h3 className="text-sm font-semibold text-gray-800">
                  {domain.title}
                </h3>
                {/* Bottom accent line */}
                <div
                  className="w-16 h-0.5 mt-4 rounded-full"
                  style={{ backgroundColor: "#ef4444" }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-16 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Client Testimonials
        </h2>

        <div className="relative w-full max-w-[1100px] mx-auto px-6">
          {testimonialsLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-[#FA8128] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-gray-500 text-sm">Loading testimonials...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Quote size={48} className="text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">No testimonials available at the moment.</p>
            </div>
          ) : (
            <>
              {/* Left Arrow */}
              <button
                onClick={scrollLeft}
                className="absolute -left-2 md:left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg border border-gray-200 p-2 rounded-full z-10 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="text-gray-600" size={20} />
              </button>

              {/* Slider */}
              <div
                ref={sliderRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide px-8 py-4 scroll-smooth"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {testimonials.map((item) => (
                  <div
                    key={item._id}
                    className="min-w-[280px] max-w-[280px] bg-white rounded-2xl rounded-tl-none shadow-md border border-gray-100 p-5"
                  >
                    <h3 className="text-base font-bold text-gray-800 mb-3 leading-tight">
                      {item.company}
                    </h3>

                    <div className="flex items-center gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < item.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
                        />
                      ))}
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="text-[#FA8128] text-2xl font-serif leading-none">
                        "
                      </span>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {item.shortText}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedTestimonial(item)}
                      className="mt-4 bg-[#FA8128] hover:bg-[#FA8128] text-white text-xs px-4 py-1.5 rounded-md transition-colors"
                    >
                      View More
                    </button>
                  </div>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={scrollRight}
                className="absolute -right-2 md:right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg border border-gray-200 p-2 rounded-full z-10 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="text-gray-600" size={20} />
              </button>
            </>
          )}
        </div>
      </section>

      <Footer />
      <CallbackModal />

      {/* Testimonial Detail Modal */}
      <AnimatePresence>
        {selectedTestimonial && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTestimonial(null)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-[90%] max-w-[600px] max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-[#FA8128] to-[#FA8128] p-6 rounded-t-2xl">
                <button
                  onClick={() => setSelectedTestimonial(null)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="flex items-center gap-4">
                  {/* Company Initial */}
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                    {selectedTestimonial.company.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {selectedTestimonial.company}
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">Client Testimonial</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Quote Icon */}
                <div className="flex justify-center mb-4">
                  <Quote size={40} className="text-[#FA8128]/20" />
                </div>

                {/* Full Testimonial Text */}
                <p className="text-gray-600 text-base leading-relaxed text-center italic">
                  "{selectedTestimonial.fullText}"
                </p>

                {/* Rating */}
                <div className="flex justify-center gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < selectedTestimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
                    />
                  ))}
                </div>

                {/* Divider */}
                <div className="my-6 border-t border-gray-200"></div>

                {/* Contact Person Info */}
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-[#FA8128] font-bold">
                    {selectedTestimonial.contactPerson.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {selectedTestimonial.contactPerson}
                    </h4>
                    <p className="text-gray-500 text-sm">
                      {selectedTestimonial.designation}
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setSelectedTestimonial(null)}
                    className="bg-[#FA8128] hover:bg-[#FA8128] text-white font-medium py-2.5 px-8 rounded-lg transition-colors text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HireFromUs;
