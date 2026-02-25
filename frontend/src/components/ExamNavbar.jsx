import React, { useState, useRef, useEffect } from "react"
import logo from "../assets/Ailogo.png"
import { Diamond, Plus, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"

const ExamNavbar = () => {
  const { isDark } = useTheme()
  const { userData } = useSelector((state) => state.user)

  const [open, setOpen] = useState(false)
  const popupRef = useRef(null)
  const navigate = useNavigate()

  /* ---------- CLOSE OUTSIDE ---------- */
  useEffect(() => {
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  /* ---------- THEME ---------- */
  const navBg = isDark
    ? "bg-slate-950 border-blue-500/20"
    : "bg-white border-slate-200"

  const titleMain = isDark ? "text-white" : "text-slate-800"
  const creditsText = isDark ? "text-blue-300" : "text-slate-700"
  const divider = isDark ? "bg-blue-500/30" : "bg-slate-300"

  const popupBg = isDark
    ? "bg-slate-900 border-blue-500/20 text-white"
    : "bg-white border-slate-200 text-slate-800"

  const popupSub = isDark ? "text-gray-400" : "text-slate-500"

  return (
    <header
      className={`relative w-full h-16 px-6 flex items-center justify-end border-b ${navBg}`}
    >
      <div className="flex items-center gap-6">
        {/* LOGO + NAME */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <img src={logo} alt="ExamNote AI" className="w-9 h-9 object-contain" />
          <h1 className="text-lg md:text-xl font-semibold leading-none">
            <span className={titleMain}>ExamNote</span>
            <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 bg-clip-text text-transparent">
              {" "}AI
            </span>
          </h1>
        </div>

        {/* DIVIDER */}
        <div className={`h-6 w-px ${divider}`} />

        {/* CREDITS */}
        <div className="relative flex items-center gap-2">
          {/* DIAMOND */}
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <Diamond className="w-5 h-5 text-cyan-500" />
          </motion.div>

          {/* NUMBER */}
          <span className={`font-semibold text-sm ${creditsText}`}>
            {userData?.credits}
            <span className={titleMain}> credits</span>
          </span>

          {/* PLUS */}
          <motion.button
            whileHover={{ rotate: 90 }}
            onClick={() => setOpen((p) => !p)}
            className="ml-1"
          >
            <Plus className="w-4 h-4 text-blue-500" />
          </motion.button>

          {/* POPUP */}
          <AnimatePresence>
            {open && (
              <motion.div
                ref={popupRef}
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className={`absolute right-0 top-10 w-72 rounded-xl shadow-xl p-5 z-50 border ${popupBg}`}
              >
                {/* CLOSE */}
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-3 right-3 opacity-60 hover:opacity-100"
                >
                  <X size={16} />
                </button>

                {/* TITLE */}
                <h3 className="font-semibold mb-2">Buy Credits</h3>

                {/* DESC */}
                <p className={`text-sm mb-4 ${popupSub}`}>
                  Use credits to generate AI notes, diagrams & PDFs.
                </p>

                {/* BUTTON */}
                <button
                  onClick={() => navigate("/pricing")}
                  className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:scale-105 transition"
                >
                  Buy More Credits
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

export default ExamNavbar