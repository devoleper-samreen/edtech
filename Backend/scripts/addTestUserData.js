import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const enrollmentSchema = new mongoose.Schema({ name: String, email: String, phone: String, course: String, message: String, status: String, paymentId: String, orderId: String, paymentStatus: String, amount: Number }, { timestamps: true });
const internshipEnrollmentSchema = new mongoose.Schema({ name: String, email: String, phone: String, program: String, message: String, status: String, paymentId: String, orderId: String, paymentStatus: String, amount: Number }, { timestamps: true });
const enquirySchema = new mongoose.Schema({ name: String, email: String, phone: String, course: String, message: String, status: String }, { timestamps: true });
const callbackSchema = new mongoose.Schema({ name: String, phone: String, email: String, type: String, message: String, status: String }, { timestamps: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
const InternshipEnrollment = mongoose.model('InternshipEnrollment', internshipEnrollmentSchema);
const Enquiry = mongoose.model('Enquiry', enquirySchema);
const CallbackRequest = mongoose.model('CallbackRequest', callbackSchema);

async function addData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Course Enrollment
    await Enrollment.create({
      name: 'Test User',
      email: 'test@test.com',
      phone: '+919876543210',
      course: 'Full Stack Web Development',
      message: 'Test enrollment',
      status: 'Paid',
      paymentId: 'pay_test123',
      orderId: 'order_test123',
      paymentStatus: 'Paid',
      amount: 4999
    });
    console.log('✅ Course enrollment added');

    // Internship Enrollment
    await InternshipEnrollment.create({
      name: 'Test User',
      email: 'test@test.com',
      phone: '+919876543210',
      program: 'Internet of Things (IoT)',
      message: 'Test internship enrollment',
      status: 'Paid',
      paymentId: 'pay_test456',
      orderId: 'order_test456',
      paymentStatus: 'Paid',
      amount: 4999
    });
    console.log('✅ Internship enrollment added');

    // Enquiry
    await Enquiry.create({
      name: 'Test User',
      email: 'test@test.com',
      phone: '+919876543210',
      course: 'Data Science & Analytics',
      message: 'I want to know more about this course.',
      status: 'New'
    });
    console.log('✅ Enquiry added');

    // Callback Request
    await CallbackRequest.create({
      name: 'Test User',
      phone: '+919876543210',
      email: 'test@test.com',
      type: 'General',
      message: 'Please call me back regarding course details.',
      status: 'Pending'
    });
    console.log('✅ Callback request added');

    console.log('\nAll test data added for test@test.com!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('Done!');
  }
}

addData();
