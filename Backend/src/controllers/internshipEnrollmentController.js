import InternshipEnrollment from '../models/InternshipEnrollment.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllInternshipEnrollments = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;
  let query = {};
  if (status && status !== 'All') query.status = status;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { program: { $regex: search, $options: 'i' } }
    ];
  }
  const skip = (page - 1) * limit;
  const enrollments = await InternshipEnrollment.find(query)
    .sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
  const total = await InternshipEnrollment.countDocuments(query);
  res.status(200).json({
    success: true,
    data: { enrollments, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } }
  });
});

export const updateInternshipEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await InternshipEnrollment.findById(req.params.id);
  if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });
  const { status, notes } = req.body;
  if (status) enrollment.status = status;
  if (notes) enrollment.notes = notes;
  await enrollment.save();
  res.status(200).json({ success: true, message: 'Updated successfully', data: enrollment });
});

export const deleteInternshipEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await InternshipEnrollment.findById(req.params.id);
  if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });
  await enrollment.deleteOne();
  res.status(200).json({ success: true, message: 'Deleted successfully' });
});
