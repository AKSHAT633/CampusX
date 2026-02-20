import React from "react"
import { motion } from "framer-motion"
import { Upload, BellRing, MessageCircle, Brain } from "lucide-react"

const steps = [
  {
    title: "Post Item or Resource",
    desc: "Upload lost/found items, books for sale, or study materials using our simple and intuitive interface.",
    icon: Upload,
    gradient: "from-blue-500 to-cyan-400",
    glow: "bg-blue-500/20",
    border: "border-blue-500/40",
    iconColor: "text-blue-300"
  },
  {
    title: "Get Smart Matches",
    desc: "Our AI analyzes images and details to match lost items, suggest books, and organize study content.",
    icon: BellRing,
    gradient: "from-indigo-500 to-blue-400",
    glow: "bg-indigo-500/20",
    border: "border-indigo-500/40",
    iconColor: "text-indigo-300"
  },
  {
    title: "Chat & Exchange",
    desc: "Connect securely with students to recover items, buy books, or collaborate through real-time chat.",
    icon: MessageCircle,
    gradient: "from-purple-500 to-indigo-400",
    glow: "bg-purple-500/20",
    border: "border-purple-500/40",
    iconColor: "text-purple-300"
  },
  {
    title: "AI Study Notes",
    desc: "Generate smart notes, summaries, and personalized study suggestions to learn faster and stay organized.",
    icon: Brain,
    gradient: "from-pink-500 to-purple-400",
    glow: "bg-pink-500/20",
    border: "border-pink-500/40",
    iconColor: "text-pink-300"
  }
]

const HowItWorks = () => {
  return (
    <section className="py-28 px-6 max-w-7xl mx-auto">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative text-center max-w-3xl mx-auto mb-20"
      >
        <div className="absolute inset-0 flex justify-center">
          <div className="w-96 h-96 bg-blue-500/20 blur-[140px] rounded-full" />
        </div>

        <h2 className="relative text-4xl md:text-5xl font-bold mb-6">
          <span className="text-white">How It </span>
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Works
          </span>
        </h2>

        <p className="relative text-gray-200 text-lg">
          Simple steps to recover lost items, trade books, and enhance learning with AI.
        </p>
      </motion.div>

      {/* STEPS */}
      <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* CONNECTING LINE */}
        <div className="hidden lg:block absolute top-10 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-pink-500/40" />

        {steps.map((step, i) => {
          const Icon = step.icon

          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="relative text-center group"
            >
              {/* NUMBER */}
              <div className="mx-auto mb-6 relative">
                <div
                  className={`w-14 h-14 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                >
                  {i + 1}
                </div>

                {/* ICON BADGE */}
                <div
                  className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-slate-950 border ${step.border} flex items-center justify-center`}
                >
                  <Icon size={16} className={step.iconColor} />
                </div>
              </div>

              {/* TITLE */}
              <h3 className="text-xl font-semibold text-white mb-3">
                {step.title}
              </h3>

              {/* DESC */}
              <p className="text-gray-300 text-sm leading-relaxed max-w-xs mx-auto">
                {step.desc}
              </p>

              {/* HOVER GLOW */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 ${step.glow} blur-2xl rounded-full`}
              />
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

export default HowItWorks
