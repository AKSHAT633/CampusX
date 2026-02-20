import React, { useState, useRef, useEffect } from "react"
import logo from "../assets/logo.png"
import { Diamond, Plus, X, FileText } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import TopicForm from "../components/TopicForm"
import { useSelector } from "react-redux"
import Sidebar from "../components/Sidebar"
import FinalResult from "../components/FinalResult"

const Notes = () => {
  const [open, setOpen] = useState(false)
  const popupRef = useRef(null)
  const { userData } = useSelector((state) => state.user)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState(null)

  useEffect(() => {
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">

      {/* NAVBAR */}
      <header className="w-full border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="ExamNotes" className="w-8 h-8" />
            <div>
              <h1 className="text-white font-semibold">
                Exam<span className="text-blue-400">Notes</span>
              </h1>
              <p className="text-xs text-blue-200/80">
                AI-powered exam-oriented notes
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ y: -2, scale: 1.05 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-blue-500/20 text-blue-200"
            >
              <FileText className="w-4 h-4" />
              Your Notes
            </motion.button>

            <div className="relative flex items-center gap-2">
              <Diamond className="w-5 h-5 text-cyan-400" />
              <span className="text-blue-300 text-sm font-semibold">
                {userData?.credits}
              </span>

              <motion.button
                whileHover={{ rotate: 90 }}
                onClick={() => setOpen((p) => !p)}
              >
                <Plus className="w-4 h-4 text-blue-400" />
              </motion.button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    ref={popupRef}
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-0 top-10 w-72 bg-slate-900 border border-blue-500/20 rounded-lg p-5"
                  >
                    <button
                      onClick={() => setOpen(false)}
                      className="absolute top-3 right-3 text-gray-400"
                    >
                      <X size={16} />
                    </button>

                    <h3 className="text-white font-semibold mb-2">
                      Buy Credits
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Use credits to generate AI notes, diagrams & PDFs.
                    </p>
                    <button className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                      Buy More Credits
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* FORM */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <TopicForm
          loading={loading}
          setLoading={setLoading}
          setResult={setResult}
          setError={setError}
        />

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            {error}
          </div>
        )}
      </main>

      {/* EMPTY STATE */}
      {!result && (
        <div className="text-center mt-12 text-blue-200/80">
          Your Notes Will Appear Here
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="mt-8 max-w-7xl mx-auto px-4 sm:px-6 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            <div className="lg:col-span-1">
              <div className="sticky top-20 rounded-lg bg-white/5 border border-blue-500/20 p-4">
                <Sidebar result={result.content} />
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="rounded-lg bg-white/5 border border-blue-500/20 p-6">
                <FinalResult result={result.content} />
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default Notes
