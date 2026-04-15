import Testimonial from '../models/Testimonial.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all testimonials (admin)
// @route   GET /api/testimonials
// @access  Private/Admin
export const getAllTestimonials = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  let query = {};

  if (status) {
    query.status = status;
  }

  const skip = (page - 1) * limit;

  const testimonials = await Testimonial.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Testimonial.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      testimonials,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Get active testimonials (public)
// @route   GET /api/testimonials/public
// @access  Public
export const getActiveTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ status: 'Active' })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: testimonials
  });
});

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
// @access  Private/Admin
export const getTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    return res.status(404).json({
      success: false,
      message: 'Testimonial not found'
    });
  }

  res.status(200).json({
    success: true,
    data: testimonial
  });
});

// @desc    Create testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
export const createTestimonial = asyncHandler(async (req, res) => {
  const { company, contactPerson, designation, shortText, fullText, rating, status } = req.body;

  if (!company || !contactPerson || !designation || !shortText || !fullText) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields'
    });
  }

  const testimonial = await Testimonial.create({
    company,
    contactPerson,
    designation,
    shortText,
    fullText,
    rating: rating || 5,
    status: status || 'Active'
  });

  res.status(201).json({
    success: true,
    message: 'Testimonial created successfully',
    data: testimonial
  });
});

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
export const updateTestimonial = asyncHandler(async (req, res) => {
  const { company, contactPerson, designation, shortText, fullText, rating, status } = req.body;

  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    return res.status(404).json({
      success: false,
      message: 'Testimonial not found'
    });
  }

  if (company) testimonial.company = company;
  if (contactPerson) testimonial.contactPerson = contactPerson;
  if (designation) testimonial.designation = designation;
  if (shortText) testimonial.shortText = shortText;
  if (fullText) testimonial.fullText = fullText;
  if (rating) testimonial.rating = rating;
  if (status) testimonial.status = status;

  await testimonial.save();

  res.status(200).json({
    success: true,
    message: 'Testimonial updated successfully',
    data: testimonial
  });
});

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    return res.status(404).json({
      success: false,
      message: 'Testimonial not found'
    });
  }

  await testimonial.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Testimonial deleted successfully'
  });
});
