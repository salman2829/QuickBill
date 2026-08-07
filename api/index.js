const path = require('path');

// Load env: server/.env first (canonical), then root .env as fallback
require('dotenv').config({ path: path.join(__dirname, '..', 'server', '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = require('../server/server.js');

module.exports = (req, res) => {
  return app(req, res);
};
