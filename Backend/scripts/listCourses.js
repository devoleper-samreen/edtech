import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const courseSchema = new mongoose.Schema({ title: String, duration: String, status: String });
const Course = mongoose.model('Course', courseSchema);

async function list() {
  await mongoose.connect(process.env.MONGODB_URI);
  const courses = await Course.find({ status: { $in: ['published', 'Published'] } }).select('title duration');
  courses.forEach(c => console.log(`"${c.title}" | ${c.duration}`));
  await mongoose.connection.close();
}
list().catch(console.error);
