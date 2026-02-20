import React, { useEffect, useState } from "react"
import axios from "axios"
import { serverUrl } from "../main"
import { motion } from "framer-motion"
import { CalendarDays, MapPin, User, BadgeCheck, FileText } from "lucide-react"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { fetchClaimRequests } from "../servers/api"

const ClaimRequestPages = () => {
  const dispatch = useDispatch()
  const { claimData } = useSelector((state) => state.claim)
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [scoreInputs, setScoreInputs] = useState({})
  const [reasonInputs, setReasonInputs] = useState({})

  useEffect(() => {
    const load = async () => {
      try {
        await fetchClaimRequests(dispatch)
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to load claim requests"
        )
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [dispatch])

  useEffect(() => {
    setClaims(claimData || [])
    const initialScores = {}
    ;(claimData || []).forEach((c) => {
      if (c.score !== null && c.score !== undefined) {
        initialScores[c._id] = c.score
      }
    })
    setScoreInputs(initialScores)
  }, [claimData])

  const handleReasonChange = (id, value) => {
    setReasonInputs((prev) => ({ ...prev, [id]: value }))
  }

  const handleScoreChange = (id, value) => {
    setScoreInputs((prev) => ({ ...prev, [id]: value }))
  }

  const handleSaveScore = async (id) => {
    try {
      const rawScore = scoreInputs[id]
      if (rawScore === undefined || rawScore === null || rawScore === "") {
        toast.error("Please enter a score between 0 and 100")
        return
      }

      const score = Number(rawScore)
      if (Number.isNaN(score) || score < 0 || score > 100) {
        toast.error("Score must be between 0 and 100")
        return
      }

      const payload = { score }
      if (score < 60) {
        payload.rejectReason = reasonInputs[id] || ""
      }

      await axios.patch(
        `${serverUrl}/api/item/claim/${id}/score`,
        payload,
        { withCredentials: true }
      )
      toast.success("Score updated")
      setClaims((prev) =>
        prev.map((c) => (c._id === id ? { ...c, score } : c))
      )
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update score"
      )
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-blue-950 to-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Claim <span className="text-blue-400">Requests</span>
          </h1>
          <p className="text-blue-200/80 text-sm mt-1">
            Review requests for items you posted
          </p>
        </div>

        {loading && (
          <div className="text-blue-200/70">Loading requests...</div>
        )}

        {!loading && claims.length === 0 && (
          <div className="text-blue-300/70">No claim requests yet.</div>
        )}

        <div className="grid gap-6">
          {claims.map((claim) => (
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
                {/* POSTED ITEM INFO */}
                <div className="rounded-xl border border-blue-500/20 bg-slate-900/40 p-4">
                  <h3 className="text-sm font-semibold text-blue-200 mb-3">
                    Your Posted Item Info
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
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="w-4 h-4" />
                      <span>Status: {claim.item?.status || "-"}</span>
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

                {/* CLAIMANT INFO */}
                <div className="rounded-xl border border-blue-500/20 bg-slate-900/40 p-4">
                  <h3 className="text-sm font-semibold text-blue-200 mb-3">
                    Claimant Info
                  </h3>
                  <div className="space-y-2 text-sm text-blue-100/90">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{claim.claimant?.name || "User"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>Lost at: {claim.lostLocation || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      <span>
                        Lost date: {claim.lostDate ? new Date(claim.lostDate).toLocaleDateString() : "-"}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 mt-0.5" />
                      <span>{claim.identifyingDetails}</span>
                    </div>
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

              {/* SCORE INPUT */}
              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Score (0-100)"
                    value={scoreInputs[claim._id] ?? ""}
                    onChange={(e) => handleScoreChange(claim._id, e.target.value)}
                    disabled={claim.status !== 'pending'}
                    className="w-40 px-3 py-2 rounded-lg bg-slate-900 border border-blue-500/20 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {Number(scoreInputs[claim._id]) < 60 && claim.status === 'pending' && (
                    <input
                      type="text"
                      placeholder="Reason for rejection"
                      value={reasonInputs[claim._id] ?? ""}
                      onChange={(e) => handleReasonChange(claim._id, e.target.value)}
                      className="flex-1 min-w-[220px] px-3 py-2 rounded-lg bg-slate-900 border border-blue-500/20 text-white"
                    />
                  )}
                  <button
                    onClick={() => handleSaveScore(claim._id)}
                    disabled={claim.status !== 'pending'}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Score
                  </button>
                </div>
                <div className="text-xs text-blue-200/70 space-y-1">
                  <p>Give a score based on how well the claim matches your posted item.</p>
                  <p className="text-blue-300/80 font-medium">
                    ✓ Score ≥60 = Auto-Approved | Score &lt;60 = Auto-Rejected
                  </p>
                  {claim.status !== 'pending' && (
                    <p className="text-yellow-400/90">
                      Score already submitted. Cannot edit after submission.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ClaimRequestPages
