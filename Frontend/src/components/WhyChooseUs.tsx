import { motion } from "framer-motion";

const sections = [
  {
    title: "Placement Assistance",
    image: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=550&h=400&fit=crop",
    imageAlt: "Placement Assistance",
    imageLeft: true,
    mascot: false,
    points: [
      "At TechFox, we collaborate with 500+ companies to create strong career opportunities for our students.",
      "Our dedicated placement support team actively connects students with hiring partners.",
      "Every eligible student receives guaranteed interview opportunities.",
      "We help students confidently start their careers in the tech industry.",
    ],
  },
  {
    title: "Internship Opportunities",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=550&h=400&fit=crop",
    imageAlt: "Internship Opportunities",
    imageLeft: false,
    mascot: false,
    points: [
      "TechFox provides high-quality internship opportunities to help students gain real industry exposure.",
      "Students work on real projects and apply their technical knowledge in practical environments.",
      "These internships help build strong experience and professional portfolios.",
    ],
  },
  {
    title: "Expert Faculty Guidance",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=550&h=400&fit=crop",
    imageAlt: "Expert Faculty Guidance",
    imageLeft: true,
    mascot: false,
    points: [
      "Learn from experienced trainers at TechFox who combine strong teaching expertise with real industry knowledge.",
      "Our mentors focus on practical learning, hands-on projects, and personalized guidance.",
      "This helps students clearly understand concepts and build skills required in the real tech industry.",
    ],
  },
  {
    title: "Industry-Relevant Training",
    image: "/texfox_transparent.png",
    imageAlt: "Industry-Relevant Training",
    imageLeft: false,
    mascot: true,
    points: [
      "At TechFox, our programs are designed according to the latest technologies and industry demands.",
      "Students gain practical, job-ready skills through expert-led training and real-world project experience.",
      "Our goal is to prepare students for today's competitive IT job market.",
    ],
  },
];

function WhyChooseUs() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20 bg-white">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 text-center mb-10 sm:mb-12 md:mb-16 italic">
          Why Choose TechFox
        </h2>

        <div className="flex flex-col gap-16 sm:gap-20 md:gap-28">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 ${
                !section.imageLeft ? "lg:flex-row-reverse" : ""
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              {/* Image */}
              <div className="flex-1 flex justify-center w-full">
                <img
                  src={section.image}
                  alt={section.imageAlt}
                  className={section.mascot
                    ? "w-full max-w-[320px] sm:max-w-[400px] object-contain"
                    : "w-full max-w-[300px] sm:max-w-md lg:max-w-lg h-[220px] sm:h-[280px] md:h-[320px] rounded-xl object-cover shadow-md"
                  }
                />
              </div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600 text-sm sm:text-base leading-relaxed justify-center lg:justify-start">
                      <span className="text-[#FA8128] mt-1 flex-shrink-0 text-lg">✦</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
