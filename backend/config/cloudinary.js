import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import os from "os";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Upload from file path (for multer disk storage)
const uploadOnCloudinary = async (filepath) => {
  if (!filepath) return null;

  try {
    const uploadResult = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto",
    });

    // Clean up local file after successful upload
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    return uploadResult?.secure_url;
  } catch (error) {
    // Clean up local file on error
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

// Upload from buffer (for multer memory storage)
export const uploadFromBuffer = async (buffer, filename) => {
  if (!buffer) return null;

  try {
    const tempFilePath = path.join(os.tmpdir(), filename);
    
    // Write buffer to temp file
    fs.writeFileSync(tempFilePath, buffer);

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
      resource_type: "auto",
      filename_override: filename,
    });

    // Clean up temp file
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }

    return uploadResult?.secure_url;
  } catch (error) {
    console.error("Buffer upload error:", error);
    return null;
  }
};

export default uploadOnCloudinary;