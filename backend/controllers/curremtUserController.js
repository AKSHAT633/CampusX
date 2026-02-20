import UserModel from "../models/User.Models.js";

export const currentUser = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      user
    });

    

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};
