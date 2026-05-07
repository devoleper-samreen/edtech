import express from 'express';
import {
  getActiveHiringPartners,
  getAllHiringPartners,
  createHiringPartner,
  updateHiringPartner,
  deleteHiringPartner
} from '../controllers/hiringPartnerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/public', getActiveHiringPartners);

// Admin only
router.use(protect);
router.use(authorize('admin'));

router.route('/').get(getAllHiringPartners).post(createHiringPartner);
router.route('/:id').put(updateHiringPartner).delete(deleteHiringPartner);

export default router;
