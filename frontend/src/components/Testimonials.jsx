import React from "react"
import { motion } from "framer-motion"

const testimonials = [
  {
    name: "Aisha R.",
    role: "2nd Year, CS",
    quote:
      "Found my lost laptop within hours — the matching feature is incredible!",
    initial: "A"
  },
  {
    name: "Rohit K.",
    role: "4th Year, Chemistry",
    quote:
      "Sold my old textbooks quickly and safely through CampusSync.",
    initial: "R"
  },
  {
    name: "Meera S.",
    role: "1st Year, Arts",
    quote:
      "The chat feature made coordinating pickup so smooth. Highly recommend.",
    initial: "M"
  }
]

const Testimonials = () => {
  return (
    <section className="py-28 px-6 max-w-7xl mx-auto">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative text-center max-w-3xl mx-auto mb-20"
      >
        {/* GLOW */}
        <div className="absolute inset-0 flex justify-center">
          <div className="w-96 h-96 bg-blue-500/20 blur-[140px] rounded-full" />
        </div>

        <h2 className="relative text-4xl md:text-5xl font-bold mb-6">
          <span className="text-white">What Students </span>
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Say
          </span>
        </h2>

        <p className="relative text-gray-200 text-lg">
          Real students, real recoveries — CampusSync makes campus life easier.
        </p>
      </motion.div>

      {/* CARDS */}
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/40 via-indigo-500/20 to-transparent"
          >
            {/* CARD */}
            <div className="h-full rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-blue-500/10 p-6 relative overflow-hidden">

              {/* HOVER GLOW */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-transparent" />

              {/* AVATAR */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold mb-4 shadow-lg shadow-blue-500/40">
                {t.initial}
              </div>

              {/* QUOTE */}
              <p className="text-gray-200 text-sm leading-relaxed mb-4">
                “{t.quote}”
              </p>

              {/* NAME */}
              <div className="text-white font-semibold">
                {t.name}
              </div>

              {/* ROLE */}
              <div className="text-blue-300 text-xs">
                {t.role}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default Testimonials
