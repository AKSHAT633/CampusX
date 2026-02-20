import React, { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import {
  MapPin,
  CalendarDays,
  Tag,
  Mail,
  MessageCircle,
  User,
  ArrowLeft,
  Clock,
  BadgeCheck,
  FileSearch,
} from "lucide-react"
import { fetchItems } from "../servers/api"

const ItemDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { itemData } = useSelector((state) => state.item)
  const { userData } = useSelector((state) => state.user)
  
  useEffect(() => {
    if (!itemData || itemData.length === 0) {
      fetchItems(dispatch)
    }
  }, [dispatch, itemData])

  /* ---------- FIND CURRENT ITEM ---------- */
  const item = itemData.find((i) => i._id === id)
  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto text-blue-300/70">Loading item...</div>
      </div>
    )
  }

  // Check if current user is the poster
  const isOwnItem = userData?._id === item.postedBy?._id

  /* ---------- RELATED (same category) ---------- */
  const related = itemData
    .filter((i) => i.category === item.category && i._id !== id)
    .slice(0, 4)

  /* ---------- EMAIL ---------- */
  const handleEmail = () => {
    const subject = `Regarding your ${item.type} item: ${item.title}`
    const body = `Hello ${item.postedBy?.name},

I believe this item may belong to me.

Item: ${item.title}
Location: ${item.location}

Please let me know how we can connect.

Thank you.`

    window.location.href = `mailto:${item.postedBy?.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`
  }

  /* ---------- MESSAGE ---------- */
  const handleMessage = () => {
    navigate(`/chat/${item.postedBy?._id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* GRID */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="rounded-2xl overflow-hidden border border-blue-500/20 bg-white/5">
              {item.images?.[0] ? (
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="h-96 flex items-center justify-center text-blue-300/40">
                  No Image
                </div>
              )}
            </div>
          </motion.div>

          {/* DETAILS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* TYPE */}
            <span
              className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                item.type === "lost"
                  ? "bg-red-500"
                  : "bg-green-500"
              }`}
            >
              {item.type?.toUpperCase()}
            </span>

            {/* TITLE */}
            <h1 className="text-3xl font-bold">{item.title}</h1>

            {/* META */}
            <div className="grid sm:grid-cols-2 gap-3 text-sm text-blue-200/80">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{item.location}</span>
              </span>

              <span className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                <span>Lost/Found: {new Date(item.date).toLocaleDateString()}</span>
              </span>

              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Posted: {new Date(item.createdAt).toLocaleDateString()}</span>
              </span>

              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>Category: {item.category}</span>
              </span>

              <span className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4" />
                <span>Status: {item.status}</span>
              </span>
            </div>

            {/* DESCRIPTION */}
            <p className="text-blue-100/90 leading-relaxed">
              {item.description}
            </p>

            {/* USER */}
            <div className="rounded-xl bg-white/5 border border-blue-500/20 p-4 flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-500/20">
                <User className="w-5 h-5 text-blue-300" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold">
                  {item.postedBy?.name || "User"}
                </p>
                <p className="text-xs text-blue-300/70">Posted this item</p>
                {item.postedBy?.email && (
                  <p className="text-xs text-blue-200/80">{item.postedBy.email}</p>
                )}
              </div>
            </div>

            {/* CONTACT */}
            {!isOwnItem && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Contact & Actions</h3>

                <div className="flex flex-wrap gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEmail}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 shadow"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleMessage}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 shadow"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/claim-item/${item._id}`)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 shadow"
                  >
                    <FileSearch className="w-4 h-4" />
                    Claim This Item
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* RELATED */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-6">
              Related Items
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((r) => (
                <motion.div
                  key={r._id}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/item/${r._id}`)}
                  className="cursor-pointer rounded-xl border border-blue-500/20 bg-white/5 overflow-hidden"
                >
                  <div className="h-40 bg-slate-800">
                    {r.images?.[0] && (
                      <img
                        src={r.images[0]}
                        alt={r.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="p-3">
                    <p className="font-semibold truncate">
                      {r.title}
                    </p>
                    <p className="text-xs text-blue-300/70">
                      {r.location}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ItemDetailPage
