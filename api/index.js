const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const app = express();

app.set('trust proxy', true);

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.includes('.vercel.app') || origin.includes('localhost') || origin.includes('ngrok-free.dev')) {
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

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

const passport = require('../backend/config/passport');
app.use(passport.initialize());

app.use('/api/auth', require('../backend/routes/auth'));
app.use('/api/districts', require('../backend/routes/districts'));
app.use('/api/areas', require('../backend/routes/areas'));
app.use('/api/market-data', require('../backend/routes/marketData'));
app.use('/api/comparison', require('../backend/routes/comparison'));
app.use('/api/forecasting', require('../backend/routes/forecasting'));
app.use('/api/search', require('../backend/routes/search'));
app.use('/api/admin', require('../backend/routes/admin'));
app.use('/api/notifications', require('../backend/routes/notifications'));
app.use('/api/analytics', require('../backend/routes/analytics'));
app.use('/api/workspace', require('../backend/routes/workspace'));
app.use('/api/content', require('../backend/routes/content'));
app.use('/api/explorer', require('../backend/routes/explorer'));
app.use('/api/ai', require('../backend/routes/ai'));
app.use('/api/history', require('../backend/routes/history'));

app.use(require('../backend/middleware/errorHandler'));

module.exports = app;
