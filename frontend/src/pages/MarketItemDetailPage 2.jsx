import React, { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  IndianRupee,
  Tag,
  MapPin,
  User,
  Mail,
  Clock,
  ShoppingBag,
  Info,
  Package,
} from "lucide-react"
import { fetchMarketplaceItemById } from "../servers/api"
import toast from "react-hot-toast"

const MarketItemDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [relatedItems, setRelatedItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const loadItem = async () => {
      try {
        setLoading(true)
        const data = await fetchMarketplaceItemById(id)
        setItem(data.item)
        setRelatedItems(data.relatedItems || [])
      } catch (err) {
        toast.error("Failed to load item")
        navigate("/sell")
      } finally {
        setLoading(false)
      }
    }

    loadItem()
  }, [id, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white flex items-center justify-center">
        <div className="text-blue-300">Loading...</div>
      </div>
    )
  }

  if (!item) return null

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const conditionLabels = {
    new: "Brand New",
    like_new: "Like New",
    good: "Good Condition",
    fair: "Fair Condition",
  }

  const statusColors = {
    available: "text-green-400",
    sold: "text-red-400",
    reserved: "text-yellow-400",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/sell")}
          className="flex items-center gap-2 text-blue-300 hover:text-blue-200 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Marketplace
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT: IMAGES */}
          <div className="space-y-4">
            {/* MAIN IMAGE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl overflow-hidden border border-blue-500/20 bg-slate-900/50 aspect-square"
            >
              {item.images && item.images.length > 0 ? (
                <img
                  src={item.images[selectedImage]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-blue-300/30">
                  <ShoppingBag className="w-24 h-24" />
                </div>
              )}
            </motion.div>

            {/* THUMBNAILS */}
            {item.images && item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {item.images.map((img, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(i)}
                    className={`rounded-lg overflow-hidden border-2 aspect-square ${
                      selectedImage === i
                        ? "border-blue-400"
                        : "border-blue-500/20"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS */}
          <div className="space-y-6">
            {/* TITLE & STATUS */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-3xl font-bold">{item.title}</h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium uppercase ${statusColors[item.status]} bg-white/10`}
                >
                  {item.status}
                </span>
              </div>

              {/* PRICE */}
              <div className="flex items-center gap-1 text-4xl font-bold text-green-400">
                <IndianRupee className="w-8 h-8" />
                {item.price}
              </div>
            </div>

            {/* INFO GRID */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/5 border border-blue-500/20">
              <InfoItem
                icon={<Tag />}
                label="Category"
                value={item.category.toUpperCase()}
              />
              <InfoItem
                icon={<Info />}
                label="Condition"
                value={conditionLabels[item.condition] || item.condition}
              />
              <InfoItem
                icon={<Clock />}
                label="Posted"
                value={formatDate(item.createdAt)}
              />
              {item.location && (
                <InfoItem
                  icon={<MapPin />}
                  label="Location"
                  value={item.location}
                />
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="p-4 rounded-xl bg-white/5 border border-blue-500/20">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-400" />
                Description
              </h3>
              <p className="text-blue-100/80 leading-relaxed whitespace-pre-wrap">
                {item.description}
              </p>
            </div>

            {/* SELLER INFO */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border border-blue-500/30">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                Seller Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-200">
                  <User className="w-4 h-4 text-blue-400" />
                  <span>{item.seller?.name || "Unknown"}</span>
                </div>
                <div className="flex items-center gap-2 text-blue-200">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>{item.seller?.email || "N/A"}</span>
                </div>
              </div>

              {/* CONTACT BUTTON */}
              {item.status === "available" && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg"
                >
                  Contact Seller
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* RELATED ITEMS */}
        {relatedItems.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Tag className="w-6 h-6 text-blue-400" />
              Related Items
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedItems.map((relItem, i) => (
                <motion.div
                  key={relItem._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                >
                  <Link
                    to={`/sell/${relItem._id}`}
                    className="block rounded-2xl border border-blue-500/20 bg-white/5 overflow-hidden backdrop-blur-xl shadow-xl hover:border-blue-400/40 transition"
                  >
                    {/* IMAGE */}
                    <div className="h-40 bg-slate-800">
                      {relItem.images && relItem.images[0] ? (
                        <img
                          src={relItem.images[0]}
                          alt={relItem.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-blue-300/30">
                          <ShoppingBag className="w-12 h-12" />
                        </div>
                      )}
                    </div>

                    {/* BODY */}
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold line-clamp-2 text-sm">
                        {relItem.title}
                      </h3>

                      <div className="flex items-center gap-1 text-lg font-bold text-green-400">
                        <IndianRupee className="w-4 h-4" />
                        {relItem.price}
                      </div>

                      <div className="flex items-center gap-1 text-xs text-blue-300/70">
                        <Tag className="w-3 h-3" />
                        {relItem.category}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MarketItemDetailPage

/* ---------- INFO ITEM ---------- */
const InfoItem = ({ icon, label, value }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-1.5 text-xs text-blue-300/70">
      {React.cloneElement(icon, { className: "w-3.5 h-3.5" })}
      {label}
    </div>
    <div className="font-medium text-blue-100">{value}</div>
  </div>
)
