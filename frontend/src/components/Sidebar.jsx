import React from "react"
import { motion } from "framer-motion"
import {
  Pin,
  Star,
  FireExtinguisher,
  FileQuestionMark
} from "lucide-react"

const Sidebar = ({ result }) => {
  if (
    !result ||
    !result.subTopics ||
    !result.questions?.short ||
    !result.questions?.long
  ) {
    return null
  }

  return (
    <div className="space-y-6 text-sm text-blue-100">
      {/* HEADER */}
      <div className="flex items-center gap-2 text-blue-300 font-semibold text-base">
        <Pin className="w-4 h-4" />
        Quick Exam View
      </div>

      {/* SUBTOPICS */}
      <section>
        <div className="flex items-center gap-2 text-blue-200 mb-2 font-medium">
          <Star className="w-4 h-4" />
          Sub Topics (Priority)
        </div>

        <div className="space-y-3">
          {Object.entries(result.subTopics).map(([star, topics]) => (
            <motion.div
              key={star}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-lg bg-white/5 border border-blue-500/20 p-3"
            >
              <p className="text-blue-300 font-medium mb-1">
                {star} Priority
              </p>

              <ul className="space-y-1 list-disc list-inside text-blue-100/90">
                {topics.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* IMPORTANCE */}
      <section className="rounded-lg bg-white/5 border border-blue-500/20 p-3">
        <div className="flex items-center gap-2 text-blue-200 mb-2 font-medium">
          <FireExtinguisher className="w-4 h-4" />
          Exam Importance
        </div>

        <span className="inline-block mb-3 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-semibold">
          {result.importance}
        </span>
      

    
        <div className="flex items-center gap-2 text-blue-200 mb-2 font-medium">
          <FileQuestionMark className="w-4 h-4" />
          Important Questions
        </div>

        <div className="space-y-3">
          {/* SHORT */}
          <div className="rounded-lg bg-white/5 border border-blue-500/20 p-3">
            <p className="text-blue-300 font-medium mb-1">
              Short question
            </p>
            <ul className="list-disc list-inside space-y-1">
              {result.questions.short.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>

          {/* LONG */}
          <div className="rounded-lg bg-white/5 border border-blue-500/20 p-3">
            <p className="text-blue-300 font-medium mb-1">
              Long question
            </p>
            <ul className="list-disc list-inside space-y-1">
              {result.questions.long.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg bg-white/5 border border-blue-500/20 p-3">
            <p className="text-blue-300 font-medium mb-1">
              Diagram question
            </p>
            <ul>
              <li>{result.questions.diagram}</li>
            </ul>
            
          </div>
        </div>
      </section>
    </div>
  )
}

export default Sidebar
