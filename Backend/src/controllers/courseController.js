import Course from '../models/Course.js';
import CourseCategory from '../models/CourseCategory.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getAllCourses = asyncHandler(async (req, res) => {
  const { category, status, search, page = 1, limit = 10 } = req.query;

  // Build query
  let query = {};

  if (category) {
    query.category = category;
  }

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // Pagination
  const skip = (page - 1) * limit;

  const courses = await Course.find(query)
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Course.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
export const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('category', 'name')
    .populate('enrolledStudents', 'name email');

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = asyncHandler(async (req, res) => {
  const {
    title,
    name,
    description,
    category,
    instructor,
    price,
    duration,
    level,
    thumbnail,
    status
  } = req.body;

  // Validation
  if (!title || !description || !category || !instructor || price === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields'
    });
  }

  // Check if category exists
  const categoryExists = await CourseCategory.findById(category);
  if (!categoryExists) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  const course = await Course.create({
    title,
    name: name || title,
    description,
    category,
    instructor,
    price,
    duration,
    level,
    thumbnail,
    status: status || 'draft'
  });

  // Update category courses count
  categoryExists.coursesCount += 1;
  await categoryExists.save();

  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: course
  });
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
export const updateCourse = asyncHandler(async (req, res) => {
  const {
    title,
    name,
    description,
    category,
    instructor,
    price,
    duration,
    level,
    thumbnail,
    status
  } = req.body;

  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  // If category is being changed, update counts
  if (category && category !== course.category.toString()) {
    // Decrease old category count
    const oldCategory = await CourseCategory.findById(course.category);
    if (oldCategory) {
      oldCategory.coursesCount -= 1;
      await oldCategory.save();
    }

    // Increase new category count
    const newCategory = await CourseCategory.findById(category);
    if (!newCategory) {
      return res.status(404).json({
        success: false,
        message: 'New category not found'
      });
    }
    newCategory.coursesCount += 1;
    await newCategory.save();
  }

  // Update fields
  if (title) course.title = title;
  if (name) course.name = name;
  if (description) course.description = description;
  if (category) course.category = category;
  if (instructor) course.instructor = instructor;
  if (price !== undefined) course.price = price;
  if (duration) course.duration = duration;
  if (level) course.level = level;
  if (thumbnail) course.thumbnail = thumbnail;
  if (status) course.status = status;

  await course.save();

  res.status(200).json({
    success: true,
    message: 'Course updated successfully',
    data: course
  });
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  // Update category courses count
  const category = await CourseCategory.findById(course.category);
  if (category) {
    category.coursesCount -= 1;
    await category.save();
  }

  await course.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Course deleted successfully'
  });
});

// @desc    Enroll student in course
// @route   POST /api/courses/:id/enroll
// @access  Private
export const enrollInCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  // Check if already enrolled
  if (course.enrolledStudents.includes(req.user.id)) {
    return res.status(400).json({
      success: false,
      message: 'You are already enrolled in this course'
    });
  }

  course.enrolledStudents.push(req.user.id);
  await course.save();

  res.status(200).json({
    success: true,
    message: 'Successfully enrolled in course',
    data: course
  });
});
