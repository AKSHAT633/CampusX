import React from "react"

import ChatMessageInput from "../components/ChatMessageInput"
import ChatMessages from "../components/ChatMessages"
import MessageSideBar from "../components/messageSideBar"

const Chat = () => {
  return (
    <div className=" lg:p-16 h-screen flex overflow-hidden">
      
      {/* LEFT SIDEBAR */}
      <MessageSideBar />

      {/* RIGHT CHAT AREA */}
      {/* <div className="flex-1 flex flex-col">
        <ChatMessages />
        <ChatMessageInput />
      </div> */}

    </div>
  )
}

export default Chat