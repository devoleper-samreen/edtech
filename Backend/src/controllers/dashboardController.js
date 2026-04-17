import User from '../models/User.js';
import Course from '../models/Course.js';
import CourseCategory from '../models/CourseCategory.js';
import Enquiry from '../models/Enquiry.js';
import CallbackRequest from '../models/CallbackRequest.js';
import Enrollment from '../models/Enrollment.js';
import InternshipEnrollment from '../models/InternshipEnrollment.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  // Get current date for time-based filtering
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // User stats
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const inactiveUsers = await User.countDocuments({ isActive: false });
  const newUsersThisMonth = await User.countDocuments({
    createdAt: { $gte: startOfMonth }
  });
  const studentCount = await User.countDocuments({ role: 'student' });
  const adminCount = await User.countDocuments({ role: 'admin' });

  // Course stats (check both lowercase and uppercase status values)
  const totalCourses = await Course.countDocuments();
  const publishedCourses = await Course.countDocuments({ status: { $in: ['Published', 'published'] } });
  const draftCourses = await Course.countDocuments({ status: { $in: ['Draft', 'draft'] } });
  const archivedCourses = await Course.countDocuments({ status: { $in: ['Archived', 'archived'] } });

  // Category stats
  const totalCategories = await CourseCategory.countDocuments();
  const activeCategories = await CourseCategory.countDocuments({ status: 'Active' });

  // Enquiry stats
  const totalEnquiries = await Enquiry.countDocuments();
  const newEnquiries = await Enquiry.countDocuments({ status: 'New' });
  const contactedEnquiries = await Enquiry.countDocuments({ status: 'Contacted' });
  const resolvedEnquiries = await Enquiry.countDocuments({ status: 'Resolved' });
  const enquiriesThisMonth = await Enquiry.countDocuments({
    createdAt: { $gte: startOfMonth }
  });

  // Callback stats
  const totalCallbacks = await CallbackRequest.countDocuments();
  const pendingCallbacks = await CallbackRequest.countDocuments({ status: 'Pending' });
  const scheduledCallbacks = await CallbackRequest.countDocuments({ status: 'Scheduled' });
  const completedCallbacks = await CallbackRequest.countDocuments({ status: 'Completed' });
  const callbacksThisMonth = await CallbackRequest.countDocuments({
    createdAt: { $gte: startOfMonth }
  });

  // Get total enrolled students count
  const coursesWithStudents = await Course.aggregate([
    { $project: { enrolledCount: { $size: '$enrolledStudents' } } },
    { $group: { _id: null, total: { $sum: '$enrolledCount' } } }
  ]);
  const totalEnrollments = coursesWithStudents[0]?.total || 0;

  // Get top selling course (most enrolled students)
  const topSellingCourse = await Course.aggregate([
    {
      $project: {
        name: 1,
        category: 1,
        enrolledCount: { $size: '$enrolledStudents' },
        price: 1,
        status: 1
      }
    },
    { $sort: { enrolledCount: -1 } },
    { $limit: 1 }
  ]);

  // Populate category for top selling course
  let topCourse = null;
  if (topSellingCourse.length > 0) {
    await Course.populate(topSellingCourse, { path: 'category', select: 'name' });
    topCourse = {
      name: topSellingCourse[0].name,
      category: topSellingCourse[0].category?.name || 'Uncategorized',
      enrolledCount: topSellingCourse[0].enrolledCount,
      price: topSellingCourse[0].price
    };
  }

  // Enrollment stats
  const totalEnrollmentRequests = await Enrollment.countDocuments();
  const totalInternshipEnrollments = await InternshipEnrollment.countDocuments();
  const newEnrollmentRequests = await Enrollment.countDocuments({ status: 'Unpaid' });
  const contactedEnrollments = await Enrollment.countDocuments({ status: 'Unpaid' });
  const paidCourseEnrollments = await Enrollment.countDocuments({ status: 'Paid' });
  const paidInternshipEnrollments = await InternshipEnrollment.countDocuments({ status: 'Paid' });
  const enrolledEnrollments = paidCourseEnrollments + paidInternshipEnrollments;

  // Recent activity
  const recentUsers = await User.find()
    .select('name email role createdAt')
    .sort({ createdAt: -1 })
    .limit(5);

  const recentEnquiries = await Enquiry.find({ status: 'New' })
    .select('name email course status createdAt')
    .sort({ createdAt: -1 })
    .limit(50);

  const recentCallbacks = await CallbackRequest.find({ status: 'Pending' })
    .select('name phone type status createdAt')
    .sort({ createdAt: -1 })
    .limit(50);

  const recentEnrollments = await Enrollment.find({ status: 'Paid' })
    .select('name email course status createdAt')
    .sort({ createdAt: -1 })
    .limit(50);

  const recentInternshipEnrollments = await InternshipEnrollment.find({ status: 'Paid' })
    .select('name email program status createdAt')
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        newThisMonth: newUsersThisMonth,
        students: studentCount,
        admins: adminCount
      },
      courses: {
        total: totalCourses,
        published: publishedCourses,
        draft: draftCourses,
        archived: archivedCourses,
        totalEnrollments,
        topSelling: topCourse
      },
      categories: {
        total: totalCategories,
        active: activeCategories
      },
      enquiries: {
        total: totalEnquiries,
        new: newEnquiries,
        contacted: contactedEnquiries,
        resolved: resolvedEnquiries,
        thisMonth: enquiriesThisMonth
      },
      callbacks: {
        total: totalCallbacks,
        pending: pendingCallbacks,
        scheduled: scheduledCallbacks,
        completed: completedCallbacks,
        thisMonth: callbacksThisMonth
      },
      enrollments: {
        total: totalEnrollmentRequests,
        new: newEnrollmentRequests,
        contacted: contactedEnrollments,
        enrolled: enrolledEnrollments
      },
      recentActivity: {
        users: recentUsers,
        enquiries: recentEnquiries,
        callbacks: recentCallbacks,
        enrollments: recentEnrollments,
        internshipEnrollments: recentInternshipEnrollments
      }
    }
  });
});

// @desc    Get user growth stats
// @route   GET /api/dashboard/user-growth
// @access  Private/Admin
export const getUserGrowthStats = asyncHandler(async (req, res) => {
  const { months = 6 } = req.query;

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - parseInt(months));

  const userGrowth = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);

  res.status(200).json({
    success: true,
    data: userGrowth
  });
});

// @desc    Get course popularity stats
// @route   GET /api/dashboard/course-popularity
// @access  Private/Admin
export const getCoursePopularityStats = asyncHandler(async (req, res) => {
  const popularCourses = await Course.aggregate([
    {
      $project: {
        name: 1,
        category: 1,
        enrolledCount: { $size: '$enrolledStudents' },
        rating: 1,
        price: 1,
        status: 1
      }
    },
    {
      $sort: { enrolledCount: -1 }
    },
    {
      $limit: 10
    }
  ]);

  // Populate category
  await Course.populate(popularCourses, { path: 'category', select: 'name' });

  res.status(200).json({
    success: true,
    data: popularCourses
  });
});

// @desc    Get category-wise course distribution
// @route   GET /api/dashboard/category-distribution
// @access  Private/Admin
export const getCategoryDistribution = asyncHandler(async (req, res) => {
  const distribution = await Course.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'coursecategories',
        localField: '_id',
        foreignField: '_id',
        as: 'category'
      }
    },
    {
      $unwind: '$category'
    },
    {
      $project: {
        name: '$category.name',
        count: 1
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  res.status(200).json({
    success: true,
    data: distribution
  });
});
