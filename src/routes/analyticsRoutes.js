const express = require('express');
const { validateRequest } = require('../middleware/validator');
const AnalyticsController = require('../controllers/analyticsController');
const { getAnalyticsSchema } = require('../utils/validationSchemas');

const router = express.Router();

router.get('/trends', getAnalyticsSchema, validateRequest, AnalyticsController.getMoodTrends);

router.get('/summary', getAnalyticsSchema, validateRequest, AnalyticsController.getDailySummary);

module.exports = router;