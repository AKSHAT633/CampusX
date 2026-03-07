import React from 'react'
import { useTheme } from '../context/ThemeContext'

const AIInterviewPage = () => {
  const { isDark } = useTheme()

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${
        isDark
          ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950'
          : 'bg-gradient-to-br from-white via-blue-50 to-white'
      }`}
    >
      <div className="text-center max-w-xl">
        <h1
          className={`text-3xl sm:text-4xl font-bold mb-3 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          AI Interview
        </h1>
        <p
          className={`text-base sm:text-lg ${
            isDark ? 'text-blue-200' : 'text-slate-600'
          }`}
        >
          Coming very soon.
        </p>
      </div>
    </div>
  )
}

export default AIInterviewPage
