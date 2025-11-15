const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login-google', authController.loginUser);
router.post('/register', authController.registerApp); // returns app info + api key
router.get('/api-key', authController.getApiKey);
router.post('/revoke', authController.revokeApiKey);
router.post('/regenerate', authController.regenerateApiKey);

module.exports = router;