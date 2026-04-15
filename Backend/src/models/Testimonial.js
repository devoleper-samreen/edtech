import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Please provide company name'],
    trim: true
  },
  contactPerson: {
    type: String,
    required: [true, 'Please provide contact person name'],
    trim: true
  },
  designation: {
    type: String,
    required: [true, 'Please provide designation'],
    trim: true
  },
  shortText: {
    type: String,
    required: [true, 'Please provide short testimonial text'],
    trim: true,
    maxlength: 150
  },
  fullText: {
    type: String,
    required: [true, 'Please provide full testimonial text'],
    trim: true
  },
  rating: {
    type: Number,
    default: 5,
    min: 1,
    max: 5
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

// Index for faster queries
testimonialSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Testimonial', testimonialSchema);
