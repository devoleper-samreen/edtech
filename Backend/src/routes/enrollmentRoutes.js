import express from 'express';
import {
  getAllEnrollments,
  getEnrollment,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment
} from '../controllers/enrollmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin'), getAllEnrollments)
  .post(createEnrollment);

router.route('/:id')
  .get(protect, authorize('admin'), getEnrollment)
  .put(protect, authorize('admin'), updateEnrollment)
  .delete(protect, authorize('admin'), deleteEnrollment);

export default router;
