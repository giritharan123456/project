const app = require('../server/server');
const connectDB = require('../server/config/database');

module.exports = async function handler(req, res) {
  try {
    await connectDB();
    return await app(req, res);
  } catch (err) {
    console.error('Vercel handler error:', err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
};
