import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

import image1 from "../assets/LostAndFound.jpg"
import image2 from "../assets/Book.jpg"
import image3 from "../assets/Study.jpg"
import image4 from "../assets/aiImage.png"

const slides = [
  {
    image: image1,
    title: "Lost Something on Campus?",
    subtitle: "Don't panic. Post it here and let other students help you find it.",
    path: "/lost-found"
  },
  {
    image: image2,
    title: "Student Marketplace",
    subtitle: "Buy used books from seniors or sell your old stuff. No middlemen.",
    path: "/market"
  },
  {
    image: image3,
    title: "Quick Study Notes",
    subtitle: "Exams tomorrow? Generate and organize notes quickly so you can actually sleep.",
    path: "/note"
  }
  ,
  {
    image: image4,
    title: "Mock Interviews",
    subtitle: "Practice interviews before the real placement drive. Better safe than sorry.",
    path: "/ai-interview"
  }
]

const HeroSlider = () => {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevIndex(index)
      setIndex((prev) => (prev + 1) % slides.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [index])

  const current = slides[index]
  const prev = slides[prevIndex]

  return (
    <div className="relative w-full lg:h-screen h-[70vh] overflow-hidden ">

      {/* PREVIOUS IMAGE */}
      <motion.img
        key={"prev-" + prevIndex}
        src={prev.image}
        initial={{ x: 0 }}
        animate={{ x: "-100%" }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* CURRENT IMAGE */}
      <motion.img
        key={"curr-" + index}
        src={current.image}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-linear-to-r from-slate-950/80 via-emerald-950/50 to-transparent" />

      {/* TEXT */}
      <div className="relative z-10 h-full flex items-center px-10 md:px-20">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {current.title}
          </h1>

          <p className="text-rose-200 text-lg md:text-xl mb-6">
            {current.subtitle}
          </p>

          <button
            onClick={() => navigate(current.path)}
            className="bg-linear-to-r from-emerald-500 to-teal-600 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:scale-105 transition"
          >
            Explore Now
          </button>
        </motion.div>
      </div>

      {/* DOTS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setPrevIndex(index)
              setIndex(i)
            }}
            className={`w-3 h-3 rounded-full transition ${
              i === index
                ? "bg-emerald-500 scale-125"
                : "bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSlider
