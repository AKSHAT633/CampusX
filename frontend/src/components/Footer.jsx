import React from "react"
import { Link } from "react-router-dom"
import { Mail, MapPin, Phone, Instagram, Twitter, Linkedin } from "lucide-react"
import logo from "../assets/logo.png"
import { useTheme } from "../context/ThemeContext"

const Footer = () => {
  const { isDark } = useTheme()

  return (
    <footer
      className={`relative overflow-hidden transition-colors duration-300 ${
        isDark
          ? "border-t border-blue-500/20 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white"
          : "border-t border-slate-200 bg-gradient-to-br from-white via-blue-50 to-white text-slate-900"
      }`}
    >
      {/* GLOW */}
      <div className="absolute inset-0 flex justify-center">
        <div
          className={`w-[500px] h-[500px] blur-[160px] rounded-full ${
            isDark ? "bg-blue-600/20" : "bg-blue-400/15"
          }`}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* GRID */}
        <div className="grid gap-8 sm:gap-10 md:gap-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">

          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img className="w-14 h-14" src={logo} alt="CampusSync" />
              <span
                className={`text-xl font-semibold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Campus<span className="text-blue-500">Sync</span>
              </span>
            </div>

            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-gray-300" : "text-slate-600"
              }`}
            >
              CampusSync helps students recover lost items, trade books,
              and collaborate through AI-powered campus tools.
            </p>
          </div>

          {/* NAV */}
          <FooterCol
            title="Navigation"
            isDark={isDark}
            links={[
              { to: "/", label: "Home" },
              { to: "/lost-found", label: "Lost & Found" },
              { to: "/books", label: "Marketplace" },
              { to: "/chat", label: "Chat" },
            ]}
          />

          {/* FEATURES */}
          <FooterCol
            title="Features"
            isDark={isDark}
            links={[
              { label: "Smart Matching" },
              { label: "Book Trading" },
              { label: "AI Notes" },
              { label: "Real-time Chat" },
            ]}
          />

          {/* CONTACT */}
          <div>
            <h4
              className={`font-semibold mb-4 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Contact
            </h4>

            <ul
              className={`space-y-3 text-sm ${
                isDark ? "text-gray-300" : "text-slate-600"
              }`}
            >
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-blue-500" />
                support@campussync.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-500" />
                Your University Campus
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-blue-500" />
                +91 00000 00000
              </li>
            </ul>

            {/* SOCIAL */}
            <div className="flex gap-3 mt-5">
              <Social icon={<Instagram size={16} />} isDark={isDark} />
              <Social icon={<Twitter size={16} />} isDark={isDark} />
              <Social icon={<Linkedin size={16} />} isDark={isDark} />
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div
          className={`mt-12 h-px ${
            isDark
              ? "bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"
              : "bg-gradient-to-r from-transparent via-slate-300 to-transparent"
          }`}
        />

        {/* BOTTOM */}
        <div
          className={`mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm ${
            isDark ? "text-gray-400" : "text-slate-500"
          }`}
        >
          <div>© {new Date().getFullYear()} CampusSync. All rights reserved.</div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <FooterLink to="/about" label="About" isDark={isDark} />
            <FooterLink to="/privacy" label="Privacy" isDark={isDark} />
            <FooterLink to="/terms" label="Terms" isDark={isDark} />
            <FooterLink to="/contact" label="Contact" isDark={isDark} />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

/* ---------- COLUMN ---------- */
const FooterCol = ({ title, links, isDark }) => (
  <div>
    <h4 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
      {title}
    </h4>

    <ul className="space-y-3 text-sm">
      {links.map((l, i) => (
        <li key={i}>
          {l.to ? (
            <Link
              to={l.to}
              className={`transition ${
                isDark
                  ? "text-gray-300 hover:text-blue-300"
                  : "text-slate-600 hover:text-blue-600"
              }`}
            >
              {l.label}
            </Link>
          ) : (
            <span className={isDark ? "text-gray-300" : "text-slate-600"}>
              {l.label}
            </span>
          )}
        </li>
      ))}
    </ul>
  </div>
)

/* ---------- LINK ---------- */
const FooterLink = ({ to, label, isDark }) => (
  <Link
    to={to}
    className={`transition ${
      isDark
        ? "hover:text-blue-300"
        : "hover:text-blue-600"
    }`}
  >
    {label}
  </Link>
)

/* ---------- SOCIAL ---------- */
const Social = ({ icon, isDark }) => (
  <div
    className={`w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer border ${
      isDark
        ? "bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
        : "bg-white border-slate-200 text-blue-600 hover:bg-blue-50"
    }`}
  >
    {icon}
  </div>
)