const express = require('express');
const app = express();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', vercel: process.env.VERCEL, mongo: !!process.env.MONGODB_URI });
});

app.use('/api/*', (req, res) => {
  res.json({ status: 'ok', path: req.path });
});

module.exports = app;
