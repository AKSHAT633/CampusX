import React, { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Image as ImageIcon, X, Smile } from "lucide-react"
import EmojiPicker from "emoji-picker-react"

const ChatMessageInput = ({ onSend }) => {
  const [message, setMessage] = useState("")
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [showEmoji, setShowEmoji] = useState(false)

  const fileRef = useRef(null)

  /* ---------- IMAGE ---------- */
  const handleImage = (file) => {
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    setImage(null)
    setPreview(null)
  }

  /* ---------- EMOJI ---------- */
  const addEmoji = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji)
  }

  /* ---------- SEND ---------- */
  const handleSend = () => {
    if (!message && !image) return

    const payload = {
      text: message,
      image,
    }

    onSend?.(payload)

    setMessage("")
    removeImage()
    setShowEmoji(false)
  }

  return (
    <div className="w-full">
      {/* IMAGE PREVIEW */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-3 relative inline-block"
          >
            <img
              src={preview}
              alt="preview"
              className="w-40 h-32 object-cover rounded-xl border border-blue-500/20"
            />

            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INPUT BAR */}
      <div className="flex items-center gap-2 bg-slate-900/80 border border-blue-500/20 rounded-2xl px-3 py-2">

        {/* EMOJI */}
        <button
          onClick={() => setShowEmoji((p) => !p)}
          className="text-blue-300 hover:text-blue-200"
        >
          <Smile size={20} />
        </button>

        {/* IMAGE */}
        <button
          onClick={() => fileRef.current.click()}
          className="text-blue-300 hover:text-blue-200"
        >
          <ImageIcon size={20} />
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImage(e.target.files[0])}
        />

        {/* TEXT */}
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-transparent outline-none text-blue-100 placeholder-blue-300/50"
        />

        {/* SEND */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
        >
          <Send size={18} />
        </motion.button>
      </div>

      {/* EMOJI PICKER */}
      <AnimatePresence>
        {showEmoji && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3"
          >
            <EmojiPicker
              theme="dark"
              onEmojiClick={addEmoji}
              height={350}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ChatMessageInput