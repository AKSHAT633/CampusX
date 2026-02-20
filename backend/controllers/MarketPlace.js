import MarketplaceItem from "../models/MarketplaceItem.js"

export const createMarketplaceItem = async (req, res) => {
  try {
    const userId = req.userId

    const {
      title,
      description,
      price,
      category,
      condition,
      location,
    } = req.body

    if (!title || !description || !price || !category) {
      return res.status(400).json({
        message: "Please fill all required fields",
      })
    }

    /* ---------- IMAGES ---------- */
    let images = []

    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => file.path) // cloudinary url
    }

    /* ---------- CREATE ---------- */
    const item = await MarketplaceItem.create({
      title,
      description,
      price,
      category,
      condition,
      location,
      images,
      seller: userId,
    })

    return res.status(201).json({
      message: "Item listed successfully",
      item,
    })
  } catch (error) {
    console.error("Create marketplace item error:", error)
    return res.status(500).json({
      message: "Failed to create item",
    })
  }
}

/* ---------- GET ALL ITEMS ---------- */
export const getAllMarketplaceItems = async (req, res) => {
  try {
    const { category, status, search } = req.query

    /* ---------- BUILD FILTER ---------- */
    let filter = { isActive: true }

    if (category && category !== "all") {
      filter.category = category
    }

    if (status && status !== "all") {
      filter.status = status
    }

    if (search) {
      filter.$text = { $search: search }
    }

    /* ---------- FETCH ITEMS ---------- */
    const items = await MarketplaceItem.find(filter)
      .populate("seller", "name email")
      .sort({ createdAt: -1 })
      .lean()

    return res.status(200).json({
      success: true,
      count: items.length,
      items,
    })
  } catch (error) {
    console.error("Get marketplace items error:", error)
    return res.status(500).json({
      message: "Failed to fetch items",
    })
  }
}

/* ---------- GET SINGLE ITEM ---------- */
export const getMarketplaceItemById = async (req, res) => {
  try {
    const { id } = req.params

    const item = await MarketplaceItem.findById(id)
      .populate("seller", "name email")
      .lean()

    if (!item || !item.isActive) {
      return res.status(404).json({
        message: "Item not found",
      })
    }

    /* ---------- GET RELATED ITEMS ---------- */
    const relatedItems = await MarketplaceItem.find({
      category: item.category,
      _id: { $ne: item._id },
      isActive: true,
      status: "available",
    })
      .populate("seller", "name email")
      .limit(4)
      .lean()

    return res.status(200).json({
      success: true,
      item,
      relatedItems,
    })
  } catch (error) {
    console.error("Get marketplace item error:", error)
    return res.status(500).json({
      message: "Failed to fetch item",
    })
  }
}
