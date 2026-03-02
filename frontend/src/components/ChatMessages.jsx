import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MessageCircle, ArrowLeft, Image, Smile, Send } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import { serverUrl } from "../main";
import { setMessages, setSelectedUser } from "../redux/messageSlice";
import { io } from "socket.io-client";

const ChatMessages = () => {
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);
  const { selectedUser, messages = [], onlineUsers = [] } = useSelector(
    (state) => state.message
  );

  const [input, setInput] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);

  const imageRef = useRef(null);
  const endRef = useRef(null);

  const firstLetter = selectedUser?.name?.charAt(0)?.toUpperCase() || "U";
  const isOnline = onlineUsers?.includes(selectedUser?._id);

  /* ================= IMAGE ================= */
  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFrontendImage(URL.createObjectURL(file));
    setBackendImage(file);
  };

  /* ================= SEND MESSAGE ================= */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!backendImage && !input.trim()) return;

    try {
      const formData = new FormData();
      if (input.trim()) formData.append("message", input.trim());
      if (backendImage) formData.append("image", backendImage);

      const res = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser?._id}`,
        formData,
        { withCredentials: true }
      );

      const newMessage = res?.data?.data;

      if (newMessage) {
        dispatch(setMessages([...messages, newMessage]));
      }

      setInput("");
      setFrontendImage(null);
      setBackendImage(null);

      if (imageRef.current) imageRef.current.value = "";
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  /* ================= EMOJI ================= */
  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + (emojiData?.emoji ?? ""));
  };

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SOCKET LISTENER FOR REAL-TIME MESSAGES ================= */
  useEffect(() => {
    if (!userData?._id || !selectedUser?._id) return;

    const socket = io(serverUrl, {
      query: {
        userId: userData._id,
      },
    });

    socket.on("newMessage", (newMessage) => {
      // Check if the message is for the currently selected conversation
      const isFromSelectedUser = 
        newMessage.sender._id === selectedUser._id || newMessage.sender === selectedUser._id;

      if (isFromSelectedUser) {
        dispatch(setMessages([...messages, newMessage]));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userData?._id, selectedUser?._id, dispatch, messages]);

  /* ================= FETCH MESSAGES ================= */
  useEffect(() => {
    if (!selectedUser?._id) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/message/get/${selectedUser._id}`,
          { withCredentials: true }
        );

        dispatch(setMessages(res.data.data || []));
      } catch (err) {
        console.error("Fetch messages error:", err);
      }
    };

    fetchMessages();
  }, [selectedUser?._id, dispatch]);

  return (
    <div className="lg:w-[70vw] w-full h-[100dvh] flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {selectedUser ? (
        <>
          {/* ================= HEADER ================= */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="flex items-center gap-3">
              {/* Back button mobile */}
              <button
                onClick={() => dispatch(setSelectedUser(null))}
                className="lg:hidden text-white hover:bg-white/10 p-2 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Avatar */}
              <div className="relative">
                {selectedUser.profileImage ? (
                  <img
                    src={selectedUser.profileImage}
                    alt={selectedUser.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 font-semibold border-2 border-white">
                    {firstLetter}
                  </div>
                )}

                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>

              {/* Name */}
              <div>
                <p className="font-semibold text-white">
                  {selectedUser.name}
                </p>
                <p
                  className={`text-xs ${
                    isOnline ? "text-green-200" : "text-gray-200"
                  }`}
                >
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          </div>

          {/* ================= MESSAGES ================= */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900/50 space-y-3">
            {messages.map((msg) => {
              const isSender =
                msg?.sender?._id === userData?._id ||
                msg?.sender === userData?._id;

              return (
                <div
                  key={msg._id}
                  className={`flex ${
                    isSender ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      isSender
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="message"
                        className="rounded-lg mb-2 max-h-60 object-cover"
                      />
                    )}

                    {msg.message && (
                      <p className="text-sm break-words">
                        {msg.message}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            <div ref={endRef} />
          </div>

          {/* ================= INPUT ================= */}
          <div className="flex-shrink-0 p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="relative">
              {/* Emoji Picker */}
              {showPicker && (
                <div className="absolute bottom-16 left-0 z-20">
                  <EmojiPicker
                    width={300}
                    height={400}
                    onEmojiClick={onEmojiClick}
                    theme="auto"
                  />
                </div>
              )}

              {/* Image Preview */}
              {frontendImage && (
                <div className="mb-2 relative inline-block">
                  <img
                    src={frontendImage}
                    alt="preview"
                    className="w-32 h-32 rounded-lg object-cover border-2 border-blue-500"
                  />

                  <button
                    onClick={() => {
                      setFrontendImage(null);
                      setBackendImage(null);
                      if (imageRef.current)
                        imageRef.current.value = "";
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2"
              >
                {/* Emoji */}
                <button
                  type="button"
                  onClick={() =>
                    setShowPicker((prev) => !prev)
                  }
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <Smile className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>

                {/* File input */}
                <input
                  type="file"
                  hidden
                  ref={imageRef}
                  accept="image/*"
                  onChange={handleImage}
                />

                {/* Upload btn */}
                <button
                  type="button"
                  onClick={() =>
                    imageRef.current?.click()
                  }
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <Image className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>

                {/* Text */}
                <input
                  type="text"
                  value={input}
                  onChange={(e) =>
                    setInput(e.target.value)
                  }
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100"
                />

                {/* Send */}
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </>
      ) : (
        /* NO USER */
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center mb-4">
            <MessageCircle className="w-10 h-10 text-blue-500 dark:text-blue-400" />
          </div>

          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Select a conversation
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
            Choose a user from the sidebar to start chatting
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;