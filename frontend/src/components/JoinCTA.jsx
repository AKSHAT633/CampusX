import React from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

const JoinCTA = () => {
  return (
    <section className="relative py-32 px-6 overflow-hidden">

      {/* BACKGROUND GRADIENT */}
      <div className="absolute inset-0" />

      {/* GLOW BLOBS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[160px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/20 blur-[160px] rounded-full" />

      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative max-w-4xl mx-auto text-center"
      >
        {/* GLASS CARD */}
        <div className="relative p-[1px] rounded-3xl bg-gradient-to-br from-blue-500/40 via-indigo-500/30 to-transparent">
          <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-blue-500/20 px-10 py-16">

            {/* TITLE */}
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Built for Students, </span>
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Powered by Technology
              </span>
            </h2>

            {/* SUBTEXT */}
            <p className="text-gray-200 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Join thousands of students who are already using CampusSync to
              make their campus life better. Start your journey today!
            </p>

            {/* BUTTON */}
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-8 py-4 rounded-xl text-white font-semibold text-lg bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 overflow-hidden"
              >
                <span className="relative z-10">
                  Join CampusSync Today
                </span>

                {/* BUTTON GLOW */}
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400/40 to-indigo-500/40 opacity-0 hover:opacity-100 transition duration-300 blur-xl" />
              </motion.button>
            </Link>

          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default JoinCTA
