import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const internshipSchema = new mongoose.Schema({
  title: String, description: String, duration: String,
  price: Number, thumbnail: String, enrolledCount: Number,
  earlyBirdDeadline: String, status: String
}, { timestamps: true });

const InternshipProgram = mongoose.model('InternshipProgram', internshipSchema);

async function add() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const program = await InternshipProgram.create({
      title: "Internet of Things (IoT)",
      description: "Explore the world of connected devices. Build IoT solutions using sensors, microcontrollers, and cloud platforms with hands-on real-world projects.",
      duration: "6 Weeks",
      price: 4999,
      thumbnail: "",
      enrolledCount: 62,
      earlyBirdDeadline: "30 April 2026",
      status: "Active"
    });

    console.log(`Added: ${program.title}`);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('Done!');
  }
}

add();
