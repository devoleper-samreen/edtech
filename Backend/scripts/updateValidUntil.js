import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const enrollmentSchema = new mongoose.Schema({ name: String, email: String, course: String, status: String, validUntil: Date }, { timestamps: true });
const internshipEnrollmentSchema = new mongoose.Schema({ name: String, email: String, program: String, status: String, validUntil: Date }, { timestamps: true });
const courseSchema = new mongoose.Schema({ title: String, duration: String });
const internshipSchema = new mongoose.Schema({ title: String, duration: String });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
const InternshipEnrollment = mongoose.model('InternshipEnrollment', internshipEnrollmentSchema);
const Course = mongoose.model('Course', courseSchema);
const InternshipProgram = mongoose.model('InternshipProgram', internshipSchema);

const calcValidUntil = (duration, from) => {
  if (!duration) return null;
  const d = duration.toLowerCase();
  const num = parseInt(d);
  if (isNaN(num)) return null;
  const date = new Date(from);
  if (d.includes('year')) date.setFullYear(date.getFullYear() + num);
  else if (d.includes('month')) date.setMonth(date.getMonth() + num);
  else if (d.includes('week')) date.setDate(date.getDate() + num * 7);
  else if (d.includes('day')) date.setDate(date.getDate() + num);
  return date;
};

async function update() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected');

    // Update course enrollments
    const enrollments = await Enrollment.find({ validUntil: null, status: 'Paid' });
    for (const e of enrollments) {
      const course = await Course.findOne({ title: { $regex: new RegExp(e.course.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') } });
      if (course?.duration) {
        e.validUntil = calcValidUntil(course.duration, e.createdAt);
        await e.save();
        console.log(`Course: ${e.name} - valid till ${e.validUntil}`);
      }
    }

    // Update internship enrollments
    const internships = await InternshipEnrollment.find({ validUntil: null, status: 'Paid' });
    for (const e of internships) {
      const program = await InternshipProgram.findOne({ title: { $regex: new RegExp(e.program.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') } });
      if (program?.duration) {
        e.validUntil = calcValidUntil(program.duration, e.createdAt);
        await e.save();
        console.log(`Internship: ${e.name} - valid till ${e.validUntil}`);
      }
    }

    console.log('Done!');
  } catch (err) {
    console.error(err.message);
  } finally {
    await mongoose.connection.close();
  }
}

update();
