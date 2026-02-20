import React, { useState, useRef } from 'react'
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../utils/firebase'
import toast from 'react-hot-toast'
import axios from "axios"
import { serverUrl } from '../main'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const phoneInputRef = useRef(null)

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  })

  const [errors, setErrors] = useState({})

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // ================= NORMAL SIGNUP =================
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await axios.post(
        `${serverUrl}/api/user/register`,
        formData,
        { withCredentials: true }
      )
      dispatch(setUserData(res.data.user))
      toast.success('Account created successfully 🎉')

      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
      })

      navigate("/")

    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  // ================= GOOGLE SIGNUP =================
  const handleGoogleSignup = async () => {
    if (!formData.phone.trim()) {
      setErrors({ phone: 'Phone number is required' })
      toast.error('Please enter phone number first')
      phoneInputRef.current?.focus()
      return
    }

    try {
      setLoading(true)

      const response = await signInWithPopup(auth, provider)
      const { user } = response

      const googleData = {
        name: user.displayName || '',
        email: user.email || '',
        phone: formData.phone,
      }

      await axios.post(
        `${serverUrl}/api/user/google-register`,
        googleData,
        { withCredentials: true }
      )

      toast.success('Google signup successful 🎉')

      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
      })

      navigate("/")

    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Google signup failed')
    } finally {
      setLoading(false)
    }
  }

  // ================= ANIMATIONS =================
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-blue-500/30"
        >

          {/* HEADER */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl font-bold">CS</span>
            </div>

            <h1 className="text-3xl font-bold text-blue-300 mb-2">
              Join Campus Sync
            </h1>
            <p className="text-gray-300 text-sm">
              Connect with your campus community
            </p>
          </motion.div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME */}
            <motion.div variants={itemVariants}>
              <label className="text-white text-sm font-semibold mb-2 block">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-blue-500/30 rounded-xl text-white"
                placeholder="John Doe"
              />
            </motion.div>

            {/* PHONE */}
            <motion.div variants={itemVariants}>
              <label className="text-white text-sm font-semibold mb-2 block">
                Phone Number
              </label>
              <input
                ref={phoneInputRef}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white ${
                  errors.phone ? "border-red-500" : "border-blue-500/30"
                }`}
                placeholder="+91XXXXXXXXXX"
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
              )}
            </motion.div>

            {/* EMAIL */}
            <motion.div variants={itemVariants}>
              <label className="text-white text-sm font-semibold mb-2 block">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-blue-500/30 rounded-xl text-white"
                placeholder="you@email.com"
              />
            </motion.div>

            {/* PASSWORD */}
            <motion.div variants={itemVariants}>
              <label className="text-white text-sm font-semibold mb-2 block">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-blue-500/30 rounded-xl text-white pr-12"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </motion.div>

            {/* SIGNUP BUTTON */}
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 rounded-xl mt-4"
            >
              {loading ? "Creating..." : "Create Account"}
            </motion.button>
          </form>

          {/* DIVIDER */}
          <div className="relative my-6">
            <div className="border-t border-blue-500/20"></div>
            <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-slate-950 px-3 text-gray-400 text-xs">
              OR CONTINUE WITH
            </span>
          </div>

          {/* GOOGLE */}
          <motion.button
            variants={itemVariants}
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full border border-blue-500/30 text-white py-3 rounded-xl flex items-center justify-center gap-3"
          >
            <FaGoogle className="text-blue-400" />
            {loading ? "Connecting..." : "Continue with Google"}
          </motion.button>

          {/* LOGIN LINK */}
          <motion.p
            variants={itemVariants}
            className="text-center text-gray-300 text-sm mt-6"
          >
            Already a member?{" "}
            <Link to="/login" className="text-blue-300 font-semibold">
              Login
            </Link>
          </motion.p>

        </motion.div>
      </div>
    </div>
  )
}

export default SignUp
