import { useState } from "react";
import { motion } from "framer-motion";
import CallbackModal from "./CallbackModal";
//className='max-w-[1180px] w-full mx-auto'

function Hero() {
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  return (
    <section className="w-full bg-gradient-to-br from-orange-50 via-white to-orange-100 relative overflow-hidden" ><div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 pt-4 pb-16 sm:pb-20">
      {/* Background decorative circles */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-orange-300/20 rounded-full blur-3xl"></div>

      {/* Wavy lines decoration */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100 400C100 300 300 500 500 400C700 300 900 500 1100 400C1300 300 1500 500 1700 400" stroke="#FA8128" strokeWidth="2" fill="none"/>
          <path d="M-100 500C100 400 300 600 500 500C700 400 900 600 1100 500C1300 400 1500 600 1700 500" stroke="#FA8128" strokeWidth="2" fill="none"/>
          <path d="M-100 600C100 500 300 700 500 600C700 500 900 700 1100 600C1300 500 1500 700 1700 600" stroke="#FA8128" strokeWidth="2" fill="none"/>
        </svg>
      </div>

      <div className="w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <motion.div
            className="flex-1 max-w-xl text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Tagline Badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-orange-100 text-[#FA8128] text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              ✦ Where Students Become Industry Professionals
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-gray-800 leading-tight">
              Launch Your Career.{" "}
              <span className="text-[#FA8128] relative inline-block">
                On Your Terms.
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#FA8128] rounded-full"></span>
              </span>
            </h1>

            <p className="mt-3 text-lg sm:text-xl font-semibold text-gray-500 tracking-wide">
              Learn. Build. Intern. Grow.
            </p>

            <p className="mt-4 text-gray-600 text-sm sm:text-base leading-relaxed">
              At TechFox, we turn ambitious students into industry-ready professionals.
              Whether you're diving into our power-packed training programs or gaining
              real-world experience through our Summer Internship Program — your career
              journey starts here.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <motion.a
                href="/summer-internship"
                className="bg-[#FA8128] text-white font-semibold py-2.5 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📋 Apply for Internship
              </motion.a>
              <motion.button
                onClick={() => setIsCallbackOpen(true)}
                className="border-2 border-[#FA8128] text-[#FA8128] font-semibold py-2.5 px-8 rounded-lg hover:bg-orange-50 transition-all duration-300 text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book a Demo
              </motion.button>
            </div>
          </motion.div>

          {/* Callback Modal */}
          <CallbackModal
            isOpen={isCallbackOpen}
            onClose={() => setIsCallbackOpen(false)}
          />

          {/* Right Image */}
          <motion.div
            className="flex-1 flex justify-center lg:justify-start w-full lg:-ml-20"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src="/texfox_transparent.png"
              alt="Software Training Mind Map"
              className="w-full max-w-[300px] sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl object-contain"
            />
          </motion.div>
        </div>
      </div>
    </div>
    </section>
  );
}

export default Hero;
