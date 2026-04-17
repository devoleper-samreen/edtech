import express from 'express';
import {
  getDashboard,
  getMyCourses,
  getMyBatches,
  getMyEnquiries,
  getMyCallbacks,
  getMyInternships,
  getProfile,
  updateProfile,
  changePassword,
  getCertificate
} from '../controllers/studentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Dashboard
router.get('/dashboard', getDashboard);

// Courses
router.get('/courses', getMyCourses);

// Batches
router.get('/batches', getMyBatches);

// Internship Enrollments
router.get('/internships', getMyInternships);

// Enquiries
router.get('/enquiries', getMyEnquiries);

// Callbacks
router.get('/callbacks', getMyCallbacks);

// Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Password
router.put('/change-password', changePassword);

// Certificate
router.get('/certificate/:enrollmentId', getCertificate);

export default router;
