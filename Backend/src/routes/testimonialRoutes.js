import express from 'express';
import {
  getAllTestimonials,
  getActiveTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} from '../controllers/testimonialController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route - get active testimonials
router.get('/public', getActiveTestimonials);

// Protected routes (admin only)
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getAllTestimonials)
  .post(createTestimonial);

router.route('/:id')
  .get(getTestimonial)
  .put(updateTestimonial)
  .delete(deleteTestimonial);

export default router;
