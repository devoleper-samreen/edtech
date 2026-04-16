import express from 'express';
import { getAllPrograms, getActivePrograms, createProgram, updateProgram, deleteProgram } from '../controllers/internshipController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/public', getActivePrograms);

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(getAllPrograms).post(createProgram);
router.route('/:id').put(updateProgram).delete(deleteProgram);

export default router;
