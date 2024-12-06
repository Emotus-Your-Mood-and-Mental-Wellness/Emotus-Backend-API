const { body, query } = require('express-validator');
const { isValidDateFormat } = require('./dateUtils');

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
  query('startDate').optional().custom(isValidDateFormat)
    .withMessage('Start date must be in YYYY-MM-DD format'),
  query('endDate').optional().custom(isValidDateFormat)
    .withMessage('End date must be in YYYY-MM-DD format')
];

const getAnalyticsSchema = [
  query('startDate').optional().custom(isValidDateFormat)
    .withMessage('Start date must be in YYYY-MM-DD format'),
  query('endDate').optional().custom(isValidDateFormat)
    .withMessage('End date must be in YYYY-MM-DD format'),
  query('userId').optional().isString(),
  query('period').optional().isIn(['daily', 'weekly', 'monthly'])
    .withMessage('Period must be daily, weekly, or monthly')
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

const accountSchema = [
  body('username').optional().trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),
  body('email').optional().trim().isEmail()
    .withMessage('Invalid email format'),
  body('password').optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('profilePhotoUrl').optional().isURL()
    .withMessage('Profile photo URL must be a valid URL'),
  query('userId').optional().isString()
];

module.exports = {
  createMoodSchema,
  updateMoodSchema,
  getMoodsSchema,
  getAnalyticsSchema,
  notificationSettingsSchema,
  photoUploadSchema,
  accountSchema
};