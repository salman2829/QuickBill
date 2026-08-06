const express = require('express');
const router = express.Router();
const { register, login, getMe, checkEmail } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/check-email', checkEmail);
router.get('/me', protect, getMe);

module.exports = router;
