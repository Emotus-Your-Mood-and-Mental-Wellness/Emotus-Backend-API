const express = require('express');
const { validateRequest } = require('../middleware/validator');
const DailyTipsController = require('../controllers/dailyTipsController');

const router = express.Router();

router.get('/', DailyTipsController.getDailyTip);

module.exports = router;