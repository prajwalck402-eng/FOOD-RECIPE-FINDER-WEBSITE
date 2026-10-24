const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);
router.put('/preferences', protect, authController.updatePreferences);
router.post('/favorites/toggle', protect, authController.toggleUserFavorite);

module.exports = router;
