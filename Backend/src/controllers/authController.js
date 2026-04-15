import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import { hashPassword, comparePassword } from '../utils/hashPassword.js';

// @desc    Register a new user (Student only)
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email and password'
    });
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists'
    });
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user - Always as student (Admin can only be created by existing admin)
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    role: 'student' // Force student role for public registration
  });

  // Generate token
  const token = generateToken(user._id, user.role);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  console.error('[LOGIN] Request received for:', req.body.email);
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  // Find user and include password field
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    console.error('[LOGIN] User not found:', email);
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check password
  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    console.error('[LOGIN] Invalid password for:', email);
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Your account has been deactivated. Please contact support.'
    });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user._id, user.role);
  console.error('[LOGIN] Success for:', email, '| role:', user.role);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar
      },
      token
    }
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Get bio of logged in user
// @route   GET /api/auth/bio
// @access  Private
export const getBio = asyncHandler(async (req, res) => {
  console.log('[BIO] Request received for user id:', req.user.id);
  const user = await User.findById(req.user.id);
  console.log('[BIO] User fetched:', user?.email);

  res.status(200).json({
    success: true,
    deployedAt: new Date().toISOString(),
    data: {
      name: user.name,
      email: user.email,
      phone: user.phone || '—',
      role: user.role,
      memberSince: user.createdAt,
      lastLogin: user.lastLogin,
      enrolledCourses: user.enrolledCourses?.length || 0,
    }
  });
});

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide current and new password'
    });
  }

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  const isPasswordValid = await comparePassword(currentPassword, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Hash new password
  user.password = await hashPassword(newPassword);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  });
});
