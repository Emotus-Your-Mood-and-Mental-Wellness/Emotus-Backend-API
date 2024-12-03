const { body, query } = require('express-validator');

const createMoodSchema = [
  body('diaryEntry').notEmpty().trim().escape()
    .withMessage('Diary entry is required'),
  body('mood').optional()
    .isIn(['Happy', 'Sad', 'Angry', 'Fearful', 'Love'])
    .withMessage('Invalid mood type'),
  body('stressLevel').optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Stress level must be between 1 and 10')
];

const updateMoodSchema = [
  body('diaryEntry').optional().trim().escape(),
  body('mood').optional()
    .isIn(['Happy', 'Sad', 'Angry', 'Fearful', 'Love']),
  body('stressLevel').optional()
    .isInt({ min: 1, max: 10 })
];

const getMoodsSchema = [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
];

const getAnalyticsSchema = [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('userId').optional().isString()
];

const notificationSettingsSchema = [
  body('moodReminders').optional().isBoolean(),
  body('weeklySummary').optional().isBoolean(),
  body('dailyReminders').optional().isBoolean(),
  body('reminderTimes').optional().isArray(),
  body('reminderTimes.*').optional().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  query('userId').optional().isString()
];

module.exports = {
  createMoodSchema,
  updateMoodSchema,
  getMoodsSchema,
  getAnalyticsSchema,
  notificationSettingsSchema
};