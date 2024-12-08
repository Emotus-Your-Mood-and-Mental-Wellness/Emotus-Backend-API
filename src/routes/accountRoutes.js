const express = require('express');
const { validateRequest } = require('../middleware/validator');
const accountController = require('../controllers/accountController');
const { accountSchema } = require('../utils/validationSchemas');

const router = express.Router();

// Register new account (no userId required)
router.post('/register', 
  [
    accountSchema.filter(validator => !validator.path), // Remove userId validation
    validateRequest
  ],
  (req, res) => accountController.register(req, res)
);

// Login route
router.post('/login',
  (req, res) => accountController.login(req, res)
);

// Save or update account information (requires userId)
router.post('/', 
  (req, res, next) => {
    if (!req.query.userId) {
      return res.status(400).json({ error: 'userId is required in query parameters' });
    }
    next();
  },
  accountSchema,
  validateRequest,
  (req, res) => accountController.saveAccountInfo(req, res)
);

// Get account information (requires userId)
router.get('/',
  (req, res, next) => {
    if (!req.query.userId) {
      return res.status(400).json({ error: 'userId is required in query parameters' });
    }
    next();
  },
  (req, res) => accountController.getAccountInfo(req, res)
);

// Update account information (requires userId)
router.put('/',
  (req, res, next) => {
    if (!req.query.userId) {
      return res.status(400).json({ error: 'userId is required in query parameters' });
    }
    next();
  },
  accountSchema,
  validateRequest,
  (req, res) => accountController.updateAccountInfo(req, res)
);

module.exports = router;