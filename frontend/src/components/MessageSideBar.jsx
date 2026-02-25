import React, { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Users, Search } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

/* ================= DUMMY DATA ================= */
const currentUser = { _id: "u1", name: "Pranshu" }

const onlineUsers = [
  { _id: "u2", name: "Aman", ProfileImage: "" },
  { _id: "u3", name: "Riya", ProfileImage: "" },
  { _id: "u4", name: "Karan", ProfileImage: "" },
  { _id: "u5", name: "Neha", ProfileImage: "" },
  { _id: "u6", name: "Rohit", ProfileImage: "" },
]

const conversations = [
  {
    _id: "c1",
    participants: [
      { _id: "u1", name: "Pranshu" },
      { _id: "u2", name: "Aman" },
    ],
    last: "Hey bro 👋",
  },
  {
    _id: "c2",
    participants: [
      { _id: "u1", name: "Pranshu" },
      { _id: "u3", name: "Riya" },
    ],
    last: "Notes bhejna",
  },
  {
    _id: "c3",
    participants: [
      { _id: "u1", name: "Pranshu" },
      { _id: "u5", name: "Neha" },
    ],
    last: "Thank you 😊",
  },
]

/* ================= COMPONENT ================= */
const MessageSideBar = () => {
  const { isDark } = useTheme()
  const [search, setSearch] = useState("")

  /* remove self */
  const filteredOnlineUsers = useMemo(
    () => onlineUsers.filter((u) => u._id !== currentUser._id),
    []
  )

  /* search filter */
  const filteredConversations = useMemo(() => {
    return conversations.filter((chat) => {
      const other =
        chat.participants.find((p) => p._id !== currentUser._id) || {}
      return other.name.toLowerCase().includes(search.toLowerCase())
    })
  }, [search])

  return (
    <div
      className={`h-screen w-full md:w-80 flex flex-col border-r shadow-lg ${
        isDark
          ? "bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 border-blue-500/20 shadow-black/30"
          : "bg-white border-blue-200 shadow-blue-100"
      }`}
    >
      {/* HEADER */}
      <div
        className={`px-5 py-4 border-b flex items-center gap-2 ${
          isDark ? "border-blue-500/20" : "border-blue-200"
        }`}
      >
        <Users className="w-5 h-5 text-blue-500" />
        <h2
          className={`font-semibold ${
            isDark ? "text-blue-300" : "text-blue-700"
          }`}
        >
          Messages
        </h2>
      </div>

      {/* SEARCH */}
      <div
        className={`px-3 py-3 border-b ${
          isDark ? "border-blue-500/20" : "border-blue-200"
        }`}
      >
        <div className="relative">
          <Search className="w-4 h-4 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search user..."
            className={`w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none ${
              isDark
                ? "bg-slate-900/70 border border-blue-500/20 text-blue-100"
                : "bg-blue-50 border border-blue-200 text-blue-900"
            }`}
          />
        </div>
      </div>

      {/* ONLINE USERS */}
      <div
        className={`px-3 py-3 border-b ${
          isDark ? "border-blue-500/20" : "border-blue-200"
        }`}
      >
        <p
          className={`text-xs mb-2 ${
            isDark ? "text-green-400/90" : "text-green-600"
          }`}
        >
          Online
        </p>

        <div className="flex gap-3 overflow-x-auto pb-1">
          {filteredOnlineUsers.map((user) => (
            <div
              key={user._id}
              className="flex flex-col items-center min-w-[60px] cursor-pointer"
            >
              <div className="relative">
                {user.ProfileImage ? (
                  <img
                    src={user.ProfileImage}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white dark:border-slate-950 rounded-full" />
              </div>

              <p
                className={`text-xs mt-1 truncate max-w-[60px] text-center ${
                  isDark ? "text-blue-200" : "text-blue-800"
                }`}
              >
                {user.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CONVERSATIONS */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredConversations.map((chat) => {
          const otherUser =
            chat.participants.find((p) => p._id !== currentUser._id) || {}

          const isOnline = filteredOnlineUsers.some(
            (u) => u._id === otherUser._id
          )

          return (
            <motion.div
              key={chat._id}
              whileHover={{ scale: 1.02 }}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                isDark
                  ? "bg-white/5 border border-blue-500/20 hover:bg-blue-500/10"
                  : "bg-blue-50 border border-blue-200 hover:bg-blue-100"
              }`}
            >
              {/* AVATAR */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                  {otherUser.name.charAt(0)}
                </div>

                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white dark:border-slate-950 rounded-full" />
                )}
              </div>

              {/* INFO */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate ${
                    isDark ? "text-blue-100" : "text-blue-900"
                  }`}
                >
                  {otherUser.name}
                </p>
                <p
                  className={`text-xs truncate ${
                    isDark ? "text-blue-300/70" : "text-blue-700/70"
                  }`}
                >
                  {chat.last}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default MessageSideBar