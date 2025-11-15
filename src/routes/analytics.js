const express = require('express');
const router = express.Router();
const apiKeyAuth = require('../middlewares/apiKeyAuth');
const analyticsController = require('../controllers/analyticsController');
const rateLimiter = require('../middlewares/rateLimiter');

// Collect events (rate limited & authenticated)
router.post('/collect', apiKeyAuth, rateLimiter, analyticsController.collectEvent);

// Analytics endpoints
router.get('/event-summary', analyticsController.eventSummary);
router.get('/user-stats', analyticsController.userStats);

module.exports = router;