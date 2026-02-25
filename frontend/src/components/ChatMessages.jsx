import React from "react"
import { useTheme } from "../context/ThemeContext"

/* -------- DUMMY CURRENT USER -------- */
const currentUserId = "u1"

/* -------- DUMMY MESSAGES -------- */
const dummyMessages = [
  {
    _id: "m1",
    sender: { _id: "u2", name: "Aarav" },
    text: "Hey bro 👋",
    time: "10:20 AM",
  },
  {
    _id: "m2",
    sender: { _id: "u1", name: "You" },
    text: "Haan bhai bolo",
    time: "10:21 AM",
  },
  {
    _id: "m3",
    sender: { _id: "u2", name: "Aarav" },
    text: "Assignment complete ho gaya?",
    time: "10:22 AM",
  },
  {
    _id: "m4",
    sender: { _id: "u1", name: "You" },
    text: "Almost done 👍",
    time: "10:23 AM",
  },
]

/* -------- COMPONENT -------- */
const ChatMessages = () => {
  const { isDark } = useTheme()

  return (
    <div
      className={`flex-1 overflow-y-auto p-4 space-y-3 ${
        isDark
          ? "bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950"
          : "bg-blue-50"
      }`}
    >
      {dummyMessages.map((msg) => {
        const isMe = msg.sender._id === currentUserId

        return (
          <div
            key={msg._id}
            className={`flex items-end gap-2 ${
              isMe ? "justify-end" : "justify-start"
            }`}
          >
            {/* LEFT AVATAR */}
            {!isMe && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm">
                {msg.sender.name.charAt(0)}
              </div>
            )}

            {/* MESSAGE BUBBLE */}
            <div
              className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm shadow ${
                isMe
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-sm"
                  : isDark
                  ? "bg-white/10 text-blue-100 rounded-bl-sm"
                  : "bg-white text-gray-800 rounded-bl-sm"
              }`}
            >
              <p>{msg.text}</p>
              <span
                className={`block text-[10px] mt-1 ${
                  isMe ? "text-white/70" : "text-blue-300/70"
                }`}
              >
                {msg.time}
              </span>
            </div>

            {/* RIGHT AVATAR (ME) */}
            {isMe && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm">
                Y
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ChatMessages