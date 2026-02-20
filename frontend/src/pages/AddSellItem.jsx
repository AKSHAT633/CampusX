import React, { useState } from "react"
import { motion } from "framer-motion"
import {
  UploadCloud,
  Tag,
  IndianRupee,
  Image,
  Info,
  Package,
  MapPin,
} from "lucide-react"
import axios from "axios"
import { serverUrl } from "../main"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

const CATEGORIES = [
  "books",
  "electronics",
  "accessories",
  "clothing",
  "stationery",
  "furniture",
  "other",
]

const CONDITIONS = ["new", "like_new", "good", "fair"]

const AddSellItem = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [condition, setCondition] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [loading, setLoading] = useState(false)

  /* ---------- IMAGE ---------- */
  const handleImages = (files) => {
    const arr = Array.from(files)
    setImages(arr)
    setPreviews(arr.map((f) => URL.createObjectURL(f)))
  }

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title || !price || !category) return

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("title", title)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("condition", condition || "good")
      formData.append("description", description)
      formData.append("location", location)

      images.forEach((img) => formData.append("images", img))

      const { data } = await axios.post(`${serverUrl}/api/marketplace/create`, formData, {
        withCredentials: true,
      })

      toast.success("Item posted successfully!")
      
      /* CLEAR */
      setTitle("")
      setPrice("")
      setCategory("")
      setCondition("")
      setDescription("")
      setLocation("")
      setImages([])
      setPreviews([])
      
      // Navigate to marketplace or item detail
      setTimeout(() => navigate("/sell"), 1500)
    } catch (err) {
      console.error("Sell item failed", err)
      toast.error(err.response?.data?.message || "Failed to post item")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white p-6">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="w-7 h-7 text-blue-400" />
            Sell an Item
          </h1>
          <p className="text-blue-200/70 mt-1">
            Post items for sale in campus marketplace
          </p>
        </div>

        {/* FORM */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 p-6 rounded-2xl border border-blue-500/20 bg-white/5 backdrop-blur-xl shadow-xl"
        >
          {/* TITLE */}
          <Input
            label="Item Title"
            icon={<Tag size={16} />}
            value={title}
            onChange={setTitle}
            placeholder="e.g. Engineering Drawing Kit"
            required
          />

          {/* PRICE */}
          <Input
            label="Price"
            icon={<IndianRupee size={16} />}
            value={price}
            onChange={setPrice}
            type="number"
            placeholder="Enter price"
            required
          />

          {/* CATEGORY */}
          <Select
            label="Category"
            value={category}
            onChange={setCategory}
            options={CATEGORIES}
            icon={<Tag size={16} />}
            required
          />

          {/* CONDITION */}
          <Select
            label="Condition"
            value={condition}
            onChange={setCondition}
            options={CONDITIONS}
            icon={<Info size={16} />}
          />

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm text-blue-200">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Item details..."
              className="w-full mt-1 px-4 py-3 rounded-lg bg-slate-900/70 border border-blue-500/20 text-white"
            />
          </div>

          {/* LOCATION */}
          <Input
            label="Location (Optional)"
            icon={<MapPin size={16} />}
            value={location}
            onChange={setLocation}
            placeholder="e.g. Hostel Block A, Library"
          />

          {/* IMAGES */}
          <div>
            <label className="text-sm text-blue-200">Images</label>

            <label className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-blue-500/30 rounded-xl p-6 cursor-pointer hover:border-blue-400 transition">
              <UploadCloud className="text-blue-400 mb-2" />
              <span className="text-sm text-blue-200">
                Upload item images
              </span>

              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImages(e.target.files)}
              />
            </label>

            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {previews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="h-24 w-full object-cover rounded-lg border border-blue-500/20"
                  />
                ))}
              </div>
            )}
          </div>

          {/* SUBMIT */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg"
          >
            {loading ? "Posting..." : "Post Item"}
          </motion.button>
        </motion.form>
      </div>
    </div>
  )
}

export default AddSellItem

/* ---------- INPUT ---------- */
const Input = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  required,
}) => (
  <div>
    <label className="text-sm text-blue-200">
      {label} {required && "*"}
    </label>
    <div className="relative mt-1">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
          {icon}
        </div>
      )}
      <input
        required={required}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-lg bg-slate-900/70 border border-blue-500/20 text-white ${
          icon ? "pl-10" : ""
        }`}
      />
    </div>
  </div>
)

/* ---------- SELECT ---------- */
const Select = ({ label, value, onChange, options, icon, required }) => (
  <div>
    <label className="text-sm text-blue-200">
      {label} {required && "*"}
    </label>
    <div className="relative mt-1">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
          {icon}
        </div>
      )}
      <select
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 px-4 py-3 rounded-lg bg-slate-900/70 border border-blue-500/20 text-white"
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o.replace("_", " ").toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  </div>
)
