import Razorpay from 'razorpay';
import crypto from 'crypto';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import InternshipEnrollment from '../models/InternshipEnrollment.js';
import InternshipProgram from '../models/InternshipProgram.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendEnrollmentEmail } from '../utils/emailService.js';

const getRazorpay = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const calcValidUntil = (duration) => {
  if (!duration) return null;
  const now = new Date();
  const d = duration.toLowerCase();
  const num = parseInt(d);
  if (isNaN(num)) return null;
  if (d.includes('year')) return new Date(now.setFullYear(now.getFullYear() + num));
  if (d.includes('month')) return new Date(now.setMonth(now.getMonth() + num));
  if (d.includes('week')) return new Date(now.setDate(now.getDate() + num * 7));
  if (d.includes('day')) return new Date(now.setDate(now.getDate() + num));
  return null;
};

// @desc    Create Razorpay order (course or internship)
// @route   POST /api/payments/create-order
// @access  Public
export const createOrder = asyncHandler(async (req, res) => {
  const { courseId, internshipId } = req.body;

  let title, price;

  if (internshipId) {
    const program = await InternshipProgram.findById(internshipId);
    if (!program) return res.status(404).json({ success: false, message: 'Internship program not found' });
    if (!program.price || program.price <= 0) return res.status(400).json({ success: false, message: 'Program price not set' });
    title = program.title;
    price = program.price;
  } else if (courseId) {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (!course.price || course.price <= 0) return res.status(400).json({ success: false, message: 'Course price not set' });
    title = course.title;
    price = course.price;
  } else {
    return res.status(400).json({ success: false, message: 'Please provide courseId or internshipId' });
  }

  const options = {
    amount: price * 100,
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
    notes: { title }
  };

  const order = await getRazorpay().orders.create(options);

  res.status(200).json({
    success: true,
    data: { orderId: order.id, amount: order.amount, currency: order.currency, title, price }
  });
});

// @desc    Verify payment & create enrollment
// @route   POST /api/payments/verify
// @access  Public
export const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id, razorpay_payment_id, razorpay_signature,
    name, email, phone, course, internshipId, message, amount
  } = req.body;

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: 'Payment verification failed' });
  }

  let enrollment;

  if (internshipId) {
    const internshipData = await InternshipProgram.findById(internshipId).select('duration');
    const validUntil = calcValidUntil(internshipData?.duration);

    enrollment = await InternshipEnrollment.create({
      name, email, phone, program: course, message: message || '',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentStatus: 'Paid',
      status: 'Paid',
      amount: amount / 100,
      validUntil
    });
  } else {
    // Calculate validUntil from course duration
    const courseData = await Course.findOne({ title: course }).select('duration');
    const validUntil = calcValidUntil(courseData?.duration);

    // Save to Enrollment (course)
    enrollment = await Enrollment.create({
      name, email, phone, course, message: message || '',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentStatus: 'Paid',
      status: 'Paid',
      amount: amount / 100,
      validUntil
    });
  }

  sendEnrollmentEmail({ name, email, phone, course, message })
    .then(() => console.log('[PAYMENT] Enrollment email sent'))
    .catch(err => console.error('[PAYMENT] Email failed:', err.message));

  res.status(201).json({
    success: true,
    message: 'Payment verified and enrollment created successfully',
    data: enrollment
  });
});
