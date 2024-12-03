const express = require('express');
const { validateRequest } = require('../middleware/validator');
const NotificationController = require('../controllers/notificationController');
const { notificationSettingsSchema } = require('../utils/validationSchemas');

const router = express.Router();

// Update notification settings
router.put('/settings', notificationSettingsSchema, validateRequest, NotificationController.updateSettings);

module.exports = router;