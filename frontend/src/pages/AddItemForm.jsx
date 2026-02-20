import React, { useState } from "react"
import { motion } from "framer-motion"
import { UploadCloud, MapPin, CalendarDays, Tag, Image, Loader2 } from "lucide-react"
import axios from "axios"
import { serverUrl } from "../main"
import toast from "react-hot-toast"

/* HELPER COMPONENTS */
const ToggleBtn = ({ active, label, color, onClick }) => {
  const colorClasses = {
    red: active
      ? "bg-red-500/20 border-red-500 text-red-300"
      : "border-blue-500/20 text-blue-200/60",
    green: active
      ? "bg-green-500/20 border-green-500 text-green-300"
      : "border-blue-500/20 text-blue-200/60",
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-2 px-4 rounded-lg border transition ${
        colorClasses[color]
      }`}
    >
      {label}
    </button>
  )
}

const Input = ({ label, value, onChange, placeholder, icon, required, type = "text" }) => {
  return (
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
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${icon ? "pl-10" : ""} px-4 py-3 rounded-lg bg-slate-900/70 border border-blue-500/20 text-white focus:border-blue-400`}
        />
      </div>
    </div>
  )
}

const AddItemForm = ({ loading, setLoading }) => {
  const [localLoading, setLocalLoading] = useState(false)
  const isLoading = loading ?? localLoading
  const setLoadingState = setLoading ?? setLocalLoading
  
  const [type, setType] = useState("lost")
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)

  const CATEGORIES = [
    { value: "electronics", label: "Electronics" },
    { value: "books", label: "Books" },
    { value: "clothing", label: "Clothing" },
    { value: "accessories", label: "Accessories" },
    { value: "documents", label: "Documents" },
    { value: "keys", label: "Keys" },
    { value: "wallet", label: "Wallet" },
    { value: "bag", label: "Bag" },
    { value: "id_cards", label: "ID Cards" },
    { value: "mobile", label: "Mobile" },
    { value: "laptop", label: "Laptop" },
    { value: "pets", label: "Pets" },
    { value: "jewelry", label: "Jewelry" },
    { value: "vehicles", label: "Vehicles" },
    { value: "other", label: "Other" },
  ]

  /* IMAGE */
  const handleImage = (file) => {
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  /* RESET FORM */
  const resetForm = () => {
    setType("lost")
    setTitle("")
    setCategory("")
    setLocation("")
    setDate("")
    setDescription("")
    setImage(null)
    setPreview(null)
  }

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !category || !location || !date) {
      toast.error("Please fill required fields")
      return
    }

    try {
      setLoadingState(true)

      const formData = new FormData()
      formData.append("type", type)
      formData.append("title", title)
      formData.append("category", category)
      formData.append("location", location)
      formData.append("date", date)
      formData.append("description", description)
      if (image) formData.append("image", image)

      const res = await axios.post(
        `${serverUrl}/api/item/add`,
        formData,
        { withCredentials: true }
      )

      toast.success("Item posted successfully 🎉")

      resetForm()
    } catch (error) {
      console.error(error)
      toast.error(
        error?.response?.data?.message || "Failed to post item"
      )
    } finally {
      setLoadingState(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mt-10 mb-10 mx-auto p-6 md:p-8 rounded-2xl 
      bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 
      border border-blue-500/20 shadow-2xl space-y-6 text-white relative"
    >
      {/* HEADER */}
      <div className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-bold">
          Post <span className="text-blue-400">Lost / Found</span> Item
        </h2>
        <p className="text-blue-200/80 text-sm">
          Help students recover belongings across campus
        </p>
      </div>

      {/* TYPE */}
      <div className="flex gap-3">
        <ToggleBtn
          active={type === "lost"}
          label="Lost Item"
          color="red"
          onClick={() => setType("lost")}
        />
        <ToggleBtn
          active={type === "found"}
          label="Found Item"
          color="green"
          onClick={() => setType("found")}
        />
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-3" />
            <p className="text-white font-semibold">Posting your item...</p>
            <p className="text-blue-200/60 text-sm mt-1">Please wait</p>
          </div>
        </div>
      )}

      {/* TITLE */}
      <Input
        label="Item Title"
        value={title}
        onChange={setTitle}
        placeholder="e.g. Black Backpack"
        required
      />

      {/* DESCRIPTION */}
      <div>
        <label className="text-sm text-blue-200">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Details about the item..."
          className="w-full mt-1 px-4 py-3 rounded-lg bg-slate-900/70 border border-blue-500/20 text-white focus:border-blue-400"
        />
      </div>

      {/* CATEGORY */}
      <div>
        <label className="text-sm text-blue-200">Category *</label>
        <div className="relative mt-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full pl-10 px-4 py-3 rounded-lg bg-slate-900/70 border border-blue-500/20 text-white focus:border-blue-400"
          >
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* LOCATION */}
      <Input
        label="Location"
        value={location}
        onChange={setLocation}
        placeholder="Where was it lost/found?"
        icon={<MapPin size={16} />}
        required
      />

      {/* DATE */}
      <Input
        label="Date"
        type="date"
        value={date}
        onChange={setDate}
        icon={<CalendarDays size={16} />}
        required
      />

      {/* IMAGE */}
      <div>
        <label className="text-sm text-blue-200">Upload Image</label>

        <label className="relative mt-2 flex flex-col items-center justify-center border-2 border-dashed border-blue-500/30 rounded-xl p-6 cursor-pointer hover:border-blue-400 transition">
          <UploadCloud className="text-blue-400 mb-2" />
          <span className="text-sm text-blue-200">
            Click to upload image
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImage(e.target.files[0])}
          />
        </label>

        {preview && (
          <div className="mt-3 relative">
            <img
              src={preview}
              alt="preview"
              className="w-full h-48 object-cover rounded-xl border border-blue-500/20"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition rounded-xl flex items-center justify-center">
              <Image className="text-white" />
            </div>
          </div>
        )}
      </div>

      {/* SUBMIT */}
      <motion.button
        whileHover={{ scale: isLoading ? 1 : 1.03 }}
        whileTap={{ scale: isLoading ? 1 : 0.97 }}
        disabled={isLoading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 
        text-white font-semibold shadow-lg shadow-blue-500/30 
        disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
        {isLoading ? "Posting..." : "Post Item"}
      </motion.button>
    </motion.form>
  )
}

export default AddItemForm
