import mongoose from 'mongoose';

const internshipProgramSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide program title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide program description'],
    trim: true
  },
  duration: {
    type: String,
    trim: true,
    default: ''
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  thumbnail: {
    type: String,
    default: ''
  },
  enrolledCount: {
    type: Number,
    default: 0
  },
  earlyBirdDeadline: {
    type: String,
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

export default mongoose.model('InternshipProgram', internshipProgramSchema);
