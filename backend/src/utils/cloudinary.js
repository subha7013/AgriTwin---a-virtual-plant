import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file to Cloudinary and delete local file
 * @param {string} filePath - Local path to file
 * @param {Object} options - Upload options
 * @returns {Promise<string>} - Cloudinary URL
 */
export async function uploadToCloudinary(filePath, options = {}) {
  try {
    const uploadOptions = {
      folder: options.folder || "agritwin/diagnoses",
      resource_type: "image",
      ...options,
    };

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);

    // Clean up local file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return result.secure_url;
  } catch (error) {
    console.error("[Cloudinary] Upload failed:", error.message);

    // If upload fails, return local path as fallback
    if (fs.existsSync(filePath)) {
      return filePath;
    }

    throw error;
  }
}

/**
 * Upload image with additional options
 * @param {string} filePath - Local path to image
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Upload result
 */
export async function uploadImage(filePath, options = {}) {
  const uploadOptions = {
    folder: options.folder || "agritwin/images",
    public_id: options.publicId || undefined,
    overwrite: options.overwrite || false,
    transformation: options.transformation || [],
    ...options,
  };

  const result = await cloudinary.uploader.upload(filePath, uploadOptions);

  // Clean up local file
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  return result;
}

/**
 * Delete resource from Cloudinary
 * @param {string} publicId - Public ID of resource
 * @param {string} resourceType - Resource type (image, video, etc.)
 * @returns {Promise<Object>} - Delete result
 */
export async function deleteResource(publicId, resourceType = "image") {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error("[Cloudinary] Delete failed:", error.message);
    throw error;
  }
}

export default cloudinary;
