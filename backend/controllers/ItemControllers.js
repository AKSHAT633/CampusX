import Item from "../models/Item.js";
import User from "../models/User.Models.js";
import ClaimedModel from "../models/claimed.models.js";
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

export const createItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      type,
      location,
      date,
    } = req.body;

    if (!title || !description || !category || !type || !location || !date) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const images = [];
    if (req.file) {
      images.push(req.file.path); // cloudinary / multer path
    }

    const item = await Item.create({
      title,
      description,
      category,
      type,
      location,
      date,
      images,
      postedBy: req.userId,
    });

    res.status(201).json({
      message: "Item posted successfully",
      item,
    });
  } catch (error) {
    console.error("Create Item Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId

    const item = await Item.findById(id)
    if (!item) return res.status(404).json({ message: 'Item not found' })
    if (String(item.postedBy) !== String(userId)) return res.status(403).json({ message: 'Not allowed' })

    const { title, description, category, type, location, date } = req.body
    if (typeof title === 'string') item.title = title.trim()
    if (typeof description === 'string') item.description = description.trim()
    if (typeof category === 'string') item.category = category
    if (typeof type === 'string') item.type = type
    if (typeof location === 'string') item.location = location
    if (date) item.date = new Date(date)

    if (req.file) {
      const url = req.file.path || req.file.secure_url || req.file.url || req.file.filename
      if (url) item.images.push(url)
    }

    await item.save()
    return res.status(200).json({ message: 'Item updated', item })
  } catch (error) {
    console.error('Update item error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId

    const item = await Item.findById(id)
    if (!item) return res.status(404).json({ message: 'Item not found' })
    if (String(item.postedBy) !== String(userId)) return res.status(403).json({ message: 'Not allowed' })

    // delete images from cloudinary if present
    if (Array.isArray(item.images) && item.images.length > 0) {
      for (const img of item.images) {
        try {
          const publicId = getPublicIdFromUrl(img)
          if (publicId) await cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
        } catch (err) {
          console.error('Cloudinary delete error for', img, err)
        }
      }
    }

    await Item.findByIdAndDelete(id)
    return res.status(200).json({ message: 'Item deleted' })
  } catch (error) {
    console.error('Delete item error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("postedBy", "name email ProfileImage") // adjust fields if needed
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    console.error("Get items error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch items",
    });
  }
};

export const createClaimRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { identifyingDetails, lostLocation, lostDate } = req.body;

    if (!identifyingDetails) {
      return res.status(400).json({
        message: "Identifying details are required",
      });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const itemImage = req.file?.path || "";

    const claim = await ClaimedModel.create({
      item: item._id,
      postedBy: item.postedBy,
      claimant: req.userId,
      identifyingDetails,
      lostLocation,
      lostDate: lostDate ? new Date(lostDate) : undefined,
      itemImage,
      status: "pending",
    });

    return res.status(201).json({
      message: "Claim submitted successfully",
      claim,
    });
  } catch (error) {
    console.error("Create claim error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getClaimRequests = async (req, res) => {
  try {
    const claims = await ClaimedModel.find({ postedBy: req.userId })
      .populate("item", "title category location date status images")
      .populate("claimant", "name email ProfileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: claims.length,
      claims,
    });
  } catch (error) {
    console.error("Get claim requests error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch claim requests",
    });
  }
};

export const updateClaimScore = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, rejectReason } = req.body;

    if (score === undefined || score === null) {
      return res.status(400).json({ message: "Score is required" });
    }

    const parsedScore = Number(score);
    if (Number.isNaN(parsedScore) || parsedScore < 0 || parsedScore > 100) {
      return res
        .status(400)
        .json({ message: "Score must be between 0 and 100" });
    }

    const claim = await ClaimedModel.findById(id);
    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    if (String(claim.postedBy) !== String(req.userId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    claim.score = parsedScore;
    claim.status = parsedScore >= 60 ? "approved" : "rejected";
    if (claim.status === "rejected") {
      claim.rejectReason = (rejectReason || "").toString();
    } else {
      claim.rejectReason = "";
    }
    await claim.save();

    return res.status(200).json({
      message: "Score updated successfully",
      claim,
    });
  } catch (error) {
    console.error("Update claim score error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMyClaims = async (req, res) => {
  try {
    const claims = await ClaimedModel.find({ claimant: req.userId })
      .populate("item", "title category location date status images")
      .populate("postedBy", "name email phone ProfileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: claims.length,
      claims,
    });
  } catch (error) {
    console.error("Get my claims error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch my claims",
    });
  }
};
