
import http from "http";
import express from "express";
import { Server } from "socket.io";


const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

export const getSocketId = (recId)=>{
return userSocketMap[recId]
}

io.on("connection", (socket) => {
  console.log("✅ New client connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }



  io.emit("getOnlineUser", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUser", Object.keys(userSocketMap));
  });
});

export { io, server, app };

