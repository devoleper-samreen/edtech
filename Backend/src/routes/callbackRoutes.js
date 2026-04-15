import express from 'express';
import {
  getAllCallbacks,
  getCallback,
  createCallback,
  updateCallback,
  deleteCallback,
  markCallbackCompleted
} from '../controllers/callbackController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin'), getAllCallbacks)
  .post(createCallback);

router.route('/:id')
  .get(protect, authorize('admin'), getCallback)
  .put(protect, authorize('admin'), updateCallback)
  .delete(protect, authorize('admin'), deleteCallback);

router.patch('/:id/complete', protect, authorize('admin'), markCallbackCompleted);

export default router;
