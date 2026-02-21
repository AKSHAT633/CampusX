import React, { useState, useRef, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu,
  X,
  Bell,
  Home,
  MapPin,
  BookOpen,
  GraduationCap,
  MessageCircle,
  Sun,
  Moon
} from "lucide-react"
import logo from "../assets/logo.png"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { serverUrl } from "../main"
import toast from "react-hot-toast"
import { setUserData } from "../redux/userSlice"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  
  const [isDark, setIsDark] = useState(true)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileRef = useRef(null)
  const notifRef = useRef(null)
  const { userData } = useSelector((state) => state.user)
  const location = useLocation()

    const handleLogout = async ()=>{
        try {
            const res = await axios.post(`${serverUrl}/api/user/logout`,{},{withCredentials:true});
            dispatch(setUserData(null));
            console.log(res);
            navigate("/login")
            toast.success("logout successfully");

                
    
        } catch (error) {
            toast.error(error)
        }
    }

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Lost & Found", path: "/lost-found", icon: MapPin },
    { name: "MarketPlace", path: "/market", icon: BookOpen },
    { name: "AI  Notes", path: "/study-material", icon: GraduationCap },
    { name: "Chat", path: "/chat", icon: MessageCircle }
  ]

  const firstLetter =
    userData?.name?.charAt(0)?.toUpperCase() || "U"

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-gradient-to-r from-slate-950/95 via-blue-950/95 to-slate-950/95 backdrop-blur-xl border-b border-blue-500/30"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="CampusSync" className="w-10 h-10" />
            <span className="text-lg md:text-xl font-bold">
              <span className="text-white">Campus</span>
              <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-400 bg-clip-text text-transparent">
                Sync
              </span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative group flex items-center gap-2 font-medium transition ${
                    isActive
                      ? "text-blue-300"
                      : "text-gray-300 hover:text-blue-300"
                  }`}
                >
                  <Icon size={16} />
                  {item.name}

                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              )
            })}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2">

            {/* THEME */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg hover:bg-white/5"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-gray-300 hover:text-blue-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-300 hover:text-blue-300" />
              )}
            </button>

            {/* search removed */}

            {/* NOTIFICATION */}
            <button className="relative p-2 rounded-lg hover:bg-white/5">
              <Bell className="w-5 h-5 text-gray-300 hover:text-blue-300" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>

            {/* USER */}
            {userData ? (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold"
                >
                  {userData.profileImage ? (
                    <img
                      src={userData.profileImage}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    firstLetter
                  )}
                </button>

                <AnimatePresence>
                  {showProfile && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-44 bg-slate-900/95 backdrop-blur-xl border border-blue-500/20 rounded-xl shadow-xl overflow-hidden"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-800"
                        onClick={() => setShowProfile(false)}
                      >
                        Profile
                      </Link>


                      <Link
                        to="/item/myclaim"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-800"
                        onClick={() => setShowProfile(false)}
                      >
                        My Claims
                      </Link>
                    
                      <Link
                        to="/item/claim-request"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-800"
                        onClick={() => setShowProfile(false)}
                      >
                        Claim Requests
                      </Link>
                        <Link
                        to="/notes/history"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-800"
                        onClick={() => setShowProfile(false)}
                      >
                        Notes History
                      </Link>

                      {/* LOGOUT */}
                      <button onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 border-t border-red-500/20"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:scale-105 transition"
              >
                Sign Up
              </Link>
            )}

            {/* MOBILE MENU BTN */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-gray-300"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-blue-500/20 bg-slate-950/95 backdrop-blur-xl"
          >
            <div className="px-6 py-4 space-y-3">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-gray-300 hover:text-blue-300"
                  >
                    <Icon size={16} />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* mobile search removed */}
    </motion.nav>
  )
}

export default Navbar
