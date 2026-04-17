import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const enrollmentSchema = new mongoose.Schema({
  name: String, email: String, phone: String, course: String,
  message: String, status: String, notes: String,
  paymentId: String, orderId: String, paymentStatus: String, amount: Number
}, { timestamps: true });

const internshipEnrollmentSchema = new mongoose.Schema({
  name: String, email: String, phone: String, program: String,
  message: String, status: String, notes: String,
  paymentId: String, orderId: String, paymentStatus: String, amount: Number
}, { timestamps: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
const InternshipEnrollment = mongoose.model('InternshipEnrollment', internshipEnrollmentSchema);

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all paid enrollments (internship payments are paid)
    const allEnrollments = await Enrollment.find({ paymentStatus: 'Paid' });
    console.log(`Found ${allEnrollments.length} paid enrollment(s) to check`);

    let moved = 0;
    for (const e of allEnrollments) {
      // Move to InternshipEnrollment
      await InternshipEnrollment.create({
        name: e.name,
        email: e.email,
        phone: e.phone,
        program: e.course,
        message: e.message || '',
        status: e.status,
        notes: e.notes || '',
        paymentId: e.paymentId,
        orderId: e.orderId,
        paymentStatus: e.paymentStatus,
        amount: e.amount
      });
      await e.deleteOne();
      console.log(`Moved: ${e.name} - ${e.course}`);
      moved++;
    }

    console.log(`\nMoved ${moved} enrollment(s) to InternshipEnrollments`);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('Done!');
  }
}

migrate();
