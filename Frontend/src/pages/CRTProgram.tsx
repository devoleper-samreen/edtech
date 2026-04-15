import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
// @ts-ignore
import api from "../config/api";

const softSkillModules = [
  {
    icon: "📊",
    title: "Quantitative Aptitude",
    description:
      "Number systems, percentages, ratios, time & work, profit & loss with shortcut techniques.",
  },
  {
    icon: "🧩",
    title: "Logical Reasoning",
    description:
      "Puzzles, syllogisms, blood relations, coding-decoding, seating arrangements, and critical thinking.",
  },
  {
    icon: "📖",
    title: "Verbal Ability & English",
    description:
      "Reading comprehension, grammar, vocabulary, sentence completion, and error correction.",
  },
  {
    icon: "🎙️",
    title: "Communication Skills",
    description:
      "Spoken English, professional body language, listening skills, and confidence building.",
  },
  {
    icon: "💼",
    title: "HR Interview Preparation",
    description:
      "Behavioural questions, salary discussions, personal story, and leaving lasting impressions.",
  },
  {
    icon: "🗣️",
    title: "Group Discussion (GD)",
    description:
      "GD strategies, how to initiate and conclude, managing disagreement, and standing out.",
  },
];

const techModules = [
  {
    icon: "💻",
    title: "Programming — Python / Java / C",
    description:
      "Core programming concepts, problem-solving, logic building, and coding exercises tailored to placement test patterns.",
  },
  {
    icon: "🤖",
    title: "AI & Machine Learning (AIML)",
    description:
      "Fundamentals of artificial intelligence, ML algorithms, real-world use cases, and exposure to AI tools.",
  },
  {
    icon: "📈",
    title: "Data Science",
    description:
      "Introduction to data science lifecycle, Python-based analysis, basic statistics, and data storytelling.",
  },
  {
    icon: "📊",
    title: "Data Analytics",
    description:
      "Data interpretation, working with Excel and tools, dashboards, and business insight generation.",
  },
  {
    icon: "🗄️",
    title: "DBMS",
    description:
      "Relational databases, SQL queries, normalization, transactions, and practical database problem-solving.",
  },
  {
    icon: "🌐",
    title: "Industry Technology Trends",
    description:
      "Emerging technologies like Cloud, DevOps, Blockchain, and how to stay relevant in a fast-moving tech landscape.",
  },
];

const phases = [
  {
    number: "01",
    title: "Assessment",
    description: "Pre-training diagnostic test to map student readiness levels",
  },
  {
    number: "02",
    title: "Classroom Training",
    description:
      "Interactive sessions covering all modules with practice exercises",
  },
  {
    number: "03",
    title: "Mock Drives",
    description:
      "Simulated aptitude tests, GDs, and mock HR interviews with feedback",
  },
  {
    number: "04",
    title: "Review & Support",
    description:
      "Post-session reports, revision, and placement week support",
  },
];

const whyUs = [
  {
    title: "Industry-aligned content",
    description:
      "Syllabus updated based on current recruiter patterns from top MNCs and product companies.",
  },
  {
    title: "Experienced trainers",
    description:
      "Delivered by professional trainers with hands-on experience in campus hiring and recruitment.",
  },
  {
    title: "Fully on-campus delivery",
    description:
      "No logistics hassle — we come to you and train within your academic schedule.",
  },
  {
    title: "Performance tracking",
    description:
      "Regular assessments and progress reports shared with the placement cell for full visibility.",
  },
  {
    title: "Customisable batches",
    description:
      "We tailor batch size, session timing, and module depth based on your academic calendar.",
  },
  {
    title: "Holistic development",
    description:
      "Beyond aptitude — we build confidence, communication, and the professional mindset companies look for.",
  },
];

const outcomes = [
  {
    highlight: "Higher selection rates",
    rest: " in aptitude rounds of campus drives from top IT and core companies",
  },
  {
    highlight: "Improved spoken communication",
    rest: " and professional confidence during interviews and group discussions",
  },
  {
    highlight: "Stronger placement statistics",
    rest: " for the institution, boosting its reputation with recruiters year-on-year",
  },
  {
    highlight: "Shortcut strategies",
    rest: " for time-bound aptitude, reasoning, and technical screening tests",
  },
  {
    highlight: "Hands-on technical skills",
    rest: " in programming, data science, AIML and DBMS that align with what companies test in technical rounds",
  },
  {
    highlight: "Mock drive experience",
    rest: " so students enter real placement drives with reduced anxiety and better performance",
  },
];

function CRTProgram() {
  const [formData, setFormData] = useState({
    collegeName: "",
    contactPerson: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/enquiries", {
        name: formData.collegeName,
        email: formData.email,
        phone: formData.phone,
        course: "CRT Program - College Inquiry",
        message: `Contact Person: ${formData.contactPerson}\n\n${formData.message}`,
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ collegeName: "", contactPerson: "", phone: "", email: "", message: "" });
      }, 2000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="w-full bg-gradient-to-br from-orange-50 via-white to-orange-100 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FA8128] opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FA8128] opacity-5 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-8 sm:py-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-start gap-12">
            {/* Left: Content */}
            <div className="flex-1">
              <p className="text-[#FA8128] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-4">
                Campus Recruitment Training
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
                Turning Students Into{" "}
                <span className="text-[#FA8128]">Job-Ready Professionals</span>
              </h1>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-10">
                We partner with colleges to deliver structured, results-driven CRT
                programs that bridge the gap between academics and industry
                expectations — right on your campus.
              </p>
              <div className="flex flex-wrap gap-10">
                <div>
                  <p className="text-3xl sm:text-4xl font-bold text-gray-800">
                    95%<span className="text-[#FA8128]">+</span>
                  </p>
                  <p className="text-gray-500 text-sm mt-1">Placement Improvement</p>
                </div>
                <div className="border-l border-orange-200 pl-10">
                  <p className="text-3xl sm:text-4xl font-bold text-gray-800">
                    On-Campus
                  </p>
                  <p className="text-gray-500 text-sm mt-1">Offline Delivery</p>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="w-full lg:w-[420px] flex-shrink-0">
              {submitted ? (
                <div className="bg-white border border-[#FA8128]/30 rounded-2xl p-8 text-center shadow-md">
                  <p className="text-3xl mb-3">🎉</p>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Thank you for reaching out!</h3>
                  <p className="text-gray-500 text-sm">Our team will contact you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-md border border-orange-100 space-y-4">
                  <h3 className="text-lg font-bold text-gray-800">Bring CRT to Your Campus</h3>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">College Name <span className="text-[#FA8128]">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., RV College of Engineering"
                      value={formData.collegeName}
                      onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#FA8128]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Contact Person <span className="text-[#FA8128]">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="TPO / Placement Officer Name"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#FA8128]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Phone <span className="text-[#FA8128]">*</span></label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 XXXXX XXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#FA8128]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Email <span className="text-[#FA8128]">*</span></label>
                      <input
                        type="email"
                        required
                        placeholder="tpo@college.edu"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#FA8128]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Message</label>
                    <textarea
                      rows={3}
                      placeholder="Batch size, preferred timeline, etc."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#FA8128] resize-none"
                    />
                  </div>
                  {error && <p className="text-red-500 text-xs">{error}</p>}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#FA8128] hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition-colors duration-300 disabled:opacity-60 text-sm"
                  >
                    {submitting ? "Sending..." : "Send Enquiry"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* The Challenge */}
      <section className="w-full bg-white py-14 sm:py-20">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <p className="text-[#FA8128] text-xs font-semibold tracking-widest uppercase mb-3">
            The Challenge
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-5">
            Why students miss placements despite good grades
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-3xl mb-8">
            Engineering students often excel in theory but struggle when it
            comes to aptitude tests, group discussions, and HR interviews. A
            lack of structured training leaves them underprepared for real
            campus drives.
          </p>
          <div className="border-l-4 border-[#FA8128] bg-orange-50 px-6 py-5 rounded-r-xl max-w-3xl">
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              <span className="font-bold text-gray-800">The gap is real: </span>
              Recruiters consistently report that while technical knowledge is
              adequate, students fall short on communication, reasoning speed,
              logical thinking, and professional presence — the exact skills CRT
              addresses.
            </p>
          </div>
        </div>
      </section>

      {/* CRT Training Modules */}
      <section className="w-full bg-orange-50 py-14 sm:py-20">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <p className="text-[#FA8128] text-xs font-semibold tracking-widest uppercase mb-3">
            CRT Training Modules
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Aptitude, Communication & Soft Skills
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-3xl mb-10">
            Our CRT curriculum is specifically designed for final-year and
            pre-final-year engineering students, aligned with patterns used by
            top recruiters across IT, core, and product companies.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {softSkillModules.map((mod, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-5 border border-orange-100 hover:border-[#FA8128]/40 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl flex-shrink-0">{mod.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-1">
                      {mod.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Training */}
      <section className="w-full bg-white py-14 sm:py-20">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <p className="text-[#FA8128] text-xs font-semibold tracking-widest uppercase mb-3">
            Technical Training
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Industry-Relevant Technical Skills
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-3xl mb-10">
            Beyond aptitude and soft skills, we equip students with hands-on
            technical knowledge that modern recruiters actively look for —
            giving your college an edge in technical hiring drives.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {techModules.map((mod, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-[#FA8128]/40 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl flex-shrink-0">{mod.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-1">
                      {mod.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="w-full bg-orange-50 py-14 sm:py-20">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <p className="text-[#FA8128] text-xs font-semibold tracking-widest uppercase mb-3">
            Our Approach
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            How we deliver the program on campus
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-3xl mb-10">
            We follow a structured 4-phase delivery model conducted entirely on
            your college premises, ensuring minimal disruption to regular
            academics while maximising student engagement.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {phases.map((phase, i) => (
              <div
                key={i}
                className="bg-gray-800 rounded-xl p-6 text-white relative overflow-hidden"
              >
                <p className="text-5xl font-black text-white/10 absolute top-2 right-4 leading-none">
                  {phase.number}
                </p>
                <p className="text-[#FA8128] text-2xl font-bold mb-2 relative z-10">
                  {phase.number}
                </p>
                <h3 className="font-bold text-white text-base mb-2 relative z-10">
                  {phase.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed relative z-10">
                  {phase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="w-full bg-white py-14 sm:py-20">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <p className="text-[#FA8128] text-xs font-semibold tracking-widest uppercase mb-3">
            Why Us
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-10">
            What makes our training different
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {whyUs.map((item, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-5 hover:border-[#FA8128]/40 hover:shadow-md transition-all duration-300"
              >
                <h3 className="font-bold text-[#FA8128] text-sm sm:text-base mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="w-full bg-orange-50 py-14 sm:py-20">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <p className="text-[#FA8128] text-xs font-semibold tracking-widest uppercase mb-3">
            Outcomes
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8">
            What your students gain
          </h2>
          <ul className="space-y-4">
            {outcomes.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-[#FA8128] font-bold text-lg flex-shrink-0 mt-0.5">
                  ✓
                </span>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  <span className="font-bold text-[#FA8128]">
                    {item.highlight}
                  </span>
                  {item.rest}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default CRTProgram;
