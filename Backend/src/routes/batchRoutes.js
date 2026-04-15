import express from 'express';
import {
  getAllBatches,
  getBatchesByCourse,
  getBatch,
  createBatch,
  updateBatch,
  deleteBatch
} from '../controllers/batchController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route - get batches by course
router.get('/course/:courseId', getBatchesByCourse);

// Protected routes (admin only)
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getAllBatches)
  .post(createBatch);

router.route('/:id')
  .get(getBatch)
  .put(updateBatch)
  .delete(deleteBatch);

export default router;
