import React from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send } from "lucide-react"

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "support@campussync.com"
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+91 98765 43210"
  },
  {
    icon: MapPin,
    title: "Location",
    value: "Your Campus, India"
  }
]

const Contact = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white overflow-hidden">

      {/* GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-600/20 blur-[160px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6 py-24">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Contact{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Us
            </span>
          </h2>

          <p className="text-blue-200/90">
            Have questions, feedback, or need help? We’d love to hear from you.
            Reach out anytime.
          </p>
        </motion.div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* LEFT — INFO */}
          <div className="space-y-6">
            {contactInfo.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center gap-4 p-5 rounded-xl bg-white/5 border border-blue-500/20 backdrop-blur-xl"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border border-blue-500/20">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">{item.title}</p>
                    <p className="font-medium text-white">{item.value}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* RIGHT — FORM */}
          <motion.form
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-5 p-8 rounded-2xl bg-white/5 border border-blue-500/20 backdrop-blur-xl shadow-lg"
          >
            <div>
              <label className="text-sm text-gray-400">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full mt-1 px-4 py-3 rounded-lg bg-slate-900/70 border border-blue-500/20 outline-none focus:border-blue-400 text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full mt-1 px-4 py-3 rounded-lg bg-slate-900/70 border border-blue-500/20 outline-none focus:border-blue-400 text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Message</label>
              <textarea
                rows="4"
                placeholder="Write your message..."
                className="w-full mt-1 px-4 py-3 rounded-lg bg-slate-900/70 border border-blue-500/20 outline-none focus:border-blue-400 text-white resize-none"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 font-semibold shadow-lg shadow-blue-500/30"
            >
              <Send className="w-4 h-4" />
              Send Message
            </motion.button>
          </motion.form>

        </div>
      </div>
    </section>
  )
}

export default Contact
