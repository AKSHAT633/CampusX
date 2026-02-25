import Conversation from "../models/Conversation.model.js";
import Message from "../models/message.model.js";
import UserModel from "../models/User.Models.js";
import { getSocketId, io, getOnlineUsersList } from "../socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;
    const { message } = req.body;

    let image = "";
    if (req.file) {
      image =
        req.file.path ||
        req.file.secure_url ||
        req.file.url ||
        req.file.filename ||
        "";
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message,
      image,
    });

    await Conversation.findOneAndUpdate(
      { participants: { $all: [senderId, receiverId] } },
      {
        $setOnInsert: { participants: [senderId, receiverId] },
        $push: { messages: newMessage._id },
      },
      { new: true, upsert: true }
    );
const sokId = getSocketId(receiverId);
    if(sokId){
      io.to(sokId).emit("getMessage", newMessage);
    }

    res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Message creation failed",
    });
  }
};



export const showMessage = async (req,res) => {
  try {
    const senderId = req.userId;
    const { receiverId } = req.params;

    const findMessage = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");
    if (!findMessage) {
      return res.status(200).json({ success: true, messages: [] });
    }
    res.json({ success: true, findMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllConversations = async (req, res) => {
  try {
    const senderId = req.userId;

    const conversations = await Conversation.find({
      participants: { $in: [senderId] },
    })
      .populate("participants", "name")
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 }, limit: 1 },
      })
      .sort({ updatedAt: -1 });

    const formattedConversations = conversations.map((conv) => {
      const otherUser = conv.participants.find((p) => p._id.toString() !== senderId);
      const lastMessage = conv.messages[0];

      return {
        id: otherUser._id,
        name: otherUser.name,
        last: lastMessage?.message || lastMessage?.image ? "Image" : "Start a conversation",
        time: lastMessage ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "now",
      };
    });

    res.json({ success: true, conversations: formattedConversations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getOnlineUsers = async (req, res) => {
  try {
    const onlineUsers = getOnlineUsersList();
    res.json({ success: true, onlineUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    const currentUserId = req.userId;

    if (!searchTerm || searchTerm.trim() === "") {
      return res.json({ success: true, users: [] });
    }

    // Search for users by name (case-insensitive)
    const users = await UserModel.find({
      name: { $regex: searchTerm, $options: "i" },
      _id: { $ne: currentUserId }, // Exclude current user
    }).select("_id name email ProfileImage");

    const onlineUsers = getOnlineUsersList();

    // Add online status to users
    const usersWithOnlineStatus = users.map((user) => ({
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      ProfileImage: user.ProfileImage,
      isOnline: onlineUsers.includes(user._id.toString()),
    }));

    res.json({ success: true, users: usersWithOnlineStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};