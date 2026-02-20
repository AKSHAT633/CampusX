import React, { useState } from "react"
import { motion } from "framer-motion"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  LogOut,
  ShoppingBag,
  Package,
  Star,
  Settings,
  Award,
} from "lucide-react"
import { useSelector } from "react-redux"

const Profile = () => {
  const { userData } = useSelector((state) => state.user)
  const { itemData } = useSelector((state) => state.item)
  const [isEditing, setIsEditing] = useState(false)

  // Get real user data
  const profileData = {
    name: userData?.name || "User",
    email: userData?.email || "N/A",
    phone: userData?.phone || "Not provided",
    location: userData?.location || "Not provided",
    joinDate: userData?.createdAt
      ? new Date(userData.createdAt).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
        })
      : "Recently joined",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?._id || "user"}`,
  }

  // Get user's marketplace items (top 3)
  const myListings = itemData?.slice(0, 3) || []

  // Recent activity from items (top 3)
  const recentActivity = itemData
    ?.slice(0, 3)
    .map((item, i) => ({
      id: item._id,
      action: `Posted ${item.title}`,
      date: new Date(item.createdAt).toLocaleDateString("en-IN"),
      amount: `₹${item.price}`,
    })) || []

  // Calculate stats
  const stats = {
    itemsSold: itemData?.filter((i) => i.status === "sold").length || 0,
    itemsBought: itemData?.filter((i) => i.isClaimed).length || 0,
    rating: 4.5,
    reviews: itemData?.length || 0,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="w-8 h-8 text-blue-400" />
            My Profile
          </h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-300 hover:bg-blue-500/30 transition"
          >
            <Edit className="w-4 h-4" />
            {isEditing ? "Done" : "Edit Profile"}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT: PROFILE INFO */}
          <div className="lg:col-span-1 space-y-6">
            {/* PROFILE CARD */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-blue-500/20 bg-white/5 backdrop-blur-xl p-6 space-y-4"
            >
              {/* AVATAR */}
              <div className="flex justify-center mb-4">
                <img
                  src={profileData.avatar}
                  alt={profileData.name}
                  className="w-24 h-24 rounded-full border-2 border-blue-400"
                />
              </div>

              {/* NAME & BIO */}
              <div className="text-center">
                <h2 className="text-2xl font-bold">{profileData.name}</h2>
              </div>

              {/* INFO ITEMS */}
              <div className="space-y-3 pt-4 border-t border-blue-500/20">
                <InfoRow
                  icon={<Mail className="w-4 h-4" />}
                  label="Email"
                  value={userData?.email || "N/A"}
                />
                <InfoRow
                  icon={<User className="w-4 h-4" />}
                  label="Roll Number"
                  value={userData?.rollNumber || "N/A"}
                />
                <InfoRow
                  icon={<User className="w-4 h-4" />}
                  label="Branch"
                  value={userData?.branch || "N/A"}
                />
                <InfoRow
                  icon={<User className="w-4 h-4" />}
                  label="Year"
                  value={userData?.year || "N/A"}
                />
                <InfoRow
                  icon={<Phone className="w-4 h-4" />}
                  label="Phone"
                  value={userData?.phone || "N/A"}
                />
                <InfoRow
                  icon={<MapPin className="w-4 h-4" />}
                  label="Location"
                  value={userData?.location || "N/A"}
                />
                <InfoRow
                  icon={<Calendar className="w-4 h-4" />}
                  label="Joined"
                  value={
                    userData?.createdAt
                      ? new Date(userData.createdAt).toLocaleDateString(
                          "en-IN"
                        )
                      : "N/A"
                  }
                />
                {userData?.verified && (
                  <InfoRow
                    icon={<Star className="w-4 h-4" />}
                    label="Status"
                    value={userData.verified ? "✅ Verified" : "❌ Not Verified"}
                  />
                )}
              </div>
            </motion.div>

            {/* STATS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-blue-500/20 bg-white/5 backdrop-blur-xl p-6 space-y-4"
            >
              <h3 className="font-semibold flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-400" />
                Statistics
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  icon={<ShoppingBag />}
                  label="Sold"
                  value={stats.itemsSold}
                />
                <StatCard
                  icon={<Package />}
                  label="Listings"
                  value={stats.reviews}
                />
                <StatCard
                  icon={<Star />}
                  label="Rating"
                  value={`${stats.rating}⭐`}
                />
                <StatCard
                  icon={<User />}
                  label="Claimed"
                  value={stats.itemsBought}
                />
              </div>
            </motion.div>

            {/* LOGOUT */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30 transition font-semibold"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>

          {/* RIGHT: ACTIVITIES & LISTINGS */}
          <div className="lg:col-span-2 space-y-8">
            {/* RECENT ACTIVITY */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-blue-500/20 bg-white/5 backdrop-blur-xl p-6"
            >
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>

              <div className="space-y-3">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, i) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-blue-500/10"
                    >
                      <div className="flex-1">
                        <p className="text-blue-100">{activity.action}</p>
                        <p className="text-xs text-blue-300/50 mt-0.5">
                          {activity.date}
                        </p>
                      </div>
                      <p className="text-green-400 font-semibold">
                        {activity.amount}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-blue-300/50 py-4">
                    No activity yet
                  </p>
                )}
              </div>
            </motion.div>

            {/* MY LISTINGS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-blue-500/20 bg-white/5 backdrop-blur-xl p-6"
            >
              <h3 className="text-xl font-semibold mb-4">My Listings</h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myListings.length > 0 ? (
                  myListings.map((item, i) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="rounded-xl overflow-hidden border border-blue-500/20 bg-slate-900/50 hover:border-blue-400/40 transition group"
                    >
                      {/* IMAGE */}
                      <div className="relative h-32 overflow-hidden bg-slate-800">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-blue-300/30">
                            <ShoppingBag className="w-8 h-8" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === "available"
                                ? "bg-green-500/20 text-green-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>

                      {/* INFO */}
                      <div className="p-3">
                        <h4 className="font-semibold line-clamp-2 text-sm mb-1">
                          {item.title}
                        </h4>
                        <p className="text-green-400 font-bold">₹{item.price}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="col-span-full text-center text-blue-300/50 py-8">
                    No listings yet
                  </p>
                )}
              </div>
            </motion.div>

            {/* SETTINGS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl border border-blue-500/20 bg-white/5 backdrop-blur-xl p-6"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-400" />
                Settings
              </h3>

              <div className="space-y-3">
                <SettingRow label="Email Notifications" enabled={true} />
                <SettingRow label="SMS Alerts" enabled={false} />
                <SettingRow label="Show my location" enabled={true} />
                <SettingRow label="Two-factor authentication" enabled={false} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

/* ---------- INFO ROW ---------- */
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="text-blue-400">{icon}</div>
    <div className="flex-1">
      <p className="text-xs text-blue-300/50">{label}</p>
      <p className="text-sm text-blue-100">{value}</p>
    </div>
  </div>
)

/* ---------- STAT CARD ---------- */
const StatCard = ({ icon, label, value }) => (
  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
    <div className="text-blue-400 mb-1">{icon}</div>
    <p className="text-xs text-blue-300/70">{label}</p>
    <p className="text-lg font-bold text-blue-100">{value}</p>
  </div>
)

/* ---------- SETTING ROW ---------- */
const SettingRow = ({ label, enabled }) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-blue-500/10">
    <p className="text-blue-100">{label}</p>
    <button
      className={`relative w-10 h-6 rounded-full transition ${
        enabled ? "bg-green-500" : "bg-gray-600"
      }`}
    >
      <motion.div
        initial={false}
        animate={{ x: enabled ? 20 : 2 }}
        className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
      />
    </button>
  </div>
)