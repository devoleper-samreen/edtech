import HiringPartner from '../models/HiringPartner.js';

// Public - active partners only
export const getActiveHiringPartners = async (req, res) => {
  try {
    const partners = await HiringPartner.find({ status: 'Active' }).sort({ createdAt: 1 });
    res.json({ success: true, data: partners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin - all partners
export const getAllHiringPartners = async (req, res) => {
  try {
    const partners = await HiringPartner.find().sort({ createdAt: 1 });
    res.json({ success: true, data: partners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createHiringPartner = async (req, res) => {
  try {
    const partner = await HiringPartner.create(req.body);
    res.status(201).json({ success: true, data: partner });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateHiringPartner = async (req, res) => {
  try {
    const partner = await HiringPartner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });
    res.json({ success: true, data: partner });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteHiringPartner = async (req, res) => {
  try {
    const partner = await HiringPartner.findByIdAndDelete(req.params.id);
    if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });
    res.json({ success: true, message: 'Partner deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
