import express from 'express';
import { getAllInternshipEnrollments, updateInternshipEnrollment, deleteInternshipEnrollment } from '../controllers/internshipEnrollmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.use(authorize('admin'));
router.get('/', getAllInternshipEnrollments);
router.put('/:id', updateInternshipEnrollment);
router.delete('/:id', deleteInternshipEnrollment);

export default router;
