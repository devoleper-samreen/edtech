import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
// @ts-ignore
import { useAuth } from "../context/AuthContext";
import { User, Mail, Lock, Phone, Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [showPasswords, setShowPasswords] = useState({ password: false, confirmPassword: false });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    if (digitsOnly.length <= 10) {
      setFormData({ ...formData, phone: digitsOnly });
      if (digitsOnly.length > 0 && digitsOnly.length !== 10) {
        setPhoneError("Phone number must be exactly 10 digits");
      } else {
        setPhoneError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.phone && formData.phone.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits");
      return;
    }

    setLoading(true);
    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone ? `+91${formData.phone}` : "",
      });
      toast.success("Account created successfully! Welcome aboard!");
      navigate("/");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to create account";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    { name: "name", label: "Full Name", icon: User, type: "text", placeholder: "Enter your full name", required: true },
    { name: "email", label: "Email Address", icon: Mail, type: "email", placeholder: "Enter your email", required: true },
    { name: "password", label: "Password", icon: Lock, type: "password", placeholder: "Create a password", required: true },
    { name: "confirmPassword", label: "Confirm Password", icon: Lock, type: "password", placeholder: "Confirm your password", required: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-5 sm:p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Logo & Title */}
          <motion.div
            className="text-center mb-5 sm:mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Tech<span className="text-[#FA8128]">Fox</span>
            </h1>
            <p className="text-gray-600 mt-1.5 sm:mt-2 text-sm sm:text-base">Create your student account</p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xs sm:text-sm text-red-600">{error}</p>
            </motion.div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {formFields.slice(0, 2).map((field, index) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              >
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  {field.label}
                </label>
                <div className="relative">
                  <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type={field.type}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg outline-none focus:border-[#FA8128] focus:ring-2 focus:ring-[#FA8128]/20 transition-all"
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                </div>
              </motion.div>
            ))}

            {/* Phone Number Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Phone Number
              </label>
              <div className={`flex items-center border rounded-lg transition-all ${phoneError ? "border-red-400 ring-2 ring-red-200" : "border-gray-300 focus-within:border-[#FA8128] focus-within:ring-2 focus-within:ring-[#FA8128]/20"}`}>
                <Phone className="ml-3 text-gray-400 flex-shrink-0" size={16} />
                <span className="ml-2 text-gray-600 text-sm font-medium border-r border-gray-300 pr-2 mr-1">🇮🇳 +91</span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="flex-1 pr-3 py-2.5 sm:py-3 text-sm sm:text-base outline-none bg-transparent"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                />
              </div>
              {phoneError && <p className="text-red-500 text-xs mt-1 ml-1">{phoneError}</p>}
            </motion.div>

            {formFields.slice(2).map((field, index) => {
              const key = field.name as "password" | "confirmPassword";
              const visible = showPasswords[key];
              return (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                >
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    {field.label}
                  </label>
                  <div className="relative">
                    <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type={visible ? "text" : "password"}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      className="w-full pl-9 sm:pl-10 pr-10 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg outline-none focus:border-[#FA8128] focus:ring-2 focus:ring-[#FA8128]/20 transition-all"
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, [key]: !visible })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {visible ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </motion.div>
              );
            })}

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FA8128] text-white py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-[#FA8128] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mt-1 sm:mt-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </motion.button>
          </form>

          {/* Login Link */}
          <motion.div
            className="mt-4 sm:mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            <p className="text-xs sm:text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-[#FA8128] font-medium hover:underline">
                Login here
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Additional Info */}
        <motion.p
          className="text-center text-[10px] sm:text-sm text-gray-600 mt-3 sm:mt-4 px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.9 }}
        >
          By signing up, you agree to our Terms & Conditions
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Signup;
