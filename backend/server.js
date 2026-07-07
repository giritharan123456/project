const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/database');
const passport = require('./config/passport');
const logger = require('./utils/logger');

const app = express();

app.set('trust proxy', true);

connectDB();

app.use(passport.initialize());

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.includes('ngrok-free.dev') || origin.includes('.vercel.app')) {
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

app.use(morgan('short'));

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

app.use(require('./middleware/errorHandler'));

const frontendBuild = path.join(__dirname, '..', 'dist');
app.use(express.static(frontendBuild));
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(frontendBuild, 'index.html'));
});

if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

module.exports = app;
