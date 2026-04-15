import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Please select a course']
  },
  mode: {
    type: String,
    enum: ['Online', 'Offline', 'Hybrid'],
    default: 'Online'
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date']
  },
  timing: {
    type: String,
    required: [true, 'Please provide batch timing']
  },
  days: {
    type: String,
    enum: ['Weekday', 'Weekend', 'Daily'],
    default: 'Weekday'
  },
  contact: {
    type: String,
    default: ''
  },
  maxStudents: {
    type: Number,
    default: 30
  },
  enrolledCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  }
}, {
  timestamps: true
});

// Index for faster queries
batchSchema.index({ course: 1, status: 1 });
batchSchema.index({ startDate: 1 });

export default mongoose.model('Batch', batchSchema);
