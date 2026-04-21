import { useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CallbackModal from "../components/CallbackModal";
import { Phone, Mail, MapPin, User, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
// @ts-ignore
import { enquiryService } from "../services/enquiryService";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Please enter your message");
      return;
    }

    setLoading(true);
    try {
      await enquiryService.createEnquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone ? `+91${formData.phone}` : "",
        course: "General Inquiry",
        message: formData.message.trim()
      });

      toast.success("Your message has been sent successfully! We will contact you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />

      {/* Hero Section with Form */}
      <section
        className="w-full relative bg-gray-50"
        style={{ paddingTop: "30px" }}
      >
        {/* Background - only 50vh height */}
        <div className="absolute top-0 left-0 right-0 h-[45vh] sm:h-[50vh] min-h-[320px] sm:min-h-[350px] bg-[#0f172a] overflow-hidden">
          {/* Decorative curved shape on left */}
          <div className="absolute left-0 top-0 h-full w-[300px]">
            <svg
              viewBox="0 0 300 300"
              fill="none"
              className="h-full w-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0 0H150C150 0 300 75 300 150C300 225 150 300 150 300H0V0Z"
                fill="#7c3010"
              />
              <path
                d="M0 0H100C100 0 250 75 250 150C250 225 100 300 100 300H0V0Z"
                fill="#9a3d12"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-3 sm:px-6 pt-8 sm:pt-10 pb-16 sm:pb-20">
          {/* Header Text */}
          <motion.div
            className="text-center mb-8 sm:mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-4">
              We are eager to{" "}
              <span className="text-[#FA8128]">hear from you!</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-300 px-4">
              Feel free to get in touch with the team if you have any questions
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            className="flex flex-col md:flex-row rounded-xl overflow-hidden shadow-2xl max-w-[900px] mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Left - Form */}
            <div className="flex-1 bg-white p-5 sm:p-8 md:p-10">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8">
                Fill out the form to hear from our Team!
              </h2>

              <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="text-red-500">*</span> Name
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FA8128]"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <div className={`flex border rounded-lg overflow-hidden ${phoneError ? 'border-red-300' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-1.5 px-3 bg-gray-50 border-r border-gray-200">
                      <span className="text-sm">🇮🇳</span>
                      <span className="text-sm text-gray-600">+91</span>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter mobile number"
                      className="flex-1 px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>
                  {phoneError && <p className="text-red-500 text-xs mt-1.5">{phoneError}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="text-red-500">*</span> E-mail
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FA8128]"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="text-red-500">*</span> Your Messages
                  </label>
                  <div className="relative">
                    <MessageSquare
                      size={18}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Type here..."
                      rows={5}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FA8128] resize-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="bg-[#FA8128] hover:bg-[#FA8128] text-white font-medium py-3 px-8 sm:px-12 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? "Sending..." : "Submit"}
                  </motion.button>
                </div>
              </form>
            </div>

            {/* Right - Contact Info */}
            <div className="w-full md:w-[340px] bg-gradient-to-b from-[#FA8128] to-[#f97316] p-5 sm:p-8 md:p-10 text-white">
              <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Contact Info</h3>

              {/* India */}
              <div>
                <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">India</h4>
                <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
                  <div className="flex items-start gap-2">
                    <Phone size={14} className="mt-1 flex-shrink-0" />
                    <span className="break-words">+91 7349141410</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail size={14} className="mt-1 flex-shrink-0" />
                    <span className="break-all">team@techfox.co</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="mt-1 flex-shrink-0" />
                    <span>
                      13th Main, 17th Cross, 5th Phase, JP Nagar, Bangalore – 560078
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <CallbackModal />
    </div>
  );
}

export default ContactUs;
