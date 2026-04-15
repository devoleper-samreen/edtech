import CallbackRequest from '../models/CallbackRequest.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendCallbackEmail } from '../utils/emailService.js';

// @desc    Get all callback requests
// @route   GET /api/callbacks
// @access  Private/Admin
export const getAllCallbacks = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 10 } = req.query;

  // Build query
  let query = {};

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { course: { $regex: search, $options: 'i' } }
    ];
  }

  // Pagination
  const skip = (page - 1) * limit;

  const callbacks = await CallbackRequest.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await CallbackRequest.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      callbacks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Get single callback request
// @route   GET /api/callbacks/:id
// @access  Private/Admin
export const getCallback = asyncHandler(async (req, res) => {
  const callback = await CallbackRequest.findById(req.params.id);

  if (!callback) {
    return res.status(404).json({
      success: false,
      message: 'Callback request not found'
    });
  }

  res.status(200).json({
    success: true,
    data: callback
  });
});

// @desc    Create callback request
// @route   POST /api/callbacks
// @access  Public
export const createCallback = asyncHandler(async (req, res) => {
  console.log('[CALLBACK] Request received:', req.body);
  const { name, phone, email, type, company, requiredTraining, message } = req.body;

  // Validation
  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name and phone number'
    });
  }

  const callback = await CallbackRequest.create({
    name,
    phone,
    email: email || '',
    type: type || 'General',
    company: company || '',
    requiredTraining: requiredTraining || '',
    message: message || ''
  });

  // Notify admin (non-blocking)
  sendCallbackEmail({ name, email, phone, type, company, requiredTraining, message })
    .then(() => console.error('[CALLBACK] Email sent successfully'))
    .catch(err => console.error('[CALLBACK] Email failed:', err.message));

  res.status(201).json({
    success: true,
    message: 'Callback request submitted successfully. We will call you soon.',
    data: callback
  });
});

// @desc    Update callback request
// @route   PUT /api/callbacks/:id
// @access  Private/Admin
export const updateCallback = asyncHandler(async (req, res) => {
  const { status, notes, scheduledDate } = req.body;

  const callback = await CallbackRequest.findById(req.params.id);

  if (!callback) {
    return res.status(404).json({
      success: false,
      message: 'Callback request not found'
    });
  }

  if (status) callback.status = status;
  if (notes) callback.notes = notes;
  if (scheduledDate) callback.scheduledDate = scheduledDate;

  await callback.save();

  res.status(200).json({
    success: true,
    message: 'Callback request updated successfully',
    data: callback
  });
});

// @desc    Delete callback request
// @route   DELETE /api/callbacks/:id
// @access  Private/Admin
export const deleteCallback = asyncHandler(async (req, res) => {
  const callback = await CallbackRequest.findById(req.params.id);

  if (!callback) {
    return res.status(404).json({
      success: false,
      message: 'Callback request not found'
    });
  }

  await callback.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Callback request deleted successfully'
  });
});

// @desc    Mark callback as completed
// @route   PATCH /api/callbacks/:id/complete
// @access  Private/Admin
export const markCallbackCompleted = asyncHandler(async (req, res) => {
  const callback = await CallbackRequest.findById(req.params.id);

  if (!callback) {
    return res.status(404).json({
      success: false,
      message: 'Callback request not found'
    });
  }

  callback.status = 'Completed';
  await callback.save();

  res.status(200).json({
    success: true,
    message: 'Callback marked as completed',
    data: callback
  });
});
