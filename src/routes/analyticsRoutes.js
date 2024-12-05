const express = require('express');
const { validateRequest } = require('../middleware/validator');
const AnalyticsController = require('../controllers/analyticsController');
const { getAnalyticsSchema } = require('../utils/validationSchemas');

const router = express.Router();

// Get mood trends
router.get('/trends', getAnalyticsSchema, validateRequest, AnalyticsController.getMoodTrends);

// Get summary (daily, weekly, or monthly)
router.get('/summary', getAnalyticsSchema, validateRequest, AnalyticsController.getSummary);

module.exports = router;