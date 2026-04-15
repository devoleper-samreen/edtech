import mongoose from 'mongoose';

const courseCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a category name'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  coursesCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('CourseCategory', courseCategorySchema);
