import SiteSettings from '../models/SiteSettings.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get a setting by key (public)
// @route   GET /api/settings/:key
// @access  Public
export const getSetting = asyncHandler(async (req, res) => {
  const setting = await SiteSettings.findOne({ key: req.params.key });
  res.status(200).json({
    success: true,
    data: setting ? setting.value : null
  });
});

// @desc    Update a setting (upsert)
// @route   PUT /api/settings/:key
// @access  Private/Admin
export const updateSetting = asyncHandler(async (req, res) => {
  const { value } = req.body;
  const setting = await SiteSettings.findOneAndUpdate(
    { key: req.params.key },
    { value },
    { upsert: true, new: true }
  );
  res.status(200).json({ success: true, data: setting.value });
});
