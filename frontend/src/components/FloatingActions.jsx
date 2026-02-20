// components/FloatingActions.jsx
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Package, BookOpen, ShoppingBag } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const FloatingActions = () => {
  const [open, setOpen] = useState(false)
  const [sellOpen, setSellOpen] = useState(false)
  const location = useLocation()

  // 👉 CLOSE ALL WHEN ROUTE CHANGES
  useEffect(() => {
    setOpen(false)
    setSellOpen(false)
  }, [location.pathname])

  const toggleMain = () => {
    setOpen(!open)
    setSellOpen(false)
  }

  const toggleSell = () => {
    setSellOpen(!sellOpen)
    setOpen(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* SELL FAB */}
      <SellFab sellOpen={sellOpen} toggleSell={toggleSell} />

      {/* ACTIONS */}
      <AnimatePresence>
        {open && (
          <>
            <ActionBtn
              to="/lost-found/add"
              label="Post Lost Item"
              icon={Package}
              delay={0.1}
            />
          </>
        )}
      </AnimatePresence>

      {/* MAIN FAB */}
      <motion.button
        onClick={toggleMain}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/40 flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <Plus size={26} />
        </motion.div>
      </motion.button>
    </div>
  )
}

export default FloatingActions


/* ================= SELL FAB ================= */
const SellFab = ({ sellOpen, toggleSell }) => (
  <div className="relative flex items-center">

    <AnimatePresence>
      {sellOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.8 }}
          className="absolute right-16 px-3 py-1.5 rounded-lg bg-slate-900 text-emerald-300 text-sm shadow-lg border border-emerald-500/30 whitespace-nowrap"
        >
          Sell Item
        </motion.div>
      )}
    </AnimatePresence>

    <Link to="/sell/add">
      <motion.button
        onClick={toggleSell}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/40 flex items-center justify-center"
      >
        <ShoppingBag size={24} />
      </motion.button>
    </Link>
  </div>
)


/* ================= ACTION BUTTON ================= */
const ActionBtn = ({ to, label, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: 40, scale: 0.8 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    exit={{ opacity: 0, x: 40, scale: 0.8 }}
    transition={{ delay }}
  >
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/90 border border-blue-500/30 backdrop-blur-xl shadow-lg hover:bg-blue-500/10 transition"
    >
      <Icon className="w-4 h-4 text-blue-400" />
      <span className="text-sm text-blue-200 whitespace-nowrap">
        {label}
      </span>
    </Link>
  </motion.div>
)
