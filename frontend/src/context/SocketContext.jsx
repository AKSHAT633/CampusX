// import React, { createContext, useContext, useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import io from "socket.io-client";
// import { setOnlineUsers } from "../redux/messageSlice";
// import { serverUrl } from "../main";

// const SocketContext = createContext();

// export const useSocket = () => {
//   const context = useContext(SocketContext);
//   if (!context) {
//     throw new Error("useSocket must be used within SocketProvider");
//   }
//   return context;
// };

// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const { userData } = useSelector((state) => state.user);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (userData?._id) {
//       const socketConnection = io(`${serverUrl}`, {
//         query: { userId: userData._id },
//       });

//       setSocket(socketConnection);

//       socketConnection.on("getOnlineUser", (onlineUsers) => {
//         dispatch(setOnlineUsers(onlineUsers));
//       });

//       socketConnection.on("connect", () => {
//         console.log("✅ Socket connected:", socketConnection.id);
//       });

//       socketConnection.on("disconnect", () => {
//         console.log("❌ Socket disconnected");
//       });

//       return () => {
//         socketConnection.close();
//         setSocket(null);
//       };
//     } else if (socket) {
//       socket.close();
//       setSocket(null);
//     }
//   }, [userData?._id, dispatch]);

//   return (
//     <SocketContext.Provider value={{ socket }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };
