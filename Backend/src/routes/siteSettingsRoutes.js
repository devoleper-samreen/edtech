import express from 'express';
import { getSetting, updateSetting } from '../controllers/siteSettingsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/:key', getSetting);

router.put('/:key', protect, authorize('admin'), updateSetting);

export default router;
