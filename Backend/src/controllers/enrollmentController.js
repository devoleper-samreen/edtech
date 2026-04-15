import Enrollment from '../models/Enrollment.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendEnrollmentEmail } from '../utils/emailService.js';

// @desc    Get all enrollments
// @route   GET /api/enrollments
// @access  Private/Admin
export const getAllEnrollments = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 10 } = req.query;

  // Build query
  let query = {};

  if (status && status !== 'All') {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { course: { $regex: search, $options: 'i' } }
    ];
  }

  // Pagination
  const skip = (page - 1) * limit;

  const enrollments = await Enrollment.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Enrollment.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      enrollments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Get single enrollment
// @route   GET /api/enrollments/:id
// @access  Private/Admin
export const getEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);

  if (!enrollment) {
    return res.status(404).json({
      success: false,
      message: 'Enrollment not found'
    });
  }

  res.status(200).json({
    success: true,
    data: enrollment
  });
});

// @desc    Create enrollment
// @route   POST /api/enrollments
// @access  Public
export const createEnrollment = asyncHandler(async (req, res) => {
  console.log('[ENROLLMENT] Request received:', req.body);
  const { name, email, phone, course, message } = req.body;

  // Validation
  if (!name || !email || !phone || !course) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields'
    });
  }

  const enrollment = await Enrollment.create({
    name,
    email,
    phone,
    course,
    message: message || ''
  });
  console.log('[ENROLLMENT] Saved to DB, id:', enrollment._id);

  // Notify admin (non-blocking)
  console.log('[ENROLLMENT] Triggering email to:', process.env.EMAIL_USER, '| EMAIL_PASS set:', !!process.env.EMAIL_PASS);
  sendEnrollmentEmail({ name, email, phone, course, message })
    .then(() => console.log('[ENROLLMENT] Email sent successfully'))
    .catch(err => console.error('[ENROLLMENT] Email failed:', err.message, err.stack));

  res.status(201).json({
    success: true,
    message: 'Enrollment submitted successfully',
    data: enrollment
  });
});

// @desc    Update enrollment
// @route   PUT /api/enrollments/:id
// @access  Private/Admin
export const updateEnrollment = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;

  const enrollment = await Enrollment.findById(req.params.id);

  if (!enrollment) {
    return res.status(404).json({
      success: false,
      message: 'Enrollment not found'
    });
  }

  if (status) enrollment.status = status;
  if (notes !== undefined) enrollment.notes = notes;

  await enrollment.save();

  res.status(200).json({
    success: true,
    message: 'Enrollment updated successfully',
    data: enrollment
  });
});

// @desc    Delete enrollment
// @route   DELETE /api/enrollments/:id
// @access  Private/Admin
export const deleteEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);

  if (!enrollment) {
    return res.status(404).json({
      success: false,
      message: 'Enrollment not found'
    });
  }

  await enrollment.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Enrollment deleted successfully'
  });
});
