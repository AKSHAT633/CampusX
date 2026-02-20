import React from "react"
import { motion } from "framer-motion"
import { SearchCheck, BookOpen, MessageCircle, Brain } from "lucide-react"

const features = [
  {
    title: "Smart Lost & Found",
    desc: "Report lost items and get intelligent matches with found items using AI-powered recognition.",
    icon: SearchCheck
  },
  {
    title: "Book Marketplace",
    desc: "Buy and sell textbooks with verified sellers. Find deals on your course materials.",
    icon: BookOpen
  },
  {
    title: "Real-Time Chat",
    desc: "Connect instantly with other students for item exchanges and academic discussions.",
    icon: MessageCircle
  },
  {
    title: "AI-powered Learning",
    desc: "Personalized study suggestions, topic summaries and smart note generation to help you learn faster.",
    icon: Brain
  }
]

const WhyChooseCampusSync = () => {
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
          <span className="text-white">Why Choose </span>
          <span className="bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            CampusSync
          </span>
          <span className="text-white">?</span>
        </h2>

        <p className="relative text-blue-200/90 text-lg leading-relaxed">
          Powerful features designed specifically for students to make campus life
          easier and more connected.
        </p>

        <div className="mt-8 flex justify-center">
          <div className="h-[2px] w-28 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full" />
        </div>
      </motion.div>

      {/* FEATURES GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f, i) => {
          const Icon = f.icon

          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/40 via-indigo-500/20 to-transparent"
            >
              {/* CARD */}
              <div className="h-full rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-blue-500/10 p-6 relative overflow-hidden">

                {/* HOVER GLOW */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-transparent" />

                {/* ICON */}
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/40">
                  <Icon className="text-white" size={22} />
                </div>

                {/* TITLE */}
                <h3 className="text-lg font-semibold text-white mb-2">
                  {f.title}
                </h3>

                {/* DESC */}
                <p className="text-gray-300/90 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

export default WhyChooseCampusSync
