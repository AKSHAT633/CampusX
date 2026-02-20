import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Tag,
  IndianRupee,
  User,
  Filter,
  ShoppingBag,
  Plus,
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { fetchMarketplaceItems } from "../servers/api"
import { Link, useNavigate } from "react-router-dom"

const CATEGORIES = [
  "all",
  "books",
  "electronics",
  "accessories",
  "clothing",
  "stationery",
  "furniture",
  "other",
]

const MarketPlace = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, loading } = useSelector((state) => state.marketplace)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")

  /* ---------- FETCH ON MOUNT ---------- */
  useEffect(() => {
    fetchMarketplaceItems(dispatch, { category: "all" })
  }, [dispatch])

  /* ---------- FETCH ON FILTER CHANGE ---------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMarketplaceItems(dispatch, { 
        category: category !== "all" ? category : "", 
        search 
      })
    }, 300) // debounce search

    return () => clearTimeout(timer)
  }, [category, search, dispatch])

  /* ---------- FILTER ---------- */
  const filtered = items.filter((item) => {
    const matchSearch = item.title
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchCategory =
      category === "all" || item.category === category

    return matchSearch && matchCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-blue-400" />
            Campus Marketplace
          </h1>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            {/* SEARCH */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search items..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-900/70 border border-blue-500/20 text-white focus:border-blue-400"
              />
            </div>

            {/* SELL BUTTON */}
            <motion.button
              onClick={() => navigate("/sell/add")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg hover:shadow-emerald-500/50 transition whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Sell Item
            </motion.button>
          </div>
        </div>

        {/* FILTER */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                category === cat
                  ? "bg-blue-500/20 border-blue-400 text-blue-300"
                  : "border-blue-500/20 text-blue-200 hover:bg-white/5"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* GRID */}
        {loading ? (
          <div className="text-center text-blue-300/60 mt-20">
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-blue-300/60 mt-20">
            No items found
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item, i) => (
              <Link
                key={item._id}
                to={`/sell/${item._id}`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="rounded-2xl border border-blue-500/20 bg-white/5 overflow-hidden backdrop-blur-xl shadow-xl cursor-pointer"
                >
                  {/* IMAGE */}
                  <div className="h-48 bg-slate-800">
                    {item.images && item.images[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-blue-300/30">
                        <ShoppingBag className="w-16 h-16" />
                      </div>
                    )}
                  </div>

                  {/* BODY */}
                  <div className="p-4 space-y-3">

                    {/* TITLE */}
                    <h3 className="font-semibold line-clamp-2">
                      {item.title}
                    </h3>

                    {/* CATEGORY */}
                    <div className="flex items-center gap-1 text-xs text-blue-300/70">
                      <Tag className="w-3.5 h-3.5" />
                      {item.category}
                    </div>

                    {/* PRICE */}
                    <div className="flex items-center gap-1 text-lg font-bold text-green-400">
                      <IndianRupee className="w-4 h-4" />
                      {item.price}
                    </div>

                    {/* SELLER */}
                    <div className="flex items-center gap-2 text-xs text-blue-200/70">
                      <User className="w-3.5 h-3.5" />
                      {item.seller?.name}
                    </div>

                    {/* VIEW BUTTON */}
                    <div className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium shadow text-center">
                      View Details
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MarketPlace
