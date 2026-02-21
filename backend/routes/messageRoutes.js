import express from "express";
import upload from "../middlewares/multer.js";
import { sendMessage, showMessage } from "../controllers/messageController.js";
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
  showMessage
);

export default messageRouter;