import { motion } from "framer-motion";

const partners = [
  "Acuvate",
  "Concentrix",
  "Epsilon",
  "HCL",
  "LG Soft India",
  "NTT Data",
  "Sigma",
  "Infosys",
  "TCS",
  "Wipro",
  "Cognizant",
  "Capgemini",
];

function HiringPartners() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20 bg-[#fff7f0] overflow-hidden">
      <div className="w-full px-4 sm:px-6 md:px-10 mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center">
          Our Hiring Partners
        </h2>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient fade on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#fff7f0] to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#fff7f0] to-transparent z-10"></div>

        {/* Scrolling content */}
        <motion.div
          className="flex gap-20 items-center"
          animate={{
            x: [0, -1920],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {/* First set of partners */}
          {partners.map((partner, index) => (
            <div
              key={`first-${index}`}
              className="flex-shrink-0 text-lg sm:text-xl md:text-2xl font-bold text-[#FA8128] italic whitespace-nowrap hover:text-[#FA8128] transition-colors cursor-pointer"
            >
              {partner}
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {partners.map((partner, index) => (
            <div
              key={`second-${index}`}
              className="flex-shrink-0 text-lg sm:text-xl md:text-2xl font-bold text-[#FA8128] italic whitespace-nowrap hover:text-[#FA8128] transition-colors cursor-pointer"
            >
              {partner}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default HiringPartners;
