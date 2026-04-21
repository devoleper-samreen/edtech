import { User, Mail, GraduationCap, Star, ChevronLeft, ChevronRight, X, Quote, IndianRupee } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CallbackModal from "../components/CallbackModal";
import HiringPartners from "../components/HiringPartners";
import ModesWeTrain from "../components/ModesWeTrain";
import FAQ from "../components/FAQ";
// @ts-ignore
import { callbackService } from "../services/callbackService";
// @ts-ignore
import { internshipService } from "../services/internshipService";
// @ts-ignore
import api from "../services/../config/api";
import { testimonialService } from "../services/testimonialService";

type TabType = "general" | "corporate" | "hire";

// Feature Icons
const TailoredIcon = () => (
  <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
    <rect x="8" y="6" width="24" height="30" rx="2" fill="#fecaca" stroke="#ef4444" strokeWidth="2"/>
    <rect x="16" y="10" width="20" height="6" rx="1" fill="#fca5a5"/>
    <rect x="12" y="20" width="16" height="3" rx="1" fill="#ef4444"/>
    <rect x="12" y="26" width="12" height="3" rx="1" fill="#ef4444"/>
  </svg>
);

const SupportiveIcon = () => (
  <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
    <circle cx="16" cy="16" r="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2"/>
    <circle cx="32" cy="16" r="8" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
    <rect x="12" y="28" width="24" height="12" rx="2" fill="#d1fae5" stroke="#10b981" strokeWidth="2"/>
  </svg>
);

const MeasurableIcon = () => (
  <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
    <rect x="6" y="24" width="8" height="18" rx="1" fill="#fce7f3" stroke="#ec4899" strokeWidth="2"/>
    <rect x="18" y="16" width="8" height="26" rx="1" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
    <rect x="30" y="8" width="8" height="34" rx="1" fill="#d1fae5" stroke="#10b981" strokeWidth="2"/>
  </svg>
);

const FlexibleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
    <rect x="12" y="8" width="24" height="6" rx="2" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2"/>
    <path d="M24 14v8M24 22l-8 12h16l-8-12z" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2"/>
    <circle cx="24" cy="38" r="4" fill="#f59e0b"/>
  </svg>
);

const ExpertIcon = () => (
  <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
    <circle cx="20" cy="16" r="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2"/>
    <rect x="12" y="26" width="16" height="14" rx="2" fill="#fed7aa" stroke="#f59e0b" strokeWidth="2"/>
    <rect x="32" y="12" width="10" height="14" rx="1" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
  </svg>
);

const RealWorldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
    <rect x="8" y="8" width="32" height="24" rx="2" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
    <rect x="12" y="12" width="24" height="16" rx="1" fill="#93c5fd"/>
    <rect x="16" y="36" width="16" height="4" rx="1" fill="#3b82f6"/>
  </svg>
);

interface Testimonial {
  _id: string;
  company: string;
  shortText: string;
  fullText: string;
  contactPerson: string;
  designation: string;
  rating: number;
}


function CorporateTraining() {
  const navigate = useNavigate();
  const sliderRef = useRef<HTMLDivElement>(null);
  //const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [callbackDefaultTab] = useState<TabType>("corporate");
  const [enrollProgram, setEnrollProgram] = useState<any>(null);
  const [enrollForm, setEnrollForm] = useState({ name: "", email: "", phone: "" });
  const [enrollSubmitting, setEnrollSubmitting] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [programs, setPrograms] = useState<any[]>([]);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    requiredTraining: "",
    message: ""
  });
  const [formLoading, setFormLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    fetchPrograms();
    fetchTestimonials();
  }, []);

  const fetchPrograms = async () => {
    setProgramsLoading(true);
    try {
      const response = await internshipService.getActivePrograms();
      setPrograms(response.data || []);
    } catch (error) {
      console.error("Error fetching internship programs:", error);
    } finally {
      setProgramsLoading(false);
    }
  };

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



  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enrollForm.phone.length !== 10) { toast.error("Phone number must be 10 digits"); return; }
    setEnrollSubmitting(true);
    try {
      const orderRes = await api.post('/payments/create-order', { internshipId: enrollProgram._id });
      const { orderId, amount, currency } = orderRes.data.data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_SeEtwSJU8koFDl',
        amount, currency,
        name: 'TechFox',
        description: enrollProgram.title,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              name: enrollForm.name, email: enrollForm.email,
              phone: `+91${enrollForm.phone}`, course: enrollProgram.title,
              internshipId: enrollProgram._id, amount
            });
            toast.success("Payment successful! Enrollment confirmed.");
            setEnrollProgram(null);
            setEnrollForm({ name: "", email: "", phone: "" });
          } catch { toast.error("Payment done but enrollment failed. Please contact support."); }
        },
        prefill: { name: enrollForm.name, email: enrollForm.email, contact: `+91${enrollForm.phone}` },
        theme: { color: '#FA8128' },
        modal: { ondismiss: () => setEnrollSubmitting(false) }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', () => { toast.error("Payment failed."); setEnrollSubmitting(false); });
      rzp.open();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to initiate payment");
      setEnrollSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Only allow digits
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

    // Validation
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
        type: "Corporate",
        requiredTraining: formData.requiredTraining.trim(),
        message: formData.message.trim()
      });

      toast.success("Request submitted successfully! Redirecting to payment...");
      setFormData({
        name: "",
        email: "",
        phone: "",
        requiredTraining: "",
        message: ""
      });
      window.open("https://rzp.io/rzp/rBt2q7M", "_blank");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };


  const features = [
    {
      icon: <TailoredIcon />,
      title: "Tailored Programs",
      description: "Customized training solutions to meet your unique business needs.",
      position: "top-left",
    },
    {
      icon: <SupportiveIcon />,
      title: "Supportive Learning Environment",
      description: "Supportive environment where learners are encouraged and guided every step of the way.",
      position: "top-right",
    },
    {
      icon: <MeasurableIcon />,
      title: "Measurable Results",
      description: "Participants will see measurable results that clearly demonstrate the program's impact.",
      position: "middle-left",
    },
    {
      icon: <FlexibleIcon />,
      title: "Flexible Delivery",
      description: "On-site, online, and hybrid options to fit your schedule.",
      position: "middle-right",
    },
    {
      icon: <ExpertIcon />,
      title: "Expert Instructors",
      description: "Learn from industry leaders and experienced professionals.",
      position: "bottom-left",
    },
    {
      icon: <RealWorldIcon />,
      title: "Real-World Application",
      description: "Our programs emphasize hands-on learning for immediate real-world application.",
      position: "bottom-right",
    },
  ];

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
      <section className="w-full relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#fef3e2] via-[#fef9f3] to-white"></div>

        <div className="relative z-10 w-full max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            {/* LEFT TEXT SECTION */}
            <motion.div
              className="space-y-4 sm:space-y-5"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl sm:text-3xl md:text-[36px] lg:text-[44px] font-bold leading-tight text-gray-800">
                Launch Your Career With Our Expert-Led Summer Internship Program.
              </h1>

              <motion.p
                className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Gain real-world experience, industry exposure, and the skills
                that top companies demand.
              </motion.p>
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

                {/* Required Training */}
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-white hover:border-gray-300 transition-colors">
                  <GraduationCap className="text-gray-400" size={18} />
                  <input
                    type="text"
                    name="requiredTraining"
                    value={formData.requiredTraining}
                    onChange={handleInputChange}
                    placeholder="Internship Domain"
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

      {/* Program Overview */}
      <section id="program-overview" className="w-full py-12 sm:py-16 bg-white">
        <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              TechFox Summer Internship Program
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto mb-2">
              The TechFox Summer Internship Program is a structured training and internship initiative designed to help students gain hands-on industry experience in emerging technologies.
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
              The program combines classroom learning, real-world projects, and mentorship from industry experts.
            </p>
          </motion.div>

          {/* Program Structure */}
          <motion.div
            className="bg-gradient-to-br from-orange-50 to-white rounded-2xl border border-orange-100 p-6 sm:p-8 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-5">Program Structure</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "21 Days", sub: "Intensive Training" },
                { label: "9–24 Days", sub: "Real-Time Project Work" },
                { label: "1:1", sub: "Mentorship from Industry Professionals" },
                { label: "Demo Day", sub: "Final Project Presentation" },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-orange-100 text-center">
                  <p className="text-2xl font-bold text-[#FA8128] mb-1">{item.label}</p>
                  <p className="text-gray-600 text-sm">{item.sub}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-4 text-center">
              Participants work on projects provided by industry partners and startups.
            </p>
          </motion.div>

          {/* Domains + Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Internship Domains */}
            <motion.div
              className="bg-white rounded-2xl border border-gray-100 shadow-md p-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Internship Domains</h3>
              <p className="text-gray-500 text-sm mb-4">Students can choose from the following technology tracks:</p>
              <ul className="space-y-2">
                {[
                  "Artificial Intelligence / Machine Learning",
                  "Data Science",
                  "Internet of Things (IoT)",
                  "AWS Cloud Computing",
                  "Web Application Development (MERN Stack)",
                  "Cyber Security",
                  "CAD Design",
                ].map((domain, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="text-[#FA8128] font-bold">✦</span> {domain}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Program Benefits */}
            <motion.div
              className="bg-white rounded-2xl border border-gray-100 shadow-md p-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Program Benefits</h3>
              <p className="text-gray-500 text-sm mb-4">Participants receive:</p>
              <ul className="space-y-2">
                {[
                  "Industry recognized certificate",
                  "Letter of Internship",
                  "Hands-on project experience",
                  "Mentorship from industry experts",
                  "Networking opportunities",
                  "Top performer awards",
                  "Internship extensions for top candidates",
                  "Job referrals from partner companies",
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="text-[#FA8128] font-bold">✦</span> {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Why Participate + Who Can Participate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <motion.div
              className="bg-orange-50 rounded-2xl border border-orange-100 p-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Why Participate?</h3>
              <p className="text-gray-500 text-sm mb-4">TechFox offers a unique platform for students to:</p>
              <ul className="space-y-2">
                {[
                  "Build real-world technology solutions",
                  "Gain industry exposure",
                  "Work with mentors and experts",
                  "Compete in national-level hackathons",
                  "Develop a strong project portfolio",
                  "Access internship and career opportunities",
                ].map((point, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="text-[#FA8128] font-bold">✦</span> {point}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="bg-orange-50 rounded-2xl border border-orange-100 p-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Who Can Participate?</h3>
              <p className="text-gray-500 text-sm mb-4">TechFox programs are open to:</p>
              <ul className="space-y-2">
                {[
                  "Engineering Students",
                  "Computer Science Students",
                  "Technology Enthusiasts",
                  "Developers and Innovators",
                  "Startup Builders",
                  "AI & Data Science Learners",
                ].map((who, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="text-[#FA8128] font-bold">✦</span> {who}
                  </li>
                ))}
              </ul>
              <p className="text-gray-500 text-xs mt-4">Participants can join as individuals or teams depending on the program.</p>
            </motion.div>
          </div>

          {/* Industry Collaboration */}
          <motion.div
            className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 sm:p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">Industry Collaboration</h3>
            <p className="text-gray-500 text-sm mb-5">TechFox actively collaborates with:</p>
            <div className="flex flex-wrap gap-3">
              {[
                "Technology Companies",
                "Startup Ecosystems",
                "University Innovation Cells",
                "Developer Communities",
                "Industry Mentors",
              ].map((item, i) => (
                <span key={i} className="bg-orange-50 border border-orange-200 text-[#FA8128] text-sm font-medium px-4 py-2 rounded-full">
                  {item}
                </span>
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-4">
              These collaborations enable real problem statements, project mentorship, and hiring opportunities for participants.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Internship Programs Section */}
      <section className="w-full py-16 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Internship Programs
        </h2>

        <div className="w-full max-w-[1100px] mx-auto px-6">
          {programsLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-[#FA8128] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-gray-500 text-sm">Loading programs...</p>
            </div>
          ) : programs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <GraduationCap size={48} className="text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">No programs available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {programs.map((program) => (
                <div
                  key={program._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className={`h-40 relative overflow-hidden ${program.thumbnail ? 'bg-white' : 'bg-gradient-to-br from-orange-400 to-orange-600'}`}>
                    {program.thumbnail ? (
                      <img
                        src={program.thumbnail}
                        alt={program.title}
                        className="w-full h-full object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <GraduationCap size={48} className="text-white/50" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-1 text-sm leading-tight line-clamp-2">{program.title}</h3>
                    <p className="text-gray-500 text-xs mb-2 leading-relaxed line-clamp-2">{program.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      {program.duration && <span className="text-xs text-[#FA8128] font-medium">{program.duration}</span>}
                    </div>
                    {program.price > 0 && <p className="text-sm font-bold text-gray-800 mb-3">₹{program.price.toLocaleString('en-IN')}</p>}
                    <div className="flex gap-2">
                      <button onClick={() => setEnrollProgram(program)} className="flex-1 bg-[#FA8128] hover:bg-orange-600 text-white text-xs font-medium py-2 px-3 rounded-md transition-colors">
                        Enroll Now
                      </button>
                      <button onClick={() => navigate(`/internship/${program._id}`)} className="flex-1 border border-[#FA8128] text-[#FA8128] hover:bg-orange-50 text-xs font-medium py-2 px-3 rounded-md transition-colors">
                        Know More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Hiring Partners */}
      <HiringPartners />

      {/* Modes We Train */}
      <ModesWeTrain />

      {/* Corporate Training Features Section */}
      <section className="w-full py-12 sm:py-16 bg-white relative overflow-hidden">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10 sm:mb-16 px-4">
          TechFox Summer Internship Features
        </h2>

        {/* Decorative lines background */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1200 600" fill="none" preserveAspectRatio="none">
            {/* Orange curved lines */}
            {[...Array(12)].map((_, i) => (
              <path
                key={i}
                d={`M ${600 + i * 30} 300 Q ${800 + i * 20} ${400 + i * 15} ${1200} ${500 + i * 10}`}
                stroke="#fed7aa"
                strokeWidth="1"
                fill="none"
              />
            ))}
            {[...Array(12)].map((_, i) => (
              <path
                key={`left-${i}`}
                d={`M ${600 - i * 30} 300 Q ${400 - i * 20} ${400 + i * 15} ${0} ${500 + i * 10}`}
                stroke="#fed7aa"
                strokeWidth="1"
                fill="none"
              />
            ))}
          </svg>
        </div>

        <div className="relative z-10 w-full max-w-[1100px] mx-auto px-4 sm:px-6">
          {/* Center Globe/Logo - Hidden on mobile, visible on large screens */}
          <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-[140px] h-[140px] xl:w-[160px] xl:h-[160px] rounded-full bg-gradient-to-br from-orange-100 to-orange-50 border-2 border-orange-200 flex items-center justify-center shadow-xl">
              <div className="text-center">
                <div className="text-lg xl:text-xl font-bold text-gray-800 text-center leading-tight">
                  Tech<span className="text-[#FA8128]">Fox</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid - Mobile: Single column, Desktop: Staggered Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-x-[180px] xl:gap-x-[200px] relative lg:min-h-[500px]">
            {/* Mobile and Tablet: Simple grid */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 col-span-full">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-4 sm:p-5 border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:border-[#FA8128]/30"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100">
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed pl-1">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Desktop: Staggered layout */}
            {/* Left Column - Staggered positions */}
            <div className="hidden lg:flex flex-col items-end space-y-6 pt-0">
              {features.filter((_, i) => i % 2 === 0).map((feature, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-xl p-5 w-full max-w-[280px] xl:max-w-[300px] border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:border-[#FA8128]/30 ${
                    index === 0 ? 'mr-8' : index === 1 ? 'mr-0' : 'mr-16'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100">
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed pl-1">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Column - Staggered positions (offset) */}
            <div className="hidden lg:flex flex-col items-start space-y-6 pt-16">
              {features.filter((_, i) => i % 2 === 1).map((feature, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-xl p-5 w-full max-w-[280px] xl:max-w-[300px] border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:border-[#FA8128]/30 ${
                    index === 0 ? 'ml-16' : index === 1 ? 'ml-0' : 'ml-8'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100">
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed pl-1">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Connecting Lines (decorative) */}
          <div className="absolute inset-0 pointer-events-none hidden lg:block">
            <svg className="w-full h-full" viewBox="0 0 1100 500" fill="none">
              {/* Dotted lines connecting cards to center */}
              <circle cx="550" cy="250" r="100" stroke="#FA8128" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.3"/>
              <circle cx="550" cy="250" r="140" stroke="#f97316" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.2"/>
            </svg>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-16 bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Intern Testimonials
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

      {/* FAQ Section */}
      <FAQ />

      <Footer />
      <CallbackModal />

      {/* Callback Modal with Corporate Training tab */}
      <CallbackModal
        isOpen={isCallbackOpen}
        onClose={() => setIsCallbackOpen(false)}
        defaultTab={callbackDefaultTab}
      />

      {/* Enrollment Payment Modal */}
      <AnimatePresence>
        {enrollProgram && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setEnrollProgram(null)} className="fixed inset-0 bg-black/50 z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-[95%] max-w-md"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div>
                  <h2 className="text-base font-bold text-gray-800">{enrollProgram.title}</h2>
                  {enrollProgram.price > 0 && (
                    <div className="flex items-center gap-1 text-sm text-[#FA8128] font-semibold mt-0.5">
                      <IndianRupee size={14} />₹{enrollProgram.price.toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
                <button onClick={() => setEnrollProgram(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              <form onSubmit={handleEnrollSubmit} className="p-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                  <input type="text" required placeholder="Enter your full name" value={enrollForm.name}
                    onChange={(e) => setEnrollForm({ ...enrollForm, name: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FA8128]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" required placeholder="Enter your email" value={enrollForm.email}
                    onChange={(e) => setEnrollForm({ ...enrollForm, email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FA8128]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Mobile Number *</label>
                  <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                    <div className="flex items-center px-3 bg-gray-50 border-r border-gray-200">
                      <span className="text-sm text-gray-600">+91</span>
                    </div>
                    <input type="tel" placeholder="Enter 10 digit number" value={enrollForm.phone}
                      onChange={(e) => setEnrollForm({ ...enrollForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      className="flex-1 px-3 py-2.5 text-sm focus:outline-none" maxLength={10} required />
                  </div>
                  {enrollForm.phone && enrollForm.phone.length !== 10 && (
                    <p className="text-xs text-red-500 mt-1">Phone number must be 10 digits</p>
                  )}
                </div>
                <button type="submit" disabled={enrollSubmitting}
                  className="w-full bg-[#FA8128] hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50 mt-2"
                >
                  {enrollSubmitting ? "Processing..." : enrollProgram.price > 0 ? `Pay ₹${enrollProgram.price.toLocaleString('en-IN')} & Enroll` : "Enroll Now"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
                    <p className="text-orange-100 text-sm mt-1">Client Testimonial</p>
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

                {/* Divider */}
                <div className="my-6 border-t border-gray-200"></div>

                {/* Contact Person Info */}
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-[#FA8128] font-bold">
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

export default CorporateTraining;
