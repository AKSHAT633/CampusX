import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "campussync_users",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "heic", "heif", "avif"],
    resource_type: "image",
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;