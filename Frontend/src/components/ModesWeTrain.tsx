import { motion } from "framer-motion";
import { Monitor, Users, Building2 } from "lucide-react";

const trainingModes = [
  {
    icon: Monitor,
    title: "Online Live Classes",
    description:
      "Online classes provide remote learning flexibility through digital platforms. Learn from industry experts with interactive sessions, real-time doubt solving, and hands-on projects from the comfort of your home.",
  },
  {
    icon: Building2,
    title: "Classroom Training",
    description:
      "Traditional classroom training with face-to-face interaction. Get hands-on experience with expert instructors, collaborative learning environment, and immediate feedback on your progress.",
  },
  {
    icon: Users,
    title: "Corporate Training",
    description:
      "Customized training programs for organizations. Upskill your team with industry-relevant courses, flexible scheduling, and tailored curriculum to meet your business objectives.",
  },
];

function ModesWeTrain() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20 bg-gray-50 relative overflow-hidden">
      {/* Decorative lines background */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 1440 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Left side lines */}
          {[...Array(20)].map((_, i) => (
            <path
              key={`left-${i}`}
              d={`M0 ${250 + i * 8} Q 200 ${200 + i * 10}, 400 ${250 + i * 5}`}
              stroke="#3b82f6"
              strokeWidth="1"
              fill="none"
              opacity={0.3 + i * 0.02}
            />
          ))}
          {/* Right side lines */}
          {[...Array(20)].map((_, i) => (
            <path
              key={`right-${i}`}
              d={`M1040 ${250 + i * 8} Q 1240 ${200 + i * 10}, 1440 ${250 + i * 5}`}
              stroke="#3b82f6"
              strokeWidth="1"
              fill="none"
              opacity={0.3 + i * 0.02}
            />
          ))}
        </svg>
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 italic">
            Modes We Train
          </h2>
        </div>

        {/* Training Mode Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {trainingModes.map((mode, index) => {
            const Icon = mode.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 overflow-hidden group cursor-pointer"
              >
                {/* Animated background fill on hover */}
                <div className="absolute inset-0 bg-[#FA8128] transform scale-y-0 origin-bottom transition-transform duration-500 ease-out group-hover:scale-y-100" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FA8128] group-hover:bg-white flex items-center justify-center transition-colors duration-500">
                      <Icon size={28} className="sm:w-8 sm:h-8 text-white group-hover:text-[#FA8128] transition-colors duration-500" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-white text-center mb-3 sm:mb-4 transition-colors duration-500">
                    {mode.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-500 group-hover:text-blue-100 text-center text-xs sm:text-sm leading-relaxed transition-colors duration-500">
                    {mode.description}
                  </p>

                  {/* Bottom accent line */}
                  <div className="mt-4 sm:mt-6 flex justify-center">
                    <div className="w-20 sm:w-24 h-1 bg-[#FA8128] group-hover:bg-white rounded-full transition-colors duration-500"></div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ModesWeTrain;
