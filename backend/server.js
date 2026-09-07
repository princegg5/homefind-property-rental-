const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Allows frontend Vite dev server (e.g. http://localhost:5173 or 3000)
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'HomeFind Real Estate API is running successfully.',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      properties: '/api/properties',
      inquiries: '/api/inquiries',
    },
  });
});

// 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` HomeFind Server is running on port ${PORT}`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(` MongoDB: ${process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/homefind'}`);
  console.log(`=========================================`);
});
