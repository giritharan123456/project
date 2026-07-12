const mongoose = require('mongoose');
const logger = require('../utils/logger');

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }
  // Reset stale/rejected promise
  if (cached.promise) {
    try { await cached.promise; } catch { cached.promise = null; }
  }
  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      logger.error('MONGODB_URI is not set');
      return null;
    }
    cached.promise = mongoose.connect(uri).then((m) => m);
  }
  try {
    cached.conn = await cached.promise;
    logger.info('MongoDB Connected Successfully');
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    cached.promise = null;
    cached.conn = null;
    if (process.env.VERCEL !== '1' && process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
  return cached.conn;
};

module.exports = connectDB;
