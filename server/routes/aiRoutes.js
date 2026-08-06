const express = require('express');
const router = express.Router();
const { generateInsights, parseVoiceCommand } = require('../controllers/aiController');

router.post('/insights', generateInsights);
router.post('/voice', parseVoiceCommand);

module.exports = router;
