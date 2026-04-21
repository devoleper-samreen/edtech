const TailoredIcon = () => (
  <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
    <rect x="8" y="6" width="24" height="30" rx="2" fill="#fecaca" stroke="#ef4444" strokeWidth="2"/>
    <rect x="16" y="10" width="20" height="6" rx="1" fill="#fca5a5"/>
    <rect x="12" y="20" width="16" height="3" rx="1" fill="#ef4444"/>
    <rect x="12" y="26" width="12" height="3" rx="1" fill="#ef4444"/>
  </svg>
);

const SupportiveIcon = () => (
  <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
    <circle cx="16" cy="16" r="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2"/>
    <circle cx="32" cy="16" r="8" fill="#fed7aa" stroke="#f59e0b" strokeWidth="2"/>
    <rect x="12" y="28" width="24" height="12" rx="2" fill="#d1fae5" stroke="#10b981" strokeWidth="2"/>
  </svg>
);

const MeasurableIcon = () => (
  <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
    <rect x="6" y="24" width="8" height="18" rx="1" fill="#fce7f3" stroke="#ec4899" strokeWidth="2"/>
    <rect x="18" y="16" width="8" height="26" rx="1" fill="#fed7aa" stroke="#f59e0b" strokeWidth="2"/>
    <rect x="30" y="8" width="8" height="34" rx="1" fill="#d1fae5" stroke="#10b981" strokeWidth="2"/>
  </svg>
);

const FlexibleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
    <rect x="12" y="8" width="24" height="6" rx="2" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2"/>
    <path d="M24 14v8M24 22l-8 12h16l-8-12z" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2"/>
    <circle cx="24" cy="38" r="4" fill="#f59e0b"/>
  </svg>
);

const ExpertIcon = () => (
  <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
    <circle cx="20" cy="16" r="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2"/>
    <rect x="12" y="26" width="16" height="14" rx="2" fill="#fed7aa" stroke="#f59e0b" strokeWidth="2"/>
    <rect x="32" y="12" width="10" height="14" rx="1" fill="#fed7aa" stroke="#f59e0b" strokeWidth="2"/>
  </svg>
);

const RealWorldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
    <rect x="8" y="8" width="32" height="24" rx="2" fill="#fed7aa" stroke="#f59e0b" strokeWidth="2"/>
    <rect x="12" y="12" width="24" height="16" rx="1" fill="#fef3c7"/>
    <rect x="16" y="36" width="16" height="4" rx="1" fill="#FA8128"/>
  </svg>
);

const features = [
  {
    icon: <TailoredIcon />,
    title: "Structured Learning Path",
    description: "21 days of intensive training followed by up to 24 days of real-time project work — a complete career-ready journey.",
  },
  {
    icon: <MeasurableIcon />,
    title: "Measurable Results",
    description: "Participants build a strong project portfolio with Demo Day presentations that clearly showcase their growth and impact.",
  },
  {
    icon: <ExpertIcon />,
    title: "Expert Mentorship",
    description: "Learn directly from industry professionals, startup founders, and tech experts who guide you every step of the way.",
  },
  {
    icon: <SupportiveIcon />,
    title: "Industry-Recognized Certification",
    description: "Receive an industry-recognized certificate and Letter of Internship that stands out to every recruiter and employer.",
  },
  {
    icon: <FlexibleIcon />,
    title: "Flexible Tech Domains",
    description: "Choose your track — AI/ML, Data Science, IoT, AWS Cloud, Web Dev (MERN), Cyber Security, or CAD Design.",
  },
  {
    icon: <RealWorldIcon />,
    title: "Career Acceleration",
    description: "Top performers get internship extensions, job referrals from partner companies, and national-level hackathon opportunities.",
  },
];

function InternshipFeatures() {
  return (
    <section className="max-w-[1600px] mx-auto w-full py-12 sm:py-16 bg-white relative overflow-hidden">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10 sm:mb-16 px-4">
        TechFox Summer Internship Features
      </h2>

      {/* Decorative lines background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1200 600" fill="none" preserveAspectRatio="none">
          {[...Array(12)].map((_, i) => (
            <path
              key={i}
              d={`M ${600 + i * 30} 300 Q ${800 + i * 20} ${400 + i * 15} ${1200} ${500 + i * 10}`}
              stroke="#fed7aa"
              strokeWidth="1"
              fill="none"
            />
          ))}
          {[...Array(12)].map((_, i) => (
            <path
              key={`left-${i}`}
              d={`M ${600 - i * 30} 300 Q ${400 - i * 20} ${400 + i * 15} ${0} ${500 + i * 10}`}
              stroke="#fed7aa"
              strokeWidth="1"
              fill="none"
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6">
        {/* Center Logo */}
        <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-[140px] h-[140px] xl:w-[160px] xl:h-[160px] rounded-full bg-gradient-to-br from-orange-100 to-orange-50 border-2 border-orange-200 flex items-center justify-center shadow-xl">
            <div className="text-center">
              <div className="text-lg xl:text-xl font-bold text-gray-800 text-center leading-tight">
                Tech<span className="text-[#FA8128]">Fox</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-x-[180px] xl:gap-x-[220px] 2xl:gap-x-[280px] relative lg:min-h-[500px]">
          {/* Mobile/Tablet */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 col-span-full">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-4 sm:p-5 border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:border-[#FA8128]/30"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm">{feature.title}</h3>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed pl-1">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Desktop Left Column */}
          <div className="hidden lg:flex flex-col items-end space-y-6 pt-0">
            {features.filter((_, i) => i % 2 === 0).map((feature, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl p-5 w-full max-w-[320px] xl:max-w-[380px] 2xl:max-w-[420px] border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:border-[#FA8128]/30 ${
                  index === 0 ? 'mr-8' : index === 1 ? 'mr-0' : 'mr-16'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm">{feature.title}</h3>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed pl-1">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Desktop Right Column */}
          <div className="hidden lg:flex flex-col items-start space-y-6 pt-16">
            {features.filter((_, i) => i % 2 === 1).map((feature, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl p-5 w-full max-w-[320px] xl:max-w-[380px] 2xl:max-w-[420px] border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:border-[#FA8128]/30 ${
                  index === 0 ? 'ml-16' : index === 1 ? 'ml-0' : 'ml-8'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm">{feature.title}</h3>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed pl-1">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          <svg className="w-full h-full" viewBox="0 0 1100 500" fill="none">
            <circle cx="550" cy="250" r="100" stroke="#FA8128" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.3"/>
            <circle cx="550" cy="250" r="140" stroke="#f97316" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.2"/>
          </svg>
        </div>
      </div>
    </section>
  );
}

export default InternshipFeatures;
