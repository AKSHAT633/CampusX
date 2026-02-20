import React, { useEffect, useState } from "react"
import axios from "axios"
import { serverUrl } from "../main"
import { motion } from "framer-motion"
import { MapPin, CalendarDays, User, CheckCircle } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchItems } from "../servers/api"

const LostAndFound = () => {
  const { userData } = useSelector((state) => state.user)
  const { itemData } = useSelector((state) => state.item)
  const dispatch = useDispatch()
  const navigate = useNavigate()

 
  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")

  /* FETCH ITEMS */
  

  useEffect(() => {
    fetchItems(dispatch)
  }, [dispatch])

  /* FILTER */
  const filteredItems = itemData.filter((item) => {
    if (filterType !== "all" && item.type !== filterType) return false
    if (filterCategory !== "all" && item.category !== filterCategory)
      return false
    return true
  })

  /* CLAIM */
  const handleClaim = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/claim-item/${id}`)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-blue-950 to-slate-950 text-white p-6">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Campus <span className="text-blue-400">Lost & Found</span>
          </h1>
          <p className="text-blue-200/80">
            Browse lost and found items across campus
          </p>
        </div>
        <button
          onClick={() => navigate("/lost-found/add")}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium shadow"
        >
          + Add Lost/Found Item
        </button>
      </div>

      {/* FILTERS */}
      <div className="max-w-7xl mx-auto flex flex-wrap gap-3 mb-8">
        {/* TYPE */}
        {["all", "lost", "found"].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-4 py-1.5 rounded-lg border text-sm transition ${
              filterType === t
                ? "bg-blue-500/20 border-blue-400 text-blue-300"
                : "border-blue-500/20 text-blue-200 hover:bg-white/5"
            }`}
          >
            {t === "all" ? "All" : t.toUpperCase()}
          </button>
        ))}

        {/* CATEGORY */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-blue-500/20 text-blue-200"
        >
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="books">Books</option>
          <option value="clothing">Clothing</option>
          <option value="documents">Documents</option>
          <option value="keys">Keys</option>
          <option value="wallet">Wallet</option>
          <option value="bag">Bag</option>
          <option value="mobile">Mobile</option>
          <option value="laptop">Laptop</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* ITEMS GRID */}
      <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item, i) => {
          const isOwner = item.postedBy?._id === userData?._id

          return (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/item/${item._id}`)}
              className="relative rounded-2xl overflow-hidden border border-blue-500/20 bg-linear-to-br from-white/5 to-white/0 backdrop-blur-xl shadow-xl cursor-pointer"
            >
              {/* IMAGE */}
              <div className="h-48 bg-slate-900 overflow-hidden">
                {item.images?.[0] ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-blue-300/40">
                    No Image
                  </div>
                )}
              </div>

              {/* TYPE BADGE */}
              <div
                className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full shadow ${
                  item.type === "lost"
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {item.type.toUpperCase()}
              </div>

              {/* CONTENT */}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-lg text-blue-100">
                  {item.title}
                </h3>

                <p className="text-sm text-blue-200/80 line-clamp-2">
                  {item.description}
                </p>

                {/* INFO */}
                <div className="flex items-center gap-2 text-xs text-blue-300/70">
                  <MapPin className="w-3.5 h-3.5" />
                  {item.location}
                </div>

                <div className="flex items-center gap-2 text-xs text-blue-300/70">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {new Date(item.date).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-2 text-xs text-blue-300/70">
                  <User className="w-3.5 h-3.5" />
                  {item.postedBy?.name || "User"}
                </div>

                {/* CLAIM BUTTON */}
                {!isOwner && item.status === "active" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleClaim(e, item._id)}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-linear-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium shadow"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Claim Item
                  </motion.button>
                )}

                {/* OWNER TEXT */}
                {isOwner && (
                  <p className="text-xs text-blue-400 mt-2">
                    Your post
                  </p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* EMPTY */}
      {filteredItems.length === 0 && (
        <div className="text-center text-blue-300/60 mt-16">
          No items found
        </div>
      )}
    </div>
  )
}

export default LostAndFound
