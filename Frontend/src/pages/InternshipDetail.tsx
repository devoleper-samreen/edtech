import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Clock, IndianRupee, GraduationCap, X,
  CheckSquare, Globe, Mail, Phone, Calendar
} from "lucide-react";
import toast from "react-hot-toast";
import Header from "../components/Header";
import Footer from "../components/Footer";
// @ts-ignore
import { internshipService } from "../services/internshipService";
// @ts-ignore
import api from "../config/api";

declare global { interface Window { Razorpay: any; } }

const domains = [
  "Artificial Intelligence / Machine Learning",
  "Data Science",
  "Internet of Things (IoT)",
  "MERN Stack Development",
  "Cyber Security",
  "AWS Cloud Computing",
  "CAD Design",
];

const benefits = [
  { icon: "🛠️", label: "Hands-On Experience" },
  { icon: "📈", label: "Skill Development" },
  { icon: "🤝", label: "Mentorship & Networking" },
  { icon: "🎓", label: "Industry Knowledge" },
  { icon: "📄", label: "Resume Boost" },
  { icon: "💼", label: "Career Opportunities" },
];

const perks = [
  "Industry recognised certificate",
  "Letter of Internship",
  "Real-world project experience",
  "Placement assistance",
  "Professional networking",
  "Top performer awards",
];

function InternshipDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  useEffect(() => { fetchProgram(); }, [id]);

  const fetchProgram = async () => {
    try {
      const response = await internshipService.getActivePrograms();
      const found = (response.data || []).find((p: any) => p._id === id);
      setProgram(found || null);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone.length !== 10) { toast.error("Phone number must be 10 digits"); return; }
    setSubmitting(true);
    try {
      const orderRes = await api.post('/payments/create-order', { internshipId: program._id });
      const { orderId, amount, currency } = orderRes.data.data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount, currency,
        name: 'TechFox',
        description: program.title,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              name: formData.name, email: formData.email,
              phone: `+91${formData.phone}`, course: program.title, amount
            });
            toast.success("Payment successful! Enrollment confirmed.");
            setIsModalOpen(false);
            setFormData({ name: "", email: "", phone: "" });
          } catch { toast.error("Payment done but enrollment failed. Please contact support."); }
        },
        prefill: { name: formData.name, email: formData.email, contact: `+91${formData.phone}` },
        theme: { color: '#FA8128' },
        modal: { ondismiss: () => setSubmitting(false) }
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => { toast.error("Payment failed."); setSubmitting(false); });
      rzp.open();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to initiate payment");
      setSubmitting(false);
    }
  };

  if (loading) return (
    <><Header />
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#FA8128] border-t-transparent rounded-full animate-spin"></div>
    </div>
    <Footer /></>
  );

  if (!program) return (
    <><Header />
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <GraduationCap size={48} className="text-gray-300 mb-4" />
      <h2 className="text-xl font-bold text-gray-700 mb-2">Program not found</h2>
      <button onClick={() => navigate('/summer-internship')} className="text-[#FA8128] text-sm hover:underline">← Back to Internships</button>
    </div>
    <Footer /></>
  );

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="w-full bg-gradient-to-br from-orange-50 via-white to-orange-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FA8128] opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FA8128] opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
          <button onClick={() => navigate('/summer-internship')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#FA8128] mb-5 transition-colors">
            <ArrowLeft size={16} /> Back to Internships
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block bg-orange-100 text-[#FA8128] text-xs font-semibold px-3 py-1 rounded-full mb-4">
                Summer Internship Program
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-3">
                {program.title}
              </h1>
              <p className="text-[#FA8128] font-medium text-sm sm:text-base mb-2">Learn • Build • Innovate</p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">{program.description}</p>

              <div className="flex flex-wrap gap-3 mb-8">
                {program.duration && (
                  <div className="flex items-center gap-2 bg-white border border-orange-100 shadow-sm rounded-lg px-4 py-2">
                    <Clock size={16} className="text-[#FA8128]" />
                    <span className="text-sm font-medium text-gray-700">{program.duration}</span>
                  </div>
                )}
                {program.price > 0 && (
                  <div className="flex items-center gap-2 bg-white border border-orange-100 shadow-sm rounded-lg px-4 py-2">
                    <IndianRupee size={16} className="text-[#FA8128]" />
                    <span className="text-sm font-medium text-gray-700">₹{program.price.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {program.earlyBirdDeadline && (
                  <div className="flex items-center gap-2 bg-white border border-orange-100 shadow-sm rounded-lg px-4 py-2">
                    <Calendar size={16} className="text-[#FA8128]" />
                    <span className="text-sm font-medium text-gray-700">Early Bird: {program.earlyBirdDeadline}</span>
                  </div>
                )}
              </div>

              <motion.button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#FA8128] hover:bg-orange-600 text-white font-bold py-3 px-10 rounded-lg transition-colors text-sm"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              >
                {program.price > 0 ? `Enroll Now — ₹${program.price.toLocaleString('en-IN')}` : 'Enroll Now'}
              </motion.button>
            </motion.div>

            {/* Right - thumbnail */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="flex justify-center"
            >
              {program.thumbnail ? (
                <img src={program.thumbnail} alt={program.title} className="w-full max-w-lg rounded-2xl shadow-md" />
              ) : (
                <div className="w-full max-w-lg h-72 sm:h-80 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-md flex items-center justify-center">
                  <GraduationCap size={80} className="text-white/40" />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Domains + Benefits */}
      <section className="w-full py-12 sm:py-16 bg-white">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Domains */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="inline-block bg-[#FA8128] text-white text-xs font-bold px-4 py-1.5 rounded-full mb-5 tracking-wide">
                DOMAINS
              </div>
              <ul className="space-y-3">
                {domains.map((d, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckSquare size={16} className="text-[#FA8128] flex-shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Perks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }}
              className="bg-orange-50 rounded-2xl p-6 border border-orange-100"
            >
              <div className="inline-block bg-[#FA8128] text-white text-xs font-bold px-4 py-1.5 rounded-full mb-5 tracking-wide">
                BENEFITS
              </div>
              <ul className="space-y-3">
                {perks.map((p, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckSquare size={16} className="text-[#FA8128] flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits of Internship */}
      <section className="w-full py-12 sm:py-16 bg-gray-50">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-[#FA8128] text-xs font-semibold tracking-widest uppercase mb-2">Why Join Us</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Benefits of Internship Programs</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }} viewport={{ once: true }}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4"
              >
                <span className="text-3xl">{b.icon}</span>
                <p className="text-sm font-semibold text-gray-800">{b.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + Contact */}
      <section className="w-full py-12 bg-orange-50 border-t border-orange-100">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              {program.earlyBirdDeadline && (
                <div className="flex items-center gap-3 bg-white border border-orange-200 rounded-lg px-5 py-3 mb-4 w-fit">
                  <Calendar size={18} className="text-[#FA8128]" />
                  <div>
                    <p className="text-xs text-gray-500">Early Bird Offer Deadline</p>
                    <p className="text-base font-bold text-gray-800">{program.earlyBirdDeadline}</p>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2"><Phone size={14} className="text-[#FA8128]" /> 7349141410</div>
                <div className="flex items-center gap-2"><Globe size={14} className="text-[#FA8128]" /> www.techfox.co</div>
                <div className="flex items-center gap-2"><Mail size={14} className="text-[#FA8128]" /> team@techfox.co</div>
              </div>
            </div>
            <motion.button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#FA8128] hover:bg-orange-600 text-white font-bold py-4 px-12 rounded-xl transition-colors text-base whitespace-nowrap"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            >
              Enroll Now
            </motion.button>
          </div>
        </div>
      </section>

      {/* Enrollment Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/50 z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-[95%] max-w-md"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div>
                  <h2 className="text-base font-bold text-gray-800">Enroll in Program</h2>
                  {program.price > 0 && <p className="text-sm text-[#FA8128] font-semibold">₹{program.price.toLocaleString('en-IN')}</p>}
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              <form onSubmit={handleEnroll} className="p-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                  <input type="text" required placeholder="Enter your full name" value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FA8128]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" required placeholder="Enter your email" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FA8128]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Mobile Number *</label>
                  <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                    <div className="flex items-center px-3 bg-gray-50 border-r border-gray-200">
                      <span className="text-sm text-gray-600">+91</span>
                    </div>
                    <input type="tel" placeholder="Enter 10 digit number" value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      className="flex-1 px-3 py-2.5 text-sm focus:outline-none" maxLength={10} required />
                  </div>
                  {formData.phone && formData.phone.length !== 10 && (
                    <p className="text-xs text-red-500 mt-1">Phone number must be 10 digits</p>
                  )}
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full bg-[#FA8128] hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50 mt-2"
                >
                  {submitting ? "Processing..." : program.price > 0 ? `Pay ₹${program.price.toLocaleString('en-IN')} & Enroll` : "Enroll Now"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

export default InternshipDetail;
