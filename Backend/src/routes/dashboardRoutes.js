import express from 'express';
import {
  getDashboardStats,
  getUserGrowthStats,
  getCoursePopularityStats,
  getCategoryDistribution
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes and restrict to admin
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/user-growth', getUserGrowthStats);
router.get('/course-popularity', getCoursePopularityStats);
router.get('/category-distribution', getCategoryDistribution);

export default router;
