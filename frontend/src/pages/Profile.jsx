import React, { useEffect, useRef, useState } from "react"
import { Edit, Mail, Phone, User, Camera, Trash2 } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { updateProfile, deleteProfileImage, fetchMarketplaceItems, fetchItems } from "../servers/api"

const Profile = () => {
  const { userData } = useSelector((state) => state.user)
  const { items: marketplaceItems } = useSelector((state) => state.marketplace)
  const { itemData } = useSelector((state) => state.item)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profileFile, setProfileFile] = useState(null)
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "",
  })

  /* LOAD USER */
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData?.name || "",
        email: userData?.email || "",
        phone: userData?.phone || "",
        profileImage: userData?.ProfileImage || "",
      })
      // ensure marketplace and items are loaded for accurate counts
      if (!marketplaceItems || marketplaceItems.length === 0) fetchMarketplaceItems(dispatch, { category: "all" })
      if (!itemData || itemData.length === 0) fetchItems(dispatch)
    }
  }, [userData])

  /* CHANGE */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((p) => ({ ...p, [name]: value }))
  }

  /* IMAGE */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Select image file")
      return
    }

    setProfileFile(file)
    const reader = new FileReader()
    reader.onload = () =>
      setFormData((p) => ({ ...p, profileImage: reader.result }))
    reader.readAsDataURL(file)
  }

  /* SAVE */
  const handleSave = async () => {
    setIsSaving(true)

    let payload
    if (profileFile) {
      payload = new FormData()
      payload.append("name", formData.name)
      payload.append("phone", formData.phone)
      payload.append("profileImage", profileFile)
    } else {
      payload = {
        name: formData.name,
        phone: formData.phone,
      }
    }

    const res = await updateProfile(dispatch, payload)

    if (res?.error) toast.error(res.message)
    else {
      toast.success("Profile updated")
      setIsEditing(false)
    }

    setIsSaving(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white p-6">
      <div className="max-w-2xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="w-7 h-7 text-blue-400" />
            My Profile
          </h1>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-300 hover:bg-blue-500/30"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg bg-white/10 border border-blue-500/20"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-blue-600"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>

        {/* CARD */}
        <div className="rounded-2xl border border-blue-500/20 bg-white/5 backdrop-blur-xl p-6 space-y-6">

          {/* AVATAR */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="relative w-28 h-28 cursor-pointer"
              onClick={() => isEditing && fileInputRef.current?.click()}
            >
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="profile"
                  className="w-28 h-28 rounded-full object-cover border-2 border-blue-400"
                />
              ) : (
                <div className="w-28 h-28 rounded-full border-2 border-blue-400 bg-blue-500/20 flex items-center justify-center text-3xl font-bold">
                  {(formData.name || "U")[0]}
                </div>
              )}

              {isEditing && (
                <div className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full border border-blue-400">
                  <Camera className="w-4 h-4" />
                </div>
              )}
            </div>

            {isEditing && formData.profileImage && (
              <button
                onClick={async () => {
                  // if it's a newly selected local file, just clear
                  if (profileFile) {
                    setProfileFile(null)
                    setFormData((p) => ({ ...p, profileImage: "" }))
                    return
                  }

                  // if it's a remote URL, call delete API
                  const url = formData.profileImage || ""
                  if (url.startsWith("http")) {
                    const res = await deleteProfileImage(url)
                    if (res?.error) toast.error(res.message || "Delete failed")
                    else toast.success("Image removed")
                  }
                  setFormData((p) => ({ ...p, profileImage: "" }))
                }}
                className="text-xs text-red-400 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Remove photo
              </button>
            )}
          </div>

          {/* hidden input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* FIELDS */}
          <FieldRow
            icon={<User className="w-4 h-4" />}
            label="Name"
            value={formData.name}
            name="name"
            isEditing={isEditing}
            onChange={handleChange}
          />

          <FieldRow
            icon={<Mail className="w-4 h-4" />}
            label="Email"
            value={formData.email}
            isEditing={false}
          />

          <FieldRow
            icon={<Phone className="w-4 h-4" />}
            label="Phone"
            value={formData.phone}
            name="phone"
            isEditing={isEditing}
            onChange={handleChange}
          />

          {/* User stats: sell items and lost/found posts */}
          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            <div className="p-3 rounded-lg bg-slate-900/40 border border-blue-500/20">
              <p className="text-xs text-blue-300/60">Sell items</p>
              <div className="flex items-center justify-between mt-2">
                <div className="text-2xl font-semibold text-blue-100">
                  {marketplaceItems?.filter((m) => m.seller?._id === userData?._id).length || 0}
                </div>
                <button
                  onClick={() => navigate('/all-sell-items')}
                  className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm"
                >
                  See Sell Items
                </button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/40 border border-blue-500/20">
              <p className="text-xs text-blue-300/60">Lost/Found posts</p>
              <div className="flex items-center justify-between mt-2">
                <div className="text-2xl font-semibold text-blue-100">
                  {itemData?.filter((it) => it.postedBy?._id === userData?._id).length || 0}
                </div>
                <button
                  onClick={() => navigate('/all-items')}
                  className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm"
                >
                  See Posts
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile


/* FIELD */
const FieldRow = ({ icon, label, value, name, isEditing, onChange }) => (
  <div className="flex items-center gap-3">
    <div className="text-blue-400">{icon}</div>
    <div className="flex-1">
      <p className="text-xs text-blue-300/50 mb-1">{label}</p>
      {isEditing && name ? (
        <input
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-slate-900/40 border border-blue-500/20 rounded-lg px-3 py-2 text-blue-100"
        />
      ) : (
        <p className="text-sm text-blue-100">{value || "N/A"}</p>
      )}
    </div>
  </div>
)