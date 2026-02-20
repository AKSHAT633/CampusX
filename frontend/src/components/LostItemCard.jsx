import React from "react"
import { motion } from "framer-motion"
import { MapPin, Clock } from "lucide-react"

const LostItemCard = ({ item }) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="rounded-2xl overflow-hidden bg-slate-950/80 border border-blue-500/20 backdrop-blur-xl shadow-lg hover:shadow-blue-500/10 transition"
    >
      {/* IMAGE */}
      <div className="h-44 w-full overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover hover:scale-105 transition duration-500"
        />
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2">
          {item.title}
        </h3>

        <div className="flex items-center text-gray-300 text-sm gap-2 mb-1">
          <MapPin size={14} className="text-blue-400" />
          {item.location}
        </div>

        <div className="flex items-center text-gray-400 text-xs gap-2">
          <Clock size={14} />
          {item.date}
        </div>

        <button className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium hover:scale-[1.02] transition">
          View Details
        </button>
      </div>
    </motion.div>
  )
}

export default LostItemCard
