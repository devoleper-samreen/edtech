import express from 'express';
import {
  getAllEnquiries,
  getEnquiry,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry
} from '../controllers/enquiryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin'), getAllEnquiries)
  .post(createEnquiry);

router.route('/:id')
  .get(protect, authorize('admin'), getEnquiry)
  .put(protect, authorize('admin'), updateEnquiry)
  .delete(protect, authorize('admin'), deleteEnquiry);

export default router;
