import express from "express";
import { upload } from "../middlewares/multer.js";
import { getSelectedUserInformation, sendMessage, getMessage, getConversations, getAllUsers } from "../controllers/messageController.js";
import { isAuth } from "../middlewares/isAuth.js";


const messageRouter = express.Router();

messageRouter.post(
  "/send/:receiverId",
  isAuth,
  upload.single("image"),
  sendMessage
);

messageRouter.get(
  "/get/:receiverId",
  isAuth,
  getMessage
);

messageRouter.get("/getalluser",isAuth,getAllUsers);

messageRouter.get("/select-user-info/:id", isAuth, getSelectedUserInformation);

messageRouter.get("/conversations", isAuth, getConversations);

export default messageRouter;