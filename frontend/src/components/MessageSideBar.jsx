import React, { useMemo, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, Search, MessageCircle } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { useDispatch, useSelector } from "react-redux"
import { setConversations, setSelectedUser } from "../redux/messageSlice"
import axios from "axios"
import { serverUrl } from "../main"

/* ================= COMPONENT ================= */
const MessageSideBar = () => {
  const { isDark } = useTheme()
  const dispatch = useDispatch()
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  
  const { userData } = useSelector((state) => state.user)
  const { conversations = [], selectedUser, getAllUser = [], onlineUsers = [] } = useSelector((state) => state.message)

  /* ================= FETCH CONVERSATIONS ================= */
  useEffect(() => {
    if (!userData?._id) return
    
    const fetchConversations = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${serverUrl}/api/message/conversations`, {
          withCredentials: true,
        })
        if (res.data?.data) {
          dispatch(setConversations(res.data.data))
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchConversations()
  }, [userData?._id, dispatch])

  /* Show only online users */
  const filteredOnlineUsers = useMemo(
    () => onlineUsers.filter((u) => u !== userData?._id),
    [onlineUsers, userData?._id]
  )

  /* search filter */
  const filteredConversations = useMemo(() => {
    return conversations.filter((chat) => {
      const other = chat.participants.find((p) => p._id !== userData?._id) || {}
      return other.name?.toLowerCase().includes(search.toLowerCase()) || ""
    })
  }, [search, conversations, userData?._id])

  return (
    <div
      className={`h-full rounded-lg w-screen md:w-80 flex  flex-col border-r shadow-lg ${
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
          {filteredOnlineUsers.length > 0 ? (
            filteredOnlineUsers.map((userId) => {
              const user = getAllUser.find((u) => u._id === userId)
              if (!user) return null
              return (
                <motion.div
                  key={userId}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => dispatch(setSelectedUser(user))}
                  className="flex flex-col items-center min-w-[60px] cursor-pointer"
                >
                  <div className="relative">
                    {user.ProfileImage ? (
                      <img
                        src={user.ProfileImage}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-green-400"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold ring-2 ring-green-400">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
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
                </motion.div>
              )
            })
          ) : (
            <p className={`text-xs ${isDark ? "text-blue-300/70" : "text-blue-700/70"}`}>
              No online users
            </p>
          )}
        </div>
      </div>

      {/* CONVERSATIONS */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading ? (
          <div className={`text-center py-8 ${isDark ? "text-blue-300/70" : "text-blue-700/70"}`}>
            <p className="text-sm">Loading conversations...</p>
          </div>
        ) : filteredConversations.length > 0 ? (
          filteredConversations.map((chat) => {
            const otherUser = chat.participants.find((p) => p._id !== userData?._id) || {}
            const isOnline = onlineUsers.includes(otherUser._id)
            const isSelected = selectedUser?._id === otherUser._id

            return (
              <motion.div
                key={chat._id}
                whileHover={{ scale: 1.02 }}
                onClick={() => dispatch(setSelectedUser(otherUser))}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                  isSelected
                    ? isDark
                      ? "bg-blue-500/20 border border-blue-400"
                      : "bg-blue-200 border border-blue-400"
                    : isDark
                    ? "bg-white/5 border border-blue-500/20 hover:bg-blue-500/10"
                    : "bg-blue-50 border border-blue-200 hover:bg-blue-100"
                }`}
              >
                {/* AVATAR */}
                <div className="relative">
                  {otherUser.ProfileImage ? (
                    <img
                      src={otherUser.ProfileImage}
                      alt={otherUser.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                      {otherUser.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}

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
                    {otherUser.name || "Unknown"}
                  </p>
                  <p
                    className={`text-xs truncate ${
                      isDark ? "text-blue-300/70" : "text-blue-700/70"
                    }`}
                  >
                    {chat.lastMessage?.message || chat.last || "No messages yet"}
                  </p>
                </div>

                {/* UNREAD INDICATOR */}
                {chat.unread > 0 && (
                  <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-semibold">
                    {chat.unread}
                  </div>
                )}
              </motion.div>
            )
          })
        ) : (
          <div className={`flex flex-col items-center justify-center py-8 ${isDark ? "text-blue-300/70" : "text-blue-700/70"}`}>
            <MessageCircle className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">No conversations yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageSideBar