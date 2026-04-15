import mongoose from 'mongoose';

const placementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide student name'],
    trim: true
  },
  degree: {
    type: String,
    trim: true,
    default: ''
  },
  score: {
    type: String,
    trim: true,
    default: ''
  },
  year: {
    type: String,
    trim: true,
    default: ''
  },
  dept: {
    type: String,
    trim: true,
    default: ''
  },
  company: {
    type: String,
    trim: true,
    default: ''
  },
  xLink: {
    type: String,
    trim: true,
    default: ''
  },
  linkedinLink: {
    type: String,
    trim: true,
    default: ''
  },
  instagramLink: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

placementSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Placement', placementSchema);
