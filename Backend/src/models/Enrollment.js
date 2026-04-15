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
    enum: ['New', 'Contacted', 'Enrolled', 'Cancelled'],
    default: 'New'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries
enrollmentSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Enrollment', enrollmentSchema);
