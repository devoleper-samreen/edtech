import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import { hashPassword } from './src/utils/hashPassword.js';

// Load environment variables
dotenv.config();

const createFirstAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('⚠️  Admin already exists!');
      console.log('Email:', adminExists.email);
      process.exit(0);
    }

    // Admin details (You can modify these)
    const adminData = {
      name: 'Super Admin',
      email: 'admin@edtech.com',
      password: 'admin123', // Change this password!
      phone: '+91 9876543210',
      role: 'admin',
      isActive: true
    };

    // Hash password
    const hashedPassword = await hashPassword(adminData.password);

    // Create admin
    const admin = await User.create({
      ...adminData,
      password: hashedPassword
    });

    console.log('\n🎉 First admin created successfully!\n');
    console.log('═══════════════════════════════════');
    console.log('Admin Credentials:');
    console.log('═══════════════════════════════════');
    console.log('Email:', admin.email);
    console.log('Password:', adminData.password);
    console.log('═══════════════════════════════════');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

// Run the script
createFirstAdmin();
