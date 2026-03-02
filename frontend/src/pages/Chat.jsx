import React from "react"
import { useDispatch, useSelector } from "react-redux"
import ChatMessages from "../components/ChatMessages"
import MessageSideBar from "../components/MessageSideBar"

const Chat = () => {
  const { selectedUser } = useSelector((state) => state.message)
  const dispatch = useDispatch();

  

  return (
    <div className="h-[85vh] lg:p-10 flex rounded-lg overflow-hidden">
      
      {/* LEFT SIDEBAR - Show on desktop always, on mobile only when no user selected */}
      <div className={`${selectedUser ? 'hidden' : 'block'} lg:block`}>
        <MessageSideBar />
      </div>

      {/* CHAT MESSAGES - Show on desktop always, on mobile only when user selected */}
      <div className={`flex-1 flex-col ${selectedUser ? 'flex' : 'hidden lg:flex'}`}>
        <ChatMessages />
      </div>

    </div>
  )
}

export default Chat