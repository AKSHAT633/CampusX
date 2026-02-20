import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchMyClaims } from "../servers/api"
import { motion } from "framer-motion"
import { CalendarDays, MapPin, BadgeCheck, FileText, Mail, MessageCircle, User, Phone } from "lucide-react"
import { useNavigate } from "react-router-dom"

const MyClaim = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { myClaimData } = useSelector((state) => state.claim)

  useEffect(() => {
    fetchMyClaims(dispatch)
  }, [dispatch])

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-blue-950 to-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            My <span className="text-blue-400">Claims</span>
          </h1>
          <p className="text-blue-200/80 text-sm mt-1">
            Track the status of items you claimed
          </p>
        </div>

        {myClaimData.length === 0 ? (
          <div className="text-blue-300/70">No claims submitted yet.</div>
        ) : (
          <div className="grid gap-6">
            {myClaimData.map((claim) => (
              <motion.div
                key={claim._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-blue-500/20 bg-white/5 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {claim.item?.title || "Item"}
                    </h2>
                    <p className="text-sm text-blue-200/70">
                      {claim.item?.category} • {claim.item?.location}
                    </p>
                    {claim.status === "approved" && (
                      <p className="mt-2 text-sm text-green-300">
                        Approved! You can collect the item now. Please connect with the poster.
                      </p>
                    )}
                    {claim.status === "rejected" && claim.rejectReason && (
                      <p className="mt-2 text-sm text-red-300">
                        Rejected reason: {claim.rejectReason}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      claim.status === "approved"
                        ? "bg-green-600"
                        : claim.status === "rejected"
                        ? "bg-red-600"
                        : "bg-yellow-600"
                    }`}
                  >
                    {claim.status}
                  </span>
                </div>

                <div className="mt-4 grid lg:grid-cols-2 gap-6">
                  <div className="rounded-xl border border-blue-500/20 bg-slate-900/40 p-4">
                    <h3 className="text-sm font-semibold text-blue-200 mb-3">
                      Posted Item Info
                    </h3>
                    <div className="space-y-2 text-sm text-blue-100/90">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>Location: {claim.item?.location || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" />
                        <span>
                          Lost/Found: {claim.item?.date ? new Date(claim.item.date).toLocaleDateString() : "-"}
                        </span>
                      </div>
                      {claim.item?.images?.[0] && (
                        <img
                          src={claim.item.images[0]}
                          alt="item"
                          className="mt-2 max-h-36 rounded-lg border border-blue-500/20 object-cover"
                        />
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-blue-500/20 bg-slate-900/40 p-4">
                    <h3 className="text-sm font-semibold text-blue-200 mb-3">
                      Poster Info
                    </h3>
                    <div className="space-y-2 text-sm text-blue-100/90">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{claim.postedBy?.name || "User"}</span>
                      </div>
                      {claim.postedBy?.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{claim.postedBy.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      {claim.postedBy?.email && (
                        <button
                          onClick={() => {
                            const subject = `Claim request for: ${claim.item?.title}`
                            const body = `Hello ${claim.postedBy?.name || ""},\n\nI submitted a claim for your item.\n\nItem: ${claim.item?.title}\nLocation: ${claim.item?.location}\n\nMy identifying details:\n${claim.identifyingDetails}\n\nThank you.`
                            window.location.href = `mailto:${claim.postedBy.email}?subject=${encodeURIComponent(
                              subject
                            )}&body=${encodeURIComponent(body)}`
                          }}
                          className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          Email
                        </button>
                      )}
                      {claim.postedBy?.phone && (
                        <a
                          href={`tel:${claim.postedBy.phone}`}
                          className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm flex items-center gap-2"
                        >
                          <Phone className="w-4 h-4" />
                          Call
                        </a>
                      )}
                      {claim.postedBy?._id && (
                        <button
                          onClick={() => navigate(`/chat/${claim.postedBy._id}`)}
                          className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm flex items-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Message
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-blue-500/20 bg-slate-900/40 p-4">
                    <h3 className="text-sm font-semibold text-blue-200 mb-3">
                      Your Claim Details
                    </h3>
                    <div className="space-y-2 text-sm text-blue-100/90">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 mt-0.5" />
                        <span>{claim.identifyingDetails}</span>
                      </div>
                      {claim.lostLocation && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>Lost at: {claim.lostLocation}</span>
                        </div>
                      )}
                      {claim.lostDate && (
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4" />
                          <span>
                            Lost date: {new Date(claim.lostDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {claim.itemImage && (
                        <img
                          src={claim.itemImage}
                          alt="claim"
                          className="mt-2 max-h-36 rounded-lg border border-blue-500/20 object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-blue-200/70">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Requested: {new Date(claim.createdAt).toLocaleDateString()}
                  </span>
                  {claim.score !== null && (
                    <span className="flex items-center gap-1">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      Score: {claim.score}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyClaim
