process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err.message || err);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err.message || err);
});

const app = require('../server/server');
module.exports = app;
