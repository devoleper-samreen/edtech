import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const internshipSchema = new mongoose.Schema({
  title: String, description: String, duration: String,
  price: Number, thumbnail: String, enrolledCount: Number, status: String
}, { timestamps: true });

const InternshipProgram = mongoose.model('InternshipProgram', internshipSchema);

const testPrograms = [
  {
    title: "Full Stack Web Development",
    description: "Learn MERN stack with hands-on projects. Build real-world applications using MongoDB, Express, React and Node.js.",
    duration: "6 Weeks",
    price: 4999,
    thumbnail: "",
    enrolledCount: 142,
    status: "Active"
  },
  {
    title: "Artificial Intelligence & Machine Learning",
    description: "Master AI/ML concepts with Python. Covers supervised learning, neural networks, and real-world AI applications.",
    duration: "8 Weeks",
    price: 5999,
    thumbnail: "",
    enrolledCount: 98,
    status: "Active"
  },
  {
    title: "Data Science & Analytics",
    description: "From data cleaning to visualization and predictive modeling using Python, Pandas, and Power BI.",
    duration: "6 Weeks",
    price: 4499,
    thumbnail: "",
    enrolledCount: 76,
    status: "Active"
  },
  {
    title: "Cyber Security & Ethical Hacking",
    description: "Learn offensive and defensive security, penetration testing, and network security fundamentals.",
    duration: "8 Weeks",
    price: 5499,
    thumbnail: "",
    enrolledCount: 54,
    status: "Active"
  }
];

async function addData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await InternshipProgram.insertMany(testPrograms);
    console.log(`Added ${result.length} internship programs:`);
    result.forEach(p => console.log(` - ${p.title}`));
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('Done!');
  }
}

addData();
