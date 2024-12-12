const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validator');
const { authenticateUser } = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();

const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('username').trim().isLength({ min: 3 })
];

const loginValidation = [
  body('idToken').exists().notEmpty()
    .withMessage('Firebase ID token is required')
];

router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);

router.get('/profile', authenticateUser, authController.getUserProfile);
router.put('/profile', authenticateUser, authController.updateUserProfile);

module.exports = router;