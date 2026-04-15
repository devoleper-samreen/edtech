import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'https://ed-tech1.vercel.app',
  process.env.CLIENT_URL?.replace(/\/$/, '')
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import callbackRoutes from './routes/callbackRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import batchRoutes from './routes/batchRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

// API Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'EdTech Platform API is running',
    version: '1.0.0'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
    emailUser: process.env.EMAIL_USER || 'NOT SET'
  });
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/callbacks', callbackRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/student', studentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║   EdTech Platform Server Started     ║
  ╠═══════════════════════════════════════╣
  ║   Environment: ${process.env.NODE_ENV || 'development'}              ║
  ║   Port: ${PORT}                          ║
  ║   URL: http://localhost:${PORT}         ║
  ╚═══════════════════════════════════════╝
  `);
});

export default app;
