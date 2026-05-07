import mongoose from 'mongoose';

const hiringPartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide partner name'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

export default mongoose.model('HiringPartner', hiringPartnerSchema);
