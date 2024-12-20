const { body, query } = require('express-validator');
const { isValidDateFormat } = require('./dateUtils');
const { VALID_MOODS } = require('../constants/moods');

const createMoodSchema = [
  body('diaryEntry').notEmpty().trim().escape()
    .withMessage('Diary entry is required'),
  body('mood').optional()
    .custom(value => {
      if (!value) return true;
      if (!VALID_MOODS.includes(value)) {
        throw new Error(`Invalid mood type. Must be one of: ${VALID_MOODS.join(', ')}`);
      }
      return true;
    }),
  body('stressLevel').optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Stress level must be Low, Medium, or High')
];

const updateMoodSchema = [
  body('diaryEntry').optional().trim().escape(),
  body('mood').optional()
    .custom(value => {
      if (!value) return true;
      if (!VALID_MOODS.includes(value)) {
        throw new Error(`Invalid mood type. Must be one of: ${VALID_MOODS.join(', ')}`);
      }
      return true;
    }),
  body('stressLevel').optional()
    .isIn(['Low', 'Medium', 'High'])
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
  query('period').optional().isIn(['daily', 'weekly', 'monthly'])
    .withMessage('Period must be daily, weekly, or monthly')
];

const notificationSettingsSchema = [
  body('moodReminders').optional().isBoolean(),
  body('weeklySummary').optional().isBoolean(),
  body('dailyReminders').optional().isBoolean(),
  body('reminderTimes').optional().isArray(),
  body('reminderTimes.*').optional().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
];

const photoUploadSchema = [
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
  body('username').trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),
  body('email').optional().trim().isEmail()
    .withMessage('Invalid email format'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('profilePhotoUrl').optional().isURL()
    .withMessage('Profile photo URL must be a valid URL')
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