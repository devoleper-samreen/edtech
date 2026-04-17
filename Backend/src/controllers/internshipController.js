import InternshipProgram from '../models/InternshipProgram.js';
import InternshipEnrollment from '../models/InternshipEnrollment.js';
import asyncHandler from '../utils/asyncHandler.js';

const attachEnrolledCount = async (programs) => {
  return Promise.all(programs.map(async (p) => {
    const count = await InternshipEnrollment.countDocuments({ program: p.title, status: 'Paid' });
    return { ...p.toObject(), enrolledCount: count };
  }));
};

// @desc    Get all programs (admin)
// @route   GET /api/internships
// @access  Private/Admin
export const getAllPrograms = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;

  let query = {};
  if (status && status !== 'All') query.status = status;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;
  const programs = await InternshipProgram.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await InternshipProgram.countDocuments(query);
  const programsWithCount = await attachEnrolledCount(programs);

  res.status(200).json({
    success: true,
    data: {
      programs: programsWithCount,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    }
  });
});

// @desc    Get active programs (public)
// @route   GET /api/internships/public
// @access  Public
export const getActivePrograms = asyncHandler(async (req, res) => {
  const programs = await InternshipProgram.find({ status: 'Active' }).sort({ createdAt: -1 });
  const programsWithCount = await attachEnrolledCount(programs);
  res.status(200).json({ success: true, data: programsWithCount });
});

// @desc    Create program
// @route   POST /api/internships
// @access  Private/Admin
export const createProgram = asyncHandler(async (req, res) => {
  const { title, description, duration, price, thumbnail, earlyBirdDeadline, status } = req.body;

  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'Please provide title and description' });
  }

  const program = await InternshipProgram.create({ title, description, duration, price, thumbnail, earlyBirdDeadline, status });
  res.status(201).json({ success: true, message: 'Program created successfully', data: program });
});

// @desc    Update program
// @route   PUT /api/internships/:id
// @access  Private/Admin
export const updateProgram = asyncHandler(async (req, res) => {
  const program = await InternshipProgram.findById(req.params.id);

  if (!program) {
    return res.status(404).json({ success: false, message: 'Program not found' });
  }

  const { title, description, duration, price, thumbnail, earlyBirdDeadline, enrolledCount, status } = req.body;
  if (title !== undefined) program.title = title;
  if (description !== undefined) program.description = description;
  if (duration !== undefined) program.duration = duration;
  if (price !== undefined) program.price = price;
  if (thumbnail !== undefined) program.thumbnail = thumbnail;
  if (earlyBirdDeadline !== undefined) program.earlyBirdDeadline = earlyBirdDeadline;
  if (enrolledCount !== undefined) program.enrolledCount = enrolledCount;
  if (status !== undefined) program.status = status;

  await program.save();
  res.status(200).json({ success: true, message: 'Program updated successfully', data: program });
});

// @desc    Delete program
// @route   DELETE /api/internships/:id
// @access  Private/Admin
export const deleteProgram = asyncHandler(async (req, res) => {
  const program = await InternshipProgram.findById(req.params.id);

  if (!program) {
    return res.status(404).json({ success: false, message: 'Program not found' });
  }

  await program.deleteOne();
  res.status(200).json({ success: true, message: 'Program deleted successfully' });
});
