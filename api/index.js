const app = require('../server/server');

module.exports = function handler(req, res) {
  return app(req, res);
};
