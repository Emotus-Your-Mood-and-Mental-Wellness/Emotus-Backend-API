const express = require('express');
const { validateRequest } = require('../middleware/validator');
const DailyTipsController = require('../controllers/dailyTipsController');
const { dailyTipsSchema } = require('../utils/validationSchemas');

const router = express.Router();

// Get daily tip based on mood analysis
router.get('/', dailyTipsSchema, validateRequest, DailyTipsController.getDailyTip);

module.exports = router;