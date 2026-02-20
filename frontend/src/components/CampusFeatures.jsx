import React from "react"
import { motion } from "framer-motion"
import { MapPin, BookOpen, Brain } from "lucide-react"
import { Link } from "react-router-dom"

const features = [
  {
    title: "Report Lost Item",
    desc: "Quickly report lost belongings and reconnect them with their rightful owners across campus.",
    icon: MapPin,
    link: "/lost-found"
  },
  {
    title: "Browse Books & Items",
    desc: "Explore books, gadgets, and daily-use items shared by fellow students in your campus marketplace.",
    icon: BookOpen,
    link: "/books"
  },
  {
    title: "AI Study · Take Notes",
    desc: "Create intelligent notes, organize study material, and enhance learning with AI-powered tools.",
    icon: Brain,
    link: "/notes"
  }
]

const CampusFeatures = () => {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">

      {/* HEADER */}
  <motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
  className="relative text-center max-w-3xl mx-auto mb-20"
>
  {/* BACKGROUND GLOW */}
  <div className="absolute inset-0 flex justify-center">
    <div className="w-80 h-80 bg-blue-500/20 blur-[120px] rounded-full" />
  </div>

  {/* TITLE */}
  <h2 className="relative text-4xl md:text-5xl font-bold mb-6">
    <span className="text-white">Campus</span>
    <span className="bg-gradient-to-r from-blue-800 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
      Sync
    </span>
  </h2>

  {/* DESC */}
  <p className="relative text-blue-200/90 text-lg leading-relaxed max-w-2xl mx-auto">
    Find lost items, sell books, and connect with students in real time.
    Your campus utility platform for seamless academic life.
  </p>

  {/* ACCENT LINE */}
  <div className="mt-8 flex justify-center">
    <div className="h-[2px] w-28 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full" />
  </div>
</motion.div>


      {/* CARDS */}
      <div className="grid md:grid-cols-3 gap-10">
        {features.map((f, i) => {
          const Icon = f.icon

          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.03 }}
              className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/40 via-indigo-500/20 to-transparent"
            >
              {/* CARD INNER */}
              <div className="h-full rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-blue-500/10 p-8 relative overflow-hidden">

                {/* GLOW EFFECT */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-transparent" />

                {/* ICON */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/40 group-hover:shadow-blue-500/60 transition">
                  <Icon className="text-white" size={26} />
                </div>

                {/* TITLE */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {f.title}
                </h3>

                {/* DESC */}
                <p className="text-gray-300/90 mb-6 leading-relaxed">
                  {f.desc}
                </p>

                {/* CTA */}
                <Link
                  to={f.link}
                  className="inline-flex items-center gap-2 text-blue-400 font-medium group-hover:text-blue-300 transition"
                >
                  Explore
                  <span className="group-hover:translate-x-1 transition">→</span>
                </Link>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

export default CampusFeatures
