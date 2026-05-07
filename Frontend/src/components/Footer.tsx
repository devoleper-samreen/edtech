import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "All Courses", to: "/courses" },
  { label: "Summer Internship", to: "/summer-internship" },
  { label: "CRT Program", to: "/crt-program" },
  { label: "Hire From Us", to: "/hire-from-us" },
  { label: "Contact Us", to: "/contact-us" },
];

function Footer() {
  return (
    <motion.footer
      className="w-full bg-[#0f172a]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Main Footer Content */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* Column 1 - Brand */}
          <div className="lg:col-span-1">
            <div className="mb-3">
              <Link to="/">
                <span className="text-2xl font-bold text-white">Tech<span className="text-[#FA8128]">Fox</span></span>
                <p className="text-gray-500 text-xs mt-0.5 tracking-widest">— Skill Up, Build Smart —</p>
              </Link>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Empowering students with industry-ready skills through expert-led training and real-world project experience.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a href="https://www.linkedin.com/company/techfox-edu" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#0077B5] hover:opacity-80 flex items-center justify-center text-white transition-all">
                <LinkedinIcon />
              </a>
              <a href="https://www.instagram.com/techfox.co?utm_source=qr&igsh=d2tib2w3bWhzOHVs" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-all"
                style={{ background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" }}>
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => window.scrollTo(0, 0)}
                    className="text-gray-400 hover:text-[#FA8128] text-sm transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#FA8128] flex-shrink-0"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-[#FA8128] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm leading-relaxed">
                  13th Main, 17th Cross, 5th Phase,<br />JP Nagar, Bangalore – 560078
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} className="text-[#FA8128] flex-shrink-0" />
                <a href="tel:+917349141410" className="text-gray-400 hover:text-[#FA8128] text-sm transition-colors">
                  +91 7349141410
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="text-[#FA8128] flex-shrink-0" />
                <a href="mailto:team@techfox.co" className="text-gray-400 hover:text-[#FA8128] text-sm transition-colors">
                  team@techfox.co
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - WhatsApp & Mascot */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Stay Connected</h3>
              <p className="text-gray-400 text-sm mb-4">
                Join our WhatsApp channel for latest updates, course announcements and placement news.
              </p>
              <a
                href="https://whatsapp.com/channel/0029VbCtbVdGehEEw7HjDY2L"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                <MessageCircle size={16} />
                Join WhatsApp Channel
              </a>
            </div>

            {/* Mascot */}
            <div className="hidden lg:flex justify-end mt-4">
              <img
                src="/techfox_transparent2.png"
                alt="TechFox Mascot"
                className="h-20 w-auto object-contain opacity-60"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-xs text-center sm:text-left">
            © 2026 TechFox. All Rights Reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Skill Up, Build Smart.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
