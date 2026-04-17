import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const enrollmentSchema = new mongoose.Schema({
  name: String, email: String, phone: String, course: String,
  status: String, paymentStatus: String, amount: Number
}, { timestamps: true });

const internshipEnrollmentSchema = new mongoose.Schema({
  name: String, email: String, phone: String, program: String,
  status: String, paymentStatus: String, amount: Number
}, { timestamps: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
const InternshipEnrollment = mongoose.model('InternshipEnrollment', internshipEnrollmentSchema);

async function fix() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Fix Course Enrollments
    const enrollments = await Enrollment.find({});
    let fixedEnrollments = 0;
    for (const e of enrollments) {
      const newStatus = e.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid';
      if (e.status !== newStatus) {
        e.status = newStatus;
        await e.save();
        console.log(`Course: ${e.name} → ${newStatus}`);
        fixedEnrollments++;
      }
    }
    console.log(`Fixed ${fixedEnrollments} course enrollment(s)`);

    // Fix Internship Enrollments
    const internshipEnrollments = await InternshipEnrollment.find({});
    let fixedInternship = 0;
    for (const e of internshipEnrollments) {
      const newStatus = e.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid';
      if (e.status !== newStatus) {
        e.status = newStatus;
        await e.save();
        console.log(`Internship: ${e.name} → ${newStatus}`);
        fixedInternship++;
      }
    }
    console.log(`Fixed ${fixedInternship} internship enrollment(s)`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('Done!');
  }
}

fix();
