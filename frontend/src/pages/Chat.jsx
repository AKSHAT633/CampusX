import React from "react"

import ChatMessageInput from "../components/ChatMessageInput"
import ChatMessages from "../components/ChatMessages"
import MessageSideBar from "../components/MessageSideBar"

const Chat = () => {
  return (
    <div className="h-screen flex overflow-hidden">
      
      {/* LEFT SIDEBAR */}
      <MessageSideBar />

      {/* RIGHT CHAT AREA */}
      <div className="flex-1 flex flex-col">
        <ChatMessages />
        <ChatMessageInput />
      </div>

    </div>
  )
}

export default Chat