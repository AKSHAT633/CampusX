import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Mail, MapPin, Phone, Instagram, Twitter, Linkedin } from "lucide-react"
import logo from "../assets/logo.png"
const Footer = () => {
  return (
    <footer className="relative border-t border-blue-500/20 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden">

      {/* GLOW BACKGROUND */}
      <div className="absolute inset-0 flex justify-center">
        <div className="w-[500px] h-[500px] bg-blue-600/20 blur-[160px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">

        {/* TOP GRID */}
        <div className="grid md:grid-cols-4 gap-12">

          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              
                <img className="w-14 h-14" src={logo} alt="" />
              
              <span className="text-xl font-semibold text-white">
                Campus<span className="text-blue-400">Sync</span>
              </span>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed">
              CampusSync helps students recover lost items, trade books,
              and collaborate through AI-powered campus tools.
            </p>
          </div>

          {/* NAVIGATION */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="text-gray-300 hover:text-blue-300">Home</Link></li>
              <li><Link to="/lost-found" className="text-gray-300 hover:text-blue-300">Lost & Found</Link></li>
              <li><Link to="/books" className="text-gray-300 hover:text-blue-300">Marketplace</Link></li>
              <li><Link to="/chat" className="text-gray-300 hover:text-blue-300">Chat</Link></li>
            </ul>
          </div>

          {/* FEATURES */}
          <div>
            <h4 className="text-white font-semibold mb-4">Features</h4>
            <ul className="space-y-3 text-sm">
              <li className="text-gray-300">Smart Matching</li>
              <li className="text-gray-300">Book Trading</li>
              <li className="text-gray-300">AI Notes</li>
              <li className="text-gray-300">Real-time Chat</li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-blue-400" />
                support@campussync.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-400" />
                Your University Campus
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-blue-400" />
                +91 00000 00000
              </li>
            </ul>

            {/* SOCIAL */}
            <div className="flex gap-3 mt-5">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 cursor-pointer">
                <Instagram size={16} />
              </div>
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 cursor-pointer">
                <Twitter size={16} />
              </div>
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 cursor-pointer">
                <Linkedin size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mt-12 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

        {/* BOTTOM */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div>
            © {new Date().getFullYear()} CampusSync. All rights reserved.
          </div>

          <div className="flex gap-6">
            <Link to="/about" className="hover:text-blue-300">About</Link>
            <Link to="/about" className="hover:text-blue-300">Privacy</Link>
            <Link to="/about" className="hover:text-blue-300">Terms</Link>
            <Link to="/contact" className="hover:text-blue-300">Contact</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
