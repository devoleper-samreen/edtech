import express from 'express';
import {
  getAllPlacements,
  getActivePlacements,
  createPlacement,
  updatePlacement,
  deletePlacement
} from '../controllers/placementController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.get('/public', getActivePlacements);

// Protected routes (admin only)
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getAllPlacements)
  .post(createPlacement);

router.route('/:id')
  .put(updatePlacement)
  .delete(deletePlacement);

export default router;
