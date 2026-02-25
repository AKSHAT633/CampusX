import React, { useState } from "react"
import { useTheme } from "../context/ThemeContext"
import { Send, Paperclip } from "lucide-react"
import { motion } from "framer-motion"

const ChatMessageInput = ({ onSend }) => {
  const { isDark } = useTheme()
  const [message, setMessage] = useState("")

  const handleSend = () => {
    if (!message.trim()) return
    onSend?.(message)
    setMessage("")
  }

  return (
    <div
      className={`w-full px-3 py-2 border-t ${
        isDark
          ? "bg-slate-950 border-blue-500/20"
          : "bg-white border-blue-200"
      }`}
    >
      <div
        className={`flex items-center gap-2 rounded-xl px-3 py-2 ${
          isDark
            ? "bg-white/5 border border-blue-500/20"
            : "bg-blue-50 border border-blue-200"
        }`}
      >
        {/* ATTACH */}
        <button
          className={`p-2 rounded-lg transition ${
            isDark
              ? "hover:bg-blue-500/10 text-blue-300"
              : "hover:bg-blue-100 text-blue-600"
          }`}
        >
          <Paperclip size={18} />
        </button>

        {/* INPUT */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className={`flex-1 bg-transparent outline-none text-sm ${
            isDark ? "text-blue-100 placeholder-blue-300/50" : "text-gray-800"
          }`}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        {/* SEND */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow"
        >
          <Send size={18} />
        </motion.button>
      </div>
    </div>
  )
}

export default ChatMessageInput