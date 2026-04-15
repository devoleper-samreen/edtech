import User from '../models/User.js';
import StudentEnrollment from '../models/StudentEnrollment.js';
import Enrollment from '../models/Enrollment.js';
import Enquiry from '../models/Enquiry.js';
import CallbackRequest from '../models/CallbackRequest.js';
import Batch from '../models/Batch.js';
import Course from '../models/Course.js';
import asyncHandler from '../utils/asyncHandler.js';
import { hashPassword, comparePassword } from '../utils/hashPassword.js';

// @desc    Get student dashboard data
// @route   GET /api/student/dashboard
// @access  Private/Student
export const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Get user details first
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Get enrolled courses from Enrollment model (where admin marks as "Enrolled")
  const enrolledCourses = await Enrollment.find({
    email: user.email,
    status: 'Enrolled'
  }).sort({ createdAt: -1 });

  // Get course details for enrolled courses
  const enrollmentsWithDetails = await Promise.all(
    enrolledCourses.slice(0, 3).map(async (enrollment) => {
      const course = await Course.findOne({
        title: { $regex: new RegExp(enrollment.course, 'i') }
      }).select('title thumbnail');

      return {
        _id: enrollment._id,
        course: course || { title: enrollment.course, thumbnail: '' },
        status: enrollment.status,
        enrollmentDate: enrollment.createdAt
      };
    })
  );

  // Get recent enquiries by user's email
  const enquiries = await Enquiry.find({ email: user.email })
    .sort({ createdAt: -1 })
    .limit(3);

  // Get recent callbacks by user's email or phone
  const callbackQuery = { $or: [] };
  if (user.email) callbackQuery.$or.push({ email: user.email });
  if (user.phone) callbackQuery.$or.push({ phone: user.phone });

  let callbacks = [];
  if (callbackQuery.$or.length > 0) {
    callbacks = await CallbackRequest.find(callbackQuery)
      .sort({ createdAt: -1 })
      .limit(3);
  }

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalEnrollments: enrolledCourses.length,
        activeEnrollments: enrolledCourses.length,
        completedCourses: 0,
        pendingEnquiries: enquiries.filter(e => e.status === 'New').length
      },
      recentEnrollments: enrollmentsWithDetails,
      recentEnquiries: enquiries,
      recentCallbacks: callbacks
    }
  });
});

// @desc    Get student's enrolled courses
// @route   GET /api/student/courses
// @access  Private/Student
export const getMyCourses = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { status } = req.query;

  // Get user details first
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Fetch from Enrollment model where user's email matches and status is "Enrolled"
  let query = { email: user.email };

  // If status filter provided, use it; otherwise default to "Enrolled"
  if (status && status !== 'All') {
    query.status = status;
  } else {
    query.status = 'Enrolled';
  }

  const enrollments = await Enrollment.find(query).sort({ createdAt: -1 });

  // For each enrollment, try to find the course details
  const enrollmentsWithCourseDetails = await Promise.all(
    enrollments.map(async (enrollment) => {
      // Try to find course by title
      const course = await Course.findOne({
        title: { $regex: new RegExp(enrollment.course, 'i') }
      }).select('title description thumbnail duration level');

      return {
        _id: enrollment._id,
        course: course || {
          _id: null,
          title: enrollment.course,
          description: '',
          thumbnail: '',
          duration: '',
          level: ''
        },
        status: enrollment.status,
        enrollmentDate: enrollment.createdAt,
        message: enrollment.message,
        notes: enrollment.notes
      };
    })
  );

  res.status(200).json({
    success: true,
    data: enrollmentsWithCourseDetails
  });
});

// @desc    Get student's batches
// @route   GET /api/student/batches
// @access  Private/Student
export const getMyBatches = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const enrollments = await StudentEnrollment.find({
    user: userId,
    status: { $in: ['Active', 'On Hold'] }
  })
    .populate('course', 'title thumbnail')
    .populate({
      path: 'batch',
      populate: {
        path: 'course',
        select: 'title'
      }
    })
    .sort({ 'batch.startDate': 1 });

  // Extract batch details with course info
  const batches = enrollments.map(enrollment => ({
    _id: enrollment._id,
    course: enrollment.course,
    batch: enrollment.batch,
    enrollmentStatus: enrollment.status,
    progress: enrollment.progress,
    enrollmentDate: enrollment.enrollmentDate
  }));

  res.status(200).json({
    success: true,
    data: batches
  });
});

// @desc    Get student's enquiries
// @route   GET /api/student/enquiries
// @access  Private/Student
export const getMyEnquiries = asyncHandler(async (req, res) => {
  const { status } = req.query;

  // Get user details first
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  let query = { email: user.email };
  if (status && status !== 'All') {
    query.status = status;
  }

  const enquiries = await Enquiry.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: enquiries
  });
});

// @desc    Get student's callback requests
// @route   GET /api/student/callbacks
// @access  Private/Student
export const getMyCallbacks = asyncHandler(async (req, res) => {
  const { status } = req.query;

  // Get user details first
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Build query based on user's email and phone
  const orConditions = [];
  if (user.email) orConditions.push({ email: user.email });
  if (user.phone) orConditions.push({ phone: user.phone });

  if (orConditions.length === 0) {
    return res.status(200).json({
      success: true,
      data: []
    });
  }

  let query = { $or: orConditions };

  if (status && status !== 'All') {
    query.status = status;
  }

  const callbacks = await CallbackRequest.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: callbacks
  });
});

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private/Student
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update student profile
// @route   PUT /api/student/profile
// @access  Private/Student
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.body;

  const user = await User.findById(req.user.id);

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (avatar) user.avatar = avatar;

  await user.save();

  // Update localStorage data
  const updatedUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar
  };

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser
  });
});

// @desc    Change password
// @route   PUT /api/student/change-password
// @access  Private/Student
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide current and new password'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters'
    });
  }

  const user = await User.findById(req.user.id).select('+password');

  const isPasswordValid = await comparePassword(currentPassword, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  user.password = await hashPassword(newPassword);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});

// @desc    Download certificate
// @route   GET /api/student/certificate/:enrollmentId
// @access  Private/Student
export const getCertificate = asyncHandler(async (req, res) => {
  const enrollment = await StudentEnrollment.findOne({
    _id: req.params.enrollmentId,
    user: req.user.id
  })
    .populate('course', 'title')
    .populate('batch', 'startDate');

  if (!enrollment) {
    return res.status(404).json({
      success: false,
      message: 'Enrollment not found'
    });
  }

  if (enrollment.status !== 'Completed') {
    return res.status(400).json({
      success: false,
      message: 'Certificate is only available for completed courses'
    });
  }

  if (!enrollment.certificateIssued) {
    return res.status(400).json({
      success: false,
      message: 'Certificate has not been issued yet. Please contact admin.'
    });
  }

  res.status(200).json({
    success: true,
    data: {
      certificateUrl: enrollment.certificateUrl,
      courseName: enrollment.course.title,
      completedAt: enrollment.completedAt,
      certificateIssuedAt: enrollment.certificateIssuedAt
    }
  });
});
