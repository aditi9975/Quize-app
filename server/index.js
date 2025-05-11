import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import quizRoutes from './routes/quizzes.js';
import quizResultRoutes from './routes/quizResults.js';

// Load environment variables
dotenv.config();

// ES Module support for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : 'http://localhost:5173', // Vite's default port
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Debug route to check if server is running
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Connect to MongoDB with detailed logging
const connectToDB = async () => {
  const dbUri = process.env.MONGODB_URI;
  if (!dbUri) {
    console.error('❌ MongoDB URI is not defined in environment variables');
    return;
  }

  console.log('Attempting to connect to MongoDB...');

  const connectWithRetry = async (retries = 5, delay = 5000) => {
    try {
      await mongoose.connect(dbUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      console.log('✅ MongoDB Connected!');

      console.log(`Connected to database: ${mongoose.connection.name}`);
      console.log(`Host: ${mongoose.connection.host}`);

      mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to DB');
      });

      mongoose.connection.on('error', (err) => {
        console.error('Mongoose connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('Mongoose disconnected');
        // Attempt to reconnect
        setTimeout(connectWithRetry, delay);
      });

    } catch (error) {
      console.error('❌ MongoDB connection failed!');
      console.error(error);

      if (error.name === 'MongoServerSelectionError') {
        console.error('\nTroubleshooting steps:');
        console.error('1. Check if your MongoDB URI is correct');
        console.error('2. Add your IP address to MongoDB Atlas whitelist:');
        console.error('   - Go to MongoDB Atlas dashboard');
        console.error('   - Click on "Network Access"');
        console.error('   - Click "Add IP Address"');
        console.error('   - Add your current IP or use 0.0.0.0/0 for development');
        console.error('3. Verify your MongoDB Atlas cluster is running');
        console.error('4. Check if your username and password are correct');

        if (retries > 0) {
          console.log(`Retrying connection in ${delay / 1000} seconds... (${retries} attempts remaining)`);
          setTimeout(() => connectWithRetry(retries - 1, delay), delay);
        } else {
          console.log('Max retry attempts reached. Server will start without database connection.');
        }
      }
    }
  };

  await connectWithRetry();
};

// Connect to MongoDB
await connectToDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/quiz-results', quizResultRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API is working!',
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Debug MongoDB connection status
app.get('/api/db-status', (req, res) => {
  res.json({
    status: mongoose.connection.readyState,
    statusDescription: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
    dbName: mongoose.connection.name,
    host: mongoose.connection.host
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler caught:', err);
  res.status(500).json({
    message: 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/api/health`);
  console.log(`DB status check available at: http://localhost:${PORT}/api/db-status`);
});