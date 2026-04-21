import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What courses are offered by TechFox?",
    answer: "TechFox offers a wide range of courses including Java Full Stack, Python Full Stack, Software Testing, Data Science, DevOps, MERN Stack, and many more industry-relevant programs."
  },
  {
    question: "Are the courses at TechFox suitable for beginners?",
    answer: "Yes, our courses are designed to cater to all skill levels. We start from the basics and gradually move to advanced topics, making it perfect for beginners as well as experienced professionals."
  },
  {
    question: "What is the duration of the courses offered by TechFox?",
    answer: "Course durations vary depending on the program. Most of our comprehensive courses range from 3 to 6 months, with flexible timing options including weekday and weekend batches."
  },
  {
    question: "Does TechFox offer any job placement assistance?",
    answer: "Yes, we have a dedicated placement cell that works tirelessly to connect our students with leading IT companies. We provide resume building, mock interviews, and direct placement drives."
  },
  {
    question: "What are the prerequisites for enrolling in a course at TechFox?",
    answer: "Prerequisites vary by course. For most beginner courses, basic computer knowledge is sufficient. For advanced courses, relevant foundational knowledge may be required. Our counselors can guide you to the right course."
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 bg-white">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Often asked questions from our wonderful partners
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="text-base sm:text-lg font-medium text-gray-800 pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown size={18} className="sm:w-5 sm:h-5 text-gray-500" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 sm:p-5 pt-0 text-gray-600 text-sm sm:text-base leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
