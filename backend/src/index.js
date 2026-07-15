import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import helmet from 'helmet';

// Import routes
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import budgetRoutes from './routes/budgets.js';
import goalRoutes from './routes/goals.js';
import subscriptionRoutes from './routes/subscriptions.js';
import dashboardRoutes from './routes/dashboard.js';
import analyticsRoutes from './routes/analytics.js';
import feedbackRoutes from './routes/feedback.js';
import newsletterRoutes from './routes/newsletter.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { authLimiter, apiLimiter } from './middleware/rateLimiter.js';
import { responseHandler } from './middleware/responseHandler.js';

async function startServer() {
  try {
    await connectDB();

    const app = express();
    const PORT = process.env.PORT || 5000;

    // Security Middleware
    app.use(helmet());
    app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: true, limit: '10kb' }));

    // Response Handler (Standardize responses)
    app.use(responseHandler);

    // Rate limiting
    app.use('/api/auth', authLimiter);
    app.use('/api', apiLimiter);

    // Health Check
    app.get('/api/health',
      (req, res) => {
        res.json({ status: 'OK', timestamp: new Date().toISOString() });
      });

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/transactions', transactionRoutes);
    app.use('/api/budgets', budgetRoutes);
    app.use('/api/goals', goalRoutes);
    app.use('/api/subscriptions', subscriptionRoutes);
    app.use('/api/dashboard', dashboardRoutes);
    app.use('/api/analytics', analyticsRoutes);
    app.use('/api/feedback', feedbackRoutes);
    app.use('/api/newsletter', newsletterRoutes);

    // Error handling middleware (must be last)
    app.use(errorHandler);

    // Start Server
    app.listen(PORT, () => {
      console.log(`FinPilot API Server running on port ${PORT}`);
    });

    return app;
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

const app = await startServer();

export default app;
