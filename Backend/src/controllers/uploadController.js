import { getCloudinary } from '../utils/cloudinary.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  // Upload buffer to Cloudinary
  const cloudinary = getCloudinary();
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'techfox/internships', resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(req.file.buffer);
  });

  res.status(200).json({
    success: true,
    data: { url: result.secure_url, public_id: result.public_id }
  });
});
