import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a course title'],
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a course description']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CourseCategory',
    required: true
  },
  instructor: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide a course price'],
    min: 0
  },
  duration: {
    type: String,
    default: ''
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  thumbnail: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'Draft', 'Published', 'Archived'],
    default: 'draft'
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
courseSchema.index({ category: 1, status: 1 });

export default mongoose.model('Course', courseSchema);
