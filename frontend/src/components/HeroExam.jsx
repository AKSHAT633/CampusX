import React from "react"
import { motion } from "framer-motion"
import heroImg from "../assets/img1.png" // your illustration

import { FileText, Folder, BarChart3, Download } from "lucide-react"
import { useNavigate } from "react-router-dom"

const features = [
  {
    icon: FileText,
    title: "Exam Notes",
    desc: "High-yield exam-oriented notes with revision points."
  },
  {
    icon: Folder,
    title: "Project Notes",
    desc: "Well-structured content for assignments and projects."
  },
  {
    icon: BarChart3,
    title: "Diagrams",
    desc: "Auto-generated visual diagrams for clarity."
  },
  {
    icon: Download,
    title: "PDF Download",
    desc: "Download clean, printable PDFs instantly."
  }
]

const HeroExam = () => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white">

      {/* SOFT GLOW */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-600/20 blur-[160px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-20">

        {/* TOP CONTENT */}
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Create Smart
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                AI Notes
              </span>{" "}
              in Seconds
            </h1>

            <p className="text-blue-200/90 text-lg mb-8 max-w-lg">
              Generate exam-focused notes, diagrams, and revision-ready PDFs
              using AI — faster, cleaner and smarter.
            </p>

            <motion.button onClick={()=>navigate("/note")}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 font-semibold shadow-lg shadow-blue-500/30"
            >
              Get Started
            </motion.button>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <img
              src={heroImg}
              alt="AI Notes"
              className="w-[420px] md:w-[520px] drop-shadow-[0_20px_60px_rgba(59,130,246,0.35)]"
            />
          </motion.div>
        </div>

        {/* FEATURE CARDS */}
        <div className="grid md:grid-cols-4 gap-6 mt-20">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="group rounded-2xl p-6 bg-gradient-to-b from-white/5 to-white/0 border border-blue-500/20 backdrop-blur-xl shadow-lg hover:shadow-blue-500/20 transition"
              >
                {/* ICON */}
                <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>

                {/* TITLE */}
                <h3 className="font-semibold mb-2 text-white">
                  {f.title}
                </h3>

                {/* DESC */}
                <p className="text-sm text-gray-400 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* INFO SECTION - HOW TO USE, FEATURES, CREDITS */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* HOW TO USE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 backdrop-blur-xl"
          >
            <h3 className="text-blue-300 font-semibold mb-3 text-lg flex items-center gap-2">
              <span className="text-xl">📝</span> How to Use
            </h3>
            <ul className="text-blue-200/80 text-sm space-y-2 leading-relaxed">
              <li>✓ Enter your topic or subject</li>
              <li>✓ Select your class level & exam type</li>
              <li>✓ Choose optional diagrams or charts</li>
              <li>✓ Click generate & get AI notes instantly</li>
              <li>✓ Download as PDF or copy to clipboard</li>
            </ul>
          </motion.div>

          {/* FEATURES & BENEFITS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-xl"
          >
            <h3 className="text-purple-300 font-semibold mb-3 text-lg flex items-center gap-2">
              <span className="text-xl">✨</span> Features
            </h3>
            <ul className="text-purple-200/80 text-sm space-y-2 leading-relaxed">
              <li>✓ AI-powered content generation</li>
              <li>✓ Multiple exam types (JEE, NEET, Boards)</li>
              <li>✓ Revision mode for quick summaries</li>
              <li>✓ Auto-generated diagrams & charts</li>
              <li>✓ Markdown formatted & print-ready</li>
            </ul>
          </motion.div>

          {/* CREDITS SYSTEM */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 backdrop-blur-xl"
          >
            <h3 className="text-cyan-300 font-semibold mb-3 text-lg flex items-center gap-2">
              <span className="text-xl">💎</span> Credits System
            </h3>
            <div className="text-cyan-200/80 text-sm space-y-2">
              <p className="leading-relaxed">
                <span className="font-bold text-cyan-300">10 Credits</span> = 1 Note Generation
              </p>
              <div className="bg-cyan-500/10 rounded p-3 border border-cyan-500/20">
                <p className="text-xs text-cyan-300 font-semibold mb-1">Example:</p>
                <p>Generate 10 notes = 100 credits</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-3 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 transition text-sm font-medium"
              onClick={()=>navigate("/pricing")} >
                💳 Buy Credits
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* PRO TIPS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 rounded-lg bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border border-blue-500/20 backdrop-blur-xl"
        >
          <h3 className="text-blue-300 font-semibold mb-4 text-lg flex items-center gap-2">
            <span className="text-xl">💡</span> Pro Tips for Better Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-3 p-3 rounded-lg bg-white/5">
              <span className="text-cyan-400 font-bold">1.</span>
              <p className="text-blue-200/80 text-sm">Be specific with topics - "Photosynthesis Process in Plants" works better than just "Plants"</p>
            </div>
            <div className="flex gap-3 p-3 rounded-lg bg-white/5">
              <span className="text-cyan-400 font-bold">2.</span>
              <p className="text-blue-200/80 text-sm">Use Revision Mode for quick summaries before exams</p>
            </div>
            <div className="flex gap-3 p-3 rounded-lg bg-white/5">
              <span className="text-cyan-400 font-bold">3.</span>
              <p className="text-blue-200/80 text-sm">Enable Diagrams & Charts for better visual understanding</p>
            </div>
            <div className="flex gap-3 p-3 rounded-lg bg-white/5">
              <span className="text-cyan-400 font-bold">4.</span>
              <p className="text-blue-200/80 text-sm">Save all generated notes for future reference and revision</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default HeroExam
