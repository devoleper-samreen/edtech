import mongoose from 'mongoose';

const callbackRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    default: ''
  },
  type: {
    type: String,
    enum: ['General', 'Corporate', 'Hire'],
    default: 'General'
  },
  company: {
    type: String,
    trim: true,
    default: ''
  },
  requiredTraining: {
    type: String,
    trim: true,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'Scheduled', 'Completed'],
    default: 'Pending'
  },
  notes: {
    type: String,
    default: ''
  },
  scheduledDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
callbackRequestSchema.index({ status: 1, createdAt: -1 });
callbackRequestSchema.index({ type: 1 });

export default mongoose.model('CallbackRequest', callbackRequestSchema);
