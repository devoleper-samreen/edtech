import Batch from '../models/Batch.js';
import Course from '../models/Course.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all batches
// @route   GET /api/batches
// @access  Private/Admin
export const getAllBatches = asyncHandler(async (req, res) => {
  const { course, status, search, page = 1, limit = 10 } = req.query;

  let query = {};

  if (course) {
    query.course = course;
  }

  if (status) {
    query.status = status;
  }

  // Pagination
  const skip = (page - 1) * limit;

  const batches = await Batch.find(query)
    .populate('course', 'title name')
    .sort({ startDate: 1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Batch.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      batches,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Get batches by course ID (public)
// @route   GET /api/batches/course/:courseId
// @access  Public
export const getBatchesByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const batches = await Batch.find({
    course: courseId,
    status: { $in: ['Upcoming', 'Ongoing'] }
  })
    .populate('course', 'title name')
    .sort({ startDate: 1 });

  res.status(200).json({
    success: true,
    data: batches
  });
});

// @desc    Get single batch
// @route   GET /api/batches/:id
// @access  Private/Admin
export const getBatch = asyncHandler(async (req, res) => {
  const batch = await Batch.findById(req.params.id).populate('course', 'title name');

  if (!batch) {
    return res.status(404).json({
      success: false,
      message: 'Batch not found'
    });
  }

  res.status(200).json({
    success: true,
    data: batch
  });
});

// @desc    Create batch
// @route   POST /api/batches
// @access  Private/Admin
export const createBatch = asyncHandler(async (req, res) => {
  const { course, mode, startDate, timing, days, contact, maxStudents, status } = req.body;

  // Validation
  if (!course || !startDate || !timing) {
    return res.status(400).json({
      success: false,
      message: 'Please provide course, start date, and timing'
    });
  }

  // Check if course exists
  const courseExists = await Course.findById(course);
  if (!courseExists) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  const batch = await Batch.create({
    course,
    mode: mode || 'Online',
    startDate,
    timing,
    days: days || 'Weekday',
    contact: contact || '',
    maxStudents: maxStudents || 30,
    status: status || 'Upcoming'
  });

  const populatedBatch = await Batch.findById(batch._id).populate('course', 'title name');

  res.status(201).json({
    success: true,
    message: 'Batch created successfully',
    data: populatedBatch
  });
});

// @desc    Update batch
// @route   PUT /api/batches/:id
// @access  Private/Admin
export const updateBatch = asyncHandler(async (req, res) => {
  const { course, mode, startDate, timing, days, contact, maxStudents, status } = req.body;

  const batch = await Batch.findById(req.params.id);

  if (!batch) {
    return res.status(404).json({
      success: false,
      message: 'Batch not found'
    });
  }

  // If course is being updated, check if it exists
  if (course && course !== batch.course.toString()) {
    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    batch.course = course;
  }

  if (mode) batch.mode = mode;
  if (startDate) batch.startDate = startDate;
  if (timing) batch.timing = timing;
  if (days) batch.days = days;
  if (contact !== undefined) batch.contact = contact;
  if (maxStudents) batch.maxStudents = maxStudents;
  if (status) batch.status = status;

  await batch.save();

  const populatedBatch = await Batch.findById(batch._id).populate('course', 'title name');

  res.status(200).json({
    success: true,
    message: 'Batch updated successfully',
    data: populatedBatch
  });
});

// @desc    Delete batch
// @route   DELETE /api/batches/:id
// @access  Private/Admin
export const deleteBatch = asyncHandler(async (req, res) => {
  const batch = await Batch.findById(req.params.id);

  if (!batch) {
    return res.status(404).json({
      success: false,
      message: 'Batch not found'
    });
  }

  await batch.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Batch deleted successfully'
  });
});
