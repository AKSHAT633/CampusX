import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
    conversations: [],
    selectedUser: null,
    onlineUsers: [],
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const {
  setMessages,
  addMessage,
  setConversations,
  setSelectedUser,
  setOnlineUsers,
} = messageSlice.actions;

export default messageSlice.reducer;
