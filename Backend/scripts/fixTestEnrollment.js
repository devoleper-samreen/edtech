import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const enrollmentSchema = new mongoose.Schema({ name: String, email: String, course: String, status: String, validUntil: Date }, { timestamps: true });
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

const calcValidUntil = (duration, from) => {
  if (!duration) return null;
  const d = duration.toLowerCase();
  const num = parseInt(d);
  if (isNaN(num)) return null;
  const date = new Date(from);
  if (d.includes('year')) date.setFullYear(date.getFullYear() + num);
  else if (d.includes('month')) date.setMonth(date.getMonth() + num);
  else if (d.includes('week')) date.setDate(date.getDate() + num * 7);
  return date;
};

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI);
  const e = await Enrollment.findOne({ email: 'test@test.com', status: 'Paid' });
  if (e) {
    e.course = 'Python Full Stack Development';
    e.validUntil = calcValidUntil('5 Months', e.createdAt);
    await e.save();
    console.log(`Updated: ${e.name} → ${e.course} | valid till ${e.validUntil}`);
  }
  await mongoose.connection.close();
}
fix().catch(console.error);
