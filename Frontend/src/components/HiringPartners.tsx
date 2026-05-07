import { useState, useEffect } from "react";
import { motion } from "framer-motion";
// @ts-ignore
import { hiringPartnerService } from "../services/hiringPartnerService";

function HiringPartners() {
  const [partners, setPartners] = useState<string[]>([]);

  useEffect(() => {
    hiringPartnerService.getActivePartners()
      .then((res: any) => {
        const names = (res.data || []).map((p: any) => p.name);
        setPartners(names);
      })
      .catch(() => {});
  }, []);

  if (partners.length === 0) return null;

  // Repeat list enough times so marquee always fills screen (min 12 items)
  const minItems = 12;
  const repeatCount = Math.ceil(minItems / partners.length);
  const displayList = Array.from({ length: repeatCount }, () => partners).flat();
  const scrollWidth = displayList.length * 220;

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 bg-[#fff7f0] overflow-hidden">
      <div className="w-full px-4 sm:px-6 md:px-10 mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center">
          Our Hiring Partners
        </h2>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#fff7f0] to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#fff7f0] to-transparent z-10"></div>

        <motion.div
          className="flex gap-20 items-center"
          animate={{ x: [0, -scrollWidth] }}
          transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 20, ease: "linear" } }}
        >
          {displayList.map((partner, index) => (
            <div
              key={`a-${index}`}
              className="flex-shrink-0 text-lg sm:text-xl md:text-2xl font-bold text-[#FA8128] italic whitespace-nowrap cursor-pointer"
            >
              {partner}
            </div>
          ))}
          {displayList.map((partner, index) => (
            <div
              key={`b-${index}`}
              className="flex-shrink-0 text-lg sm:text-xl md:text-2xl font-bold text-[#FA8128] italic whitespace-nowrap cursor-pointer"
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
