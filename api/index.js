const app = require('../server/server');

module.exports = async function handler(req, res) {
  try {
    return await app(req, res);
  } catch (err) {
    console.error('Vercel handler error:', err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
};
