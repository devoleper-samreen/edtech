import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
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
    required: [true, 'Please specify the course of interest']
  },
  message: {
    type: String,
    required: [true, 'Please provide a message']
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Resolved'],
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
enquirySchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Enquiry', enquirySchema);
