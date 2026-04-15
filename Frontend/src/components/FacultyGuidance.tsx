import { motion } from "framer-motion";

function FacultyGuidance() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* Content */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left Image */}
          <motion.div
            className="flex-1 flex justify-center lg:justify-start w-full order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <img
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=550&h=400&fit=crop"
              alt="Faculty Team"
              className="w-full max-w-[300px] sm:max-w-md lg:max-w-lg h-[250px] sm:h-[300px] md:h-[350px] rounded-lg object-cover"
            />
          </motion.div>

          {/* Right Content */}
          <motion.div
            className="flex-1 text-center lg:text-left order-1 lg:order-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
              Get Experienced Faculty<br />Guidance
            </h3>

            <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8">
              Discover our team of experienced faculty who bring a wealth
              of teaching expertise and real-world knowledge to every
              classroom. With qualifications, teaching evaluations, and
              industry experience, they ensure effective instruction and
              mentorship for your academic journey.
            </p>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-10 justify-center lg:justify-start">
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#FA8128]">
                  500+
                </p>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  Experienced<br />Trainers
                </p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#FA8128]">
                  4.3/5
                </p>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  Average Support<br />Rating
                </p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#FA8128]">
                  1:1
                </p>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  Support<br />Program
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default FacultyGuidance;
