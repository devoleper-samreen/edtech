import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  courseName?: string;
}

const PaymentSuccessModal = ({ isOpen, onClose, courseName }: Props) => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    onClose();
    navigate("/student");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-4"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={48} className="text-green-500" />
              </div>
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">Enrollment Successful!</h2>

            {courseName && (
              <p className="text-[#FA8128] font-medium mb-3">{courseName}</p>
            )}

            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Your payment was successful and your enrollment is confirmed.
              Visit your <strong>Student Dashboard</strong> to access your enrolled courses and internships.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleGoToDashboard}
                className="flex-1 bg-[#FA8128] text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PaymentSuccessModal;
