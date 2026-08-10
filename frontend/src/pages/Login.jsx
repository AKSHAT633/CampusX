import React, { useState } from "react"
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "../utils/firebase"
import toast from "react-hot-toast"
import axios from "axios"
import { serverUrl } from "../main"
import { useDispatch } from "react-redux"
import { setUserData } from "../redux/userSlice"
import { useTheme } from "../context/ThemeContext"
import logo from "../assets/logo.png"

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isDark } = useTheme()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // For Google new-user phone modal
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [pendingGoogleUser, setPendingGoogleUser] = useState(null)

  const [formData, setFormData] = useState({ email: "", password: "" })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  /* ---------- LOGIN ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(`${serverUrl}/api/user/login`, formData, { withCredentials: true })
      dispatch(setUserData(res.data.user))
      toast.success("Welcome back!")
      navigate("/")
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Check your email and password.")
    } finally {
      setLoading(false)
    }
  }

  /* ---------- GOOGLE ---------- */
  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      const response = await signInWithPopup(auth, provider)
      const { user } = response

      try {
        // Try logging in first
        const res = await axios.post(
          `${serverUrl}/api/user/google-login`,
          { email: user.email },
          { withCredentials: true }
        )
        dispatch(setUserData(res.data.user))
        toast.success("Logged in with Google!")
        navigate("/")
      } catch (loginErr) {
        if (loginErr.response?.status === 404) {
          // New user — ask for phone number via modal
          setPendingGoogleUser(user)
          setShowPhoneModal(true)
          setLoading(false)
        } else {
          throw loginErr
        }
      }
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Popup closed. Try again.")
      } else if (error.code === "auth/popup-blocked") {
        toast.error("Popup blocked by browser. Allow popups for this site and retry.")
      } else if (error.code === "auth/cancelled-popup-request") {
        // silently ignore duplicate popup requests
      } else {
        toast.error(error.response?.data?.message || error.message || "Google login failed")
      }
      setLoading(false)
    }
  }

  /* ---------- COMPLETE GOOGLE REGISTER ---------- */
  const handleCompleteGoogleRegister = async () => {
    if (!phoneNumber.trim()) {
      toast.error("Phone number is required")
      return
    }
    try {
      setLoading(true)
      const regRes = await axios.post(
        `${serverUrl}/api/user/google-register`,
        {
          name: pendingGoogleUser.displayName || pendingGoogleUser.email.split("@")[0],
          email: pendingGoogleUser.email,
          phone: phoneNumber,
        },
        { withCredentials: true }
      )
      dispatch(setUserData(regRes.data.user))
      toast.success("Account created! Welcome to CampusX 🎉")
      setShowPhoneModal(false)
      navigate("/")
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  /* ---------- THEME ---------- */
  const pageBg = isDark
    ? "bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950"
    : "bg-gradient-to-br from-emerald-50 via-white to-teal-50"

  const cardBg = isDark
    ? "bg-slate-900/80 border-emerald-500/20"
    : "bg-white border-slate-200"

  const labelColor = isDark ? "text-slate-300" : "text-slate-700"

  const inputBg = isDark
    ? "bg-slate-800/70 border-emerald-500/20 text-white placeholder:text-slate-500 focus:border-emerald-400"
    : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500"

  const dividerBg = isDark ? "bg-slate-900" : "bg-white"
  const dividerText = isDark ? "text-slate-500" : "text-slate-400"

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 sm:py-10 ${pageBg}`}>
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl shadow-2xl p-6 sm:p-8 border backdrop-blur-xl ${cardBg}`}
        >
          {/* HEADER */}
          <div className="text-center mb-6 sm:mb-8">
            <img src={logo} alt="CampusX" className="w-14 h-14 mx-auto mb-3 rounded-xl" />
            <h1 className={`text-2xl sm:text-3xl font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
              Welcome back!
            </h1>
            <p className={`${labelColor} text-sm sm:text-base`}>
              Log in to continue to <span className="text-emerald-500 font-semibold">CampusX</span>
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* EMAIL */}
            <div>
              <label className={`text-sm font-semibold mb-2 block ${labelColor}`}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@email.com"
                className={`w-full px-4 py-3 rounded-xl border outline-none transition ${inputBg}`}
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className={`text-sm font-semibold mb-2 block ${labelColor}`}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-xl border pr-12 outline-none transition ${inputBg}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* LOGIN BTN */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="relative my-6">
            <div className={`border-t ${isDark ? "border-emerald-500/20" : "border-slate-200"}`}></div>
            <span className={`absolute left-1/2 -translate-x-1/2 -top-3 px-3 text-xs ${dividerText} ${dividerBg}`}>
              OR CONTINUE WITH
            </span>
          </div>

          {/* GOOGLE BTN */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`w-full py-3 rounded-xl flex items-center justify-center gap-3 border font-medium transition hover:opacity-80 disabled:opacity-60 ${
              isDark
                ? "border-emerald-500/30 text-white bg-white/5"
                : "border-slate-300 text-slate-800 bg-white hover:bg-slate-50"
            }`}
          >
            <FaGoogle className="text-emerald-500 text-lg" />
            {loading ? "Connecting..." : "Continue with Google"}
          </button>

          {/* SIGNUP LINK */}
          <p className={`text-center text-sm mt-6 ${labelColor}`}>
            Don't have an account?{" "}
            <Link to="/register" className="text-emerald-500 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>

      {/* PHONE NUMBER MODAL (for new Google users) */}
      <AnimatePresence>
        {showPhoneModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-sm rounded-2xl p-6 border shadow-2xl ${cardBg}`}
            >
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaGoogle className="text-white text-lg" />
                </div>
                <h2 className={`text-xl font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                  One more thing!
                </h2>
                <p className={`text-sm ${labelColor}`}>
                  Enter your phone number to complete your CampusX account.
                </p>
              </div>

              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 98765 43210"
                className={`w-full px-4 py-3 rounded-xl border outline-none transition mb-4 ${inputBg}`}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowPhoneModal(false); setPendingGoogleUser(null) }}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-medium ${
                    isDark ? "border-slate-600 text-slate-300 hover:bg-slate-800" : "border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompleteGoogleRegister}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold disabled:opacity-60"
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Login