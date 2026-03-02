import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
    conversations: [],
    selectedUser: null,
    onlineUsers: [],
    getAllUser:[],
    socket:null,
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
    setAllUser:(state,action)=>{
      state.getAllUser =action.payload;
    },
    setSocket:(state,action)=>{
      state.socket = action.payload
    }
    

  },
});

export const {
  setMessages,
  addMessage,
  setConversations,
  setSelectedUser,
  setOnlineUsers,
  setAllUser,
  setSocket
} = messageSlice.actions;

export default messageSlice.reducer;
