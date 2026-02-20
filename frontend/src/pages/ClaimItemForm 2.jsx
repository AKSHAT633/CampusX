import React, { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { MapPin, CalendarDays, FileText, UploadCloud } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { fetchItems } from "../servers/api"
import axios from "axios"
import { serverUrl } from "../main"
import toast from "react-hot-toast"

const ClaimItemForm = ({ item: itemProp }) => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { itemData } = useSelector((state) => state.item)

  useEffect(() => {
    if (!itemData || itemData.length === 0) {
      fetchItems(dispatch)
    }
  }, [dispatch, itemData])

  const item = useMemo(() => {
    return itemProp || itemData.find((i) => i._id === id)
  }, [itemProp, itemData, id])
  const [form, setForm] = useState({
    identifyingDetails: "",
    lostLocation: "",
    lostDate: "",
    itemImage: null,
  })

  const [loading, setLoading] = useState(false)

  const [preview, setPreview] = useState(null)

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleImage = (file) => {
    if (!file) return
    setForm((p) => ({ ...p, itemImage: file }))
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      if (v) data.append(k, v)
    })

    data.append("itemId", item._id)

    try {
      setLoading(true)
      await axios.post(`${serverUrl}/api/item/claim/${item._id}`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      })
      toast.success("Claim submitted successfully")
      setForm({
        identifyingDetails: "",
        lostLocation: "",
        lostDate: "",
        itemImage: null,
      })
      setPreview(null)
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to submit claim"
      )
    } finally {
      setLoading(false)
    }
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-blue-950 to-slate-950 text-white p-6">
        <div className="max-w-2xl mx-auto text-blue-300/70">Loading claim form...</div>
      </div>
    )
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto mt-10 p-6 rounded-2xl 
      bg-linear-to-br from-slate-950 via-blue-950 to-slate-950 
      border border-blue-500/20 shadow-xl space-y-5 text-white"
    >
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">
          Claim Item
        </h2>
        <p className="text-blue-200/80 text-sm">
          Provide details so the owner can verify the item belongs to you
        </p>
      </div>

      {/* ITEM SUMMARY */}
      <div className="p-4 rounded-xl bg-white/5 border border-blue-500/20">
        <p className="font-semibold">{item.title}</p>
        <p className="text-xs text-blue-300/70">
          {item.category} • {item.location}
        </p>
      </div>

      {/* UNIQUE DETAILS */}
      <div>
        <label className="text-sm text-blue-200">
          Identifying Details *
        </label>
        <textarea
          required
          rows={4}
          value={form.identifyingDetails}
          onChange={(e) =>
            handleChange("identifyingDetails", e.target.value)
          }
          placeholder="Describe unique marks, color, brand, contents, scratches, stickers, etc."
          className="w-full mt-1 px-4 py-3 rounded-lg bg-slate-900/70 border border-blue-500/20 text-white focus:border-blue-400"
        />
      </div>

      {/* LOST LOCATION */}
      <Input
        icon={<MapPin size={16} />}
        label="Where did you lose it?"
        value={form.lostLocation}
        onChange={(v) => handleChange("lostLocation", v)}
      />

      {/* LOST DATE */}
      <Input
        icon={<CalendarDays size={16} />}
        label="When did you lose it?"
        type="date"
        value={form.lostDate}
        onChange={(v) => handleChange("lostDate", v)}
      />

      {/* PROOF IMAGE */}
      <div>
        <label className="text-sm text-blue-200">
          Proof Image (optional)
        </label>

        <label className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-blue-500/30 rounded-xl p-5 cursor-pointer hover:border-blue-400">
          <UploadCloud className="text-blue-400 mb-2" />
          <span className="text-sm text-blue-200">
            Upload proof photo
          </span>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImage(e.target.files[0])}
          />
        </label>

        {preview && (
          <img
            src={preview}
            alt="proof"
            className="mt-3 rounded-lg border border-blue-500/20 max-h-40"
          />
        )}
      </div>

      {/* SUBMIT */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        disabled={loading}
        className="w-full py-3 rounded-xl 
        bg-linear-to-r from-green-500 to-emerald-600 
        text-white font-semibold shadow-lg disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Claim"}
      </motion.button>
    </motion.form>
  )
}

export default ClaimItemForm


/* ---------- INPUT ---------- */
const Input = ({
  label,
  value,
  onChange,
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
        className={`w-full px-4 py-3 rounded-lg bg-slate-900/70 
        border border-blue-500/20 text-white focus:border-blue-400 
        ${icon ? "pl-10" : ""}`}
      />
    </div>
  </div>
)
