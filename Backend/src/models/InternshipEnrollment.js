import mongoose from 'mongoose';

const internshipEnrollmentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  program: { type: String, required: true },
  message: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Unpaid', 'Paid'],
    default: 'Unpaid'
  },
  notes: { type: String, default: '' },
  paymentId: { type: String, default: '' },
  orderId: { type: String, default: '' },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  amount: { type: Number, default: 0 },
  validUntil: { type: Date, default: null }
}, { timestamps: true });

internshipEnrollmentSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('InternshipEnrollment', internshipEnrollmentSchema);
