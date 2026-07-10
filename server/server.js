const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/database');
const passport = require('./config/passport');
const logger = require('./utils/logger');

const app = express();

app.set('trust proxy', true);

connectDB().catch(err => {
  logger.error(`DB init failed: ${err.message}`);
});

app.use(passport.initialize());
app.use(cookieParser());

// Start guest user cleanup (only in production, not during tests or on Vercel)
if (process.env.NODE_ENV !== 'test' && process.env.VERCEL !== '1') {
  const { cleanupGuestUsers } = require('./controllers/authController');
  setInterval(cleanupGuestUsers, 6 * 60 * 60 * 1000);
} else if (process.env.VERCEL === '1') {
  // On Vercel, use cron job instead of setInterval
  const { cleanupGuestUsers } = require('./controllers/authController');
  // This will be triggered by Vercel cron
  module.exports.cleanupGuestUsers = cleanupGuestUsers;
}

app.use(morgan('short'));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://*.googleapis.com", "https://*.googleusercontent.com"],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  'http://localhost:5173',
  'http://localhost:5000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.includes('ngrok-free.dev')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many login attempts, please try again later.' },
  legacyHeaders: false,
  validate: false,
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);
app.use('/api/auth/reset-password', authLimiter);
app.use('/api/auth/google', authLimiter);
app.use('/api/auth/refresh', authLimiter);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { success: false, message: 'Too many requests, please try again later.' },
  legacyHeaders: false,
  validate: false,
});
app.use('/api', apiLimiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/districts', require('./routes/districts'));
app.use('/api/areas', require('./routes/areas'));
app.use('/api/market-data', require('./routes/marketData'));
app.use('/api/comparison', require('./routes/comparison'));
app.use('/api/forecasting', require('./routes/forecasting'));
app.use('/api/search', require('./routes/search'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/workspace', require('./routes/workspace'));
app.use('/api/content', require('./routes/content'));
app.use('/api/explorer', require('./routes/explorer'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/history', require('./routes/history'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/shares', require('./routes/shares'));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const mongoose = require('mongoose');
  const dbState = mongoose.connection.readyState;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: states[dbState] || 'unknown',
    env: process.env.NODE_ENV
  });
});

app.use(require('./middleware/errorHandler'));

const frontendBuild = path.join(__dirname, '..', 'dist');
app.use(express.static(frontendBuild));
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(frontendBuild, 'index.html'));
});

if (process.env.VERCEL !== '1' && process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

module.exports = app;
