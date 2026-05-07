import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone } from "lucide-react";
import toast from "react-hot-toast";
// @ts-ignore
import { callbackService } from "../services/callbackService";

interface CallbackModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

function CallbackModal({ isOpen: externalIsOpen, onClose }: CallbackModalProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Determine if modal is controlled externally or internally
  const isControlled = externalIsOpen !== undefined;
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;

  const handleClose = () => {
    if (isControlled && onClose) {
      onClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const handleOpen = () => {
    if (!isControlled) {
      setInternalIsOpen(true);
    }
  };



  return (
    <>
      {/* Floating Button - only show if not externally controlled */}
      {!isControlled && (
        <motion.button
          onClick={handleOpen}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-[#FA8128] hover:bg-[#FA8128] text-white p-3 sm:px-4 sm:py-2.5 rounded-full shadow-lg flex items-center gap-2 z-40"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Phone size={20} className="sm:w-[18px] sm:h-[18px]" />
          <span className="hidden sm:inline text-sm font-medium">Book Demo</span>
        </motion.button>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
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
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  Book Demo
                </h2>
                <motion.button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} className="sm:w-[22px] sm:h-[22px]" />
                </motion.button>
              </motion.div>

              {/* Form */}
              <motion.div
                className="p-4 sm:p-5 pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <GeneralForm onSuccess={handleClose} />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

interface FormProps {
  onSuccess: () => void;
}

function GeneralForm({ onSuccess }: FormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      toast.error("Please fill name and phone number");
      return;
    }

    if (formData.phone.length !== 10) {
      toast.error("Phone number must be 10 digits");
      return;
    }

    setSubmitting(true);
    try {
      await callbackService.createCallback({
        name: formData.name,
        phone: `+91${formData.phone}`,
        email: formData.email,
        type: "General",
        message: formData.message
      });
      toast.success("Callback request submitted! We will call you soon.");
      setFormData({ name: "", phone: "", email: "", message: "" });
      onSuccess();
    } catch (error: any) {
      console.error("Error submitting callback:", error);
      toast.error(error.response?.data?.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
            <span className="text-red-500">*</span> Mobile Number
          </label>
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center gap-1 px-2 bg-gray-50 border-r border-gray-200">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FA8128]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            placeholder="Enter your message"
            rows={3}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FA8128] resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <motion.button
          type="submit"
          disabled={submitting}
          className="bg-[#FA8128] hover:bg-[#FA8128] text-white font-medium py-2.5 px-8 rounded-lg transition-colors text-sm disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {submitting ? "Submitting..." : "Submit"}
        </motion.button>
      </div>
    </form>
  );
}

export default CallbackModal;
