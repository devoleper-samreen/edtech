import Placement from '../models/Placement.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all placements (admin)
// @route   GET /api/placements
// @access  Private/Admin
export const getAllPlacements = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;

  let query = {};
  if (status && status !== 'All') query.status = status;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { dept: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;
  const placements = await Placement.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Placement.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      placements,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    }
  });
});

// @desc    Get active placements (public)
// @route   GET /api/placements/public
// @access  Public
export const getActivePlacements = asyncHandler(async (req, res) => {
  const { limit = 6 } = req.query;
  const placements = await Placement.find({ status: 'Active' })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  res.status(200).json({ success: true, data: placements });
});

// @desc    Create placement
// @route   POST /api/placements
// @access  Private/Admin
export const createPlacement = asyncHandler(async (req, res) => {
  const { name, degree, score, year, dept, company, xLink, linkedinLink, instagramLink, status } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'Please provide student name' });
  }

  const placement = await Placement.create({ name, degree, score, year, dept, company, xLink, linkedinLink, instagramLink, status });

  res.status(201).json({ success: true, message: 'Placement added successfully', data: placement });
});

// @desc    Update placement
// @route   PUT /api/placements/:id
// @access  Private/Admin
export const updatePlacement = asyncHandler(async (req, res) => {
  const placement = await Placement.findById(req.params.id);

  if (!placement) {
    return res.status(404).json({ success: false, message: 'Placement not found' });
  }

  const { name, degree, score, year, dept, company, xLink, linkedinLink, instagramLink, status } = req.body;
  if (name !== undefined) placement.name = name;
  if (degree !== undefined) placement.degree = degree;
  if (score !== undefined) placement.score = score;
  if (year !== undefined) placement.year = year;
  if (dept !== undefined) placement.dept = dept;
  if (company !== undefined) placement.company = company;
  if (xLink !== undefined) placement.xLink = xLink;
  if (linkedinLink !== undefined) placement.linkedinLink = linkedinLink;
  if (instagramLink !== undefined) placement.instagramLink = instagramLink;
  if (status !== undefined) placement.status = status;

  await placement.save();

  res.status(200).json({ success: true, message: 'Placement updated successfully', data: placement });
});

// @desc    Delete placement
// @route   DELETE /api/placements/:id
// @access  Private/Admin
export const deletePlacement = asyncHandler(async (req, res) => {
  const placement = await Placement.findById(req.params.id);

  if (!placement) {
    return res.status(404).json({ success: false, message: 'Placement not found' });
  }

  await placement.deleteOne();

  res.status(200).json({ success: true, message: 'Placement deleted successfully' });
});
