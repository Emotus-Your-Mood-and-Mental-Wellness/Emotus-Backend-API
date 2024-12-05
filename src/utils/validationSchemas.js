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

const photoUploadSchema = [
  query('userId').optional().isString(),
  body('photo').custom((value, { req }) => {
    if (!req.file) {
      throw new Error('Profile photo is required');
    }
    if (!req.file.mimetype.startsWith('image/')) {
      throw new Error('File must be an image');
    }
    if (req.file.size > 5 * 1024 * 1024) {
      throw new Error('File size must not exceed 5MB');
    }
    return true;
  })
];

module.exports = {
  createMoodSchema,
  updateMoodSchema,
  getMoodsSchema,
  getAnalyticsSchema,
  notificationSettingsSchema,
  photoUploadSchema
};