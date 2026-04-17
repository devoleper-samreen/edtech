import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    trim: true
  },
  course: {
    type: String,
    required: [true, 'Please specify the course']
  },
  message: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Unpaid', 'Paid'],
    default: 'Unpaid'
  },
  notes: {
    type: String,
    default: ''
  },
  paymentId: {
    type: String,
    default: ''
  },
  orderId: {
    type: String,
    default: ''
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  amount: {
    type: Number,
    default: 0
  },
  validUntil: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
enrollmentSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Enrollment', enrollmentSchema);
