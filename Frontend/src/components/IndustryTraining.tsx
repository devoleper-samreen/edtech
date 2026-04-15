import { useState } from "react";
import { motion } from "framer-motion";
import CallbackModal from "./CallbackModal";

function IndustryTraining() {
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* Content */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left Content */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
              Industry-Relevant Training
            </h3>

            <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8">
              At TechFox, we are committed to providing industry-relevant
              training that aligns with the current trends and technologies
              in the IT sector. Our expert-led courses ensure that students
              gain the practical, in-demand skills needed to excel in
              today's competitive job market.
            </p>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-12 mb-6 sm:mb-8 justify-center lg:justify-start">
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#FA8128]">
                  100+
                </p>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  Industry-relevant<br />technologies are offered
                </p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#FA8128]">
                  90+
                </p>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  Training Institutes<br />all over India
                </p>
              </div>
            </div>

            {/* Button */}
            <div className="flex justify-center lg:justify-start">
              <motion.button
                onClick={() => setIsCallbackOpen(true)}
                className="bg-[#FA8128] hover:bg-[#FA8128] text-white font-semibold py-3 sm:py-3.5 px-6 sm:px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Enquire Now
              </motion.button>
            </div>
          </motion.div>

          {/* Callback Modal with Corporate Training tab selected */}
          <CallbackModal
            isOpen={isCallbackOpen}
            onClose={() => setIsCallbackOpen(false)}
            defaultTab="corporate"
          />

          {/* Right Image */}
          <motion.div
            className="flex-1 flex justify-center lg:justify-end w-full lg:-mr-10"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <img
              src="/techfox_transparent2.png"
              alt="Professional with laptop"
              className="w-full max-w-[300px] sm:max-w-md h-[300px] sm:h-[350px] md:h-[400px] rounded-lg object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default IndustryTraining;
