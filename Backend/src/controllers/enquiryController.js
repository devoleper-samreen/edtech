import Enquiry from '../models/Enquiry.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private/Admin
export const getAllEnquiries = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 10 } = req.query;

  // Build query
  let query = {};

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { course: { $regex: search, $options: 'i' } }
    ];
  }

  // Pagination
  const skip = (page - 1) * limit;

  const enquiries = await Enquiry.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Enquiry.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      enquiries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Get single enquiry
// @route   GET /api/enquiries/:id
// @access  Private/Admin
export const getEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);

  if (!enquiry) {
    return res.status(404).json({
      success: false,
      message: 'Enquiry not found'
    });
  }

  res.status(200).json({
    success: true,
    data: enquiry
  });
});

// @desc    Create enquiry
// @route   POST /api/enquiries
// @access  Public
export const createEnquiry = asyncHandler(async (req, res) => {
  const { name, email, phone, course, message } = req.body;

  // Validation
  if (!name || !email || !phone || !course || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields'
    });
  }

  const enquiry = await Enquiry.create({
    name,
    email,
    phone,
    course,
    message
  });

  res.status(201).json({
    success: true,
    message: 'Enquiry submitted successfully. We will contact you soon.',
    data: enquiry
  });
});

// @desc    Update enquiry
// @route   PUT /api/enquiries/:id
// @access  Private/Admin
export const updateEnquiry = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;

  const enquiry = await Enquiry.findById(req.params.id);

  if (!enquiry) {
    return res.status(404).json({
      success: false,
      message: 'Enquiry not found'
    });
  }

  if (status) enquiry.status = status;
  if (notes) enquiry.notes = notes;

  await enquiry.save();

  res.status(200).json({
    success: true,
    message: 'Enquiry updated successfully',
    data: enquiry
  });
});

// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private/Admin
export const deleteEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);

  if (!enquiry) {
    return res.status(404).json({
      success: false,
      message: 'Enquiry not found'
    });
  }

  await enquiry.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Enquiry deleted successfully'
  });
});
