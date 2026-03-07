import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"

import image1 from "../assets/LostAndFound.jpg"
import image2 from "../assets/Book.jpg"
import image3 from "../assets/Study.jpg"

const slides = [
  {
    image: image1,
    title: "Connect Campus Lost & Found",
    subtitle: "Report, search, and recover lost items across your campus instantly"
  },
  {
    image: image2,
    title: "Campus Marketplace",
    subtitle: "Buy, sell, and exchange books and daily-use items with students"
  },
  {
    image: image3,
    title: "AI Smart Notes",
    subtitle: "Create, organize, and access intelligent study notes anytime"
  }
]

const HeroSlider = () => {
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
    <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[100vh] overflow-hidden ">

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
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-blue-950/50 to-transparent" />

      {/* TEXT */}
      <div className="relative z-10 h-full flex items-center px-4 sm:px-10 md:px-20">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-4">
            {current.title}
          </h1>

          <p className="text-blue-200 text-base sm:text-lg md:text-xl mb-4 md:mb-6">
            {current.subtitle}
          </p>

          <button className="bg-gradient-to-r from-blue-500 to-indigo-600 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-white text-sm sm:text-base font-semibold shadow-lg hover:scale-105 transition">
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
                ? "bg-blue-500 scale-125"
                : "bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSlider
