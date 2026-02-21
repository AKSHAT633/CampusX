import UserModel from "../models/User.Models.js";
import cloudinary from "../config/cloudinary.js";

const getPublicIdFromUrl = (url) => {
  if (!url) return null
  const uploadIndex = url.indexOf('/upload/')
  let publicId = url
  if (uploadIndex !== -1) {
    publicId = url.substring(uploadIndex + '/upload/'.length)
    publicId = publicId.replace(/^v[0-9]+\//, '')
    publicId = publicId.replace(/\.[^/.]+$/, '')
  } else {
    publicId = publicId.replace(/\.[^/.]+$/, '')
  }
  return publicId
}

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

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone, ProfileImage } = req.body;

    const update = {};

    if (typeof name === "string") {
      const trimmed = name.trim();
      if (!trimmed) {
        return res.status(400).json({ message: "Name cannot be empty" });
      }
      update.name = trimmed;
    }

    if (typeof phone === "string") {
      const trimmed = phone.trim();
      if (!trimmed) {
        return res.status(400).json({ message: "Phone cannot be empty" });
      }
      update.phone = trimmed;
    }

    if (req.file) {
      update.ProfileImage = req.file.path || req.file.secure_url || req.file.url || req.file.filename || ''
    } else if (typeof ProfileImage === "string") {
      const trimmed = ProfileImage.trim();
      if (trimmed === "") {
        update.ProfileImage = "";
      } else {
        update.ProfileImage = trimmed;
      }
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const user = await UserModel.findByIdAndUpdate(userId, update, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteProfileImage = async (req, res) => {
  try {
    const userId = req.userId
    const { url } = req.body || {}

    const user = await UserModel.findById(userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const imageUrl = (url && url.trim()) || user.ProfileImage
    if (!imageUrl) return res.status(400).json({ message: 'No profile image to delete' })

    const publicId = getPublicIdFromUrl(imageUrl)
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
      } catch (err) {
        console.error('Cloudinary delete error:', err)
      }
    }

    user.ProfileImage = ''
    await user.save()

    return res.status(200).json({ message: 'Profile image removed' })
  } catch (error) {
    console.error('Delete profile image error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}
