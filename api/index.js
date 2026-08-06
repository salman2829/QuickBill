const path = require('path');

// Load env vars
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', 'server', '.env') });

const app = require('../server/server.js');

module.exports = (req, res) => {
  return app(req, res);
};
