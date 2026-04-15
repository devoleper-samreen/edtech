import CourseCategory from '../models/CourseCategory.js';
import Course from '../models/Course.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getAllCategories = asyncHandler(async (req, res) => {
  const { status, search } = req.query;

  // Build query
  let query = {};

  if (status) {
    query.status = status;
  }

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const categories = await CourseCategory.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: categories
  });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategory = asyncHandler(async (req, res) => {
  const category = await CourseCategory.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  res.status(200).json({
    success: true,
    data: category
  });
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, status } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Please provide category name'
    });
  }

  // Check if category already exists
  const categoryExists = await CourseCategory.findOne({ name });
  if (categoryExists) {
    return res.status(400).json({
      success: false,
      message: 'Category with this name already exists'
    });
  }

  const category = await CourseCategory.create({
    name,
    description,
    status: status || 'Active'
  });

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: category
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, status } = req.body;

  const category = await CourseCategory.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  if (name) category.name = name;
  if (description) category.description = description;
  if (status) category.status = status;

  await category.save();

  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: category
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await CourseCategory.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  // Check if category has courses
  const coursesCount = await Course.countDocuments({ category: req.params.id });
  if (coursesCount > 0) {
    return res.status(400).json({
      success: false,
      message: `Cannot delete category. It has ${coursesCount} courses associated with it.`
    });
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully'
  });
});
