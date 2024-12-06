const express = require('express');
const { validateRequest } = require('../middleware/validator');
const AccountController = require('../controllers/accountController');
const { accountSchema } = require('../utils/validationSchemas');

const router = express.Router();

// Save or update account information
router.post('/', 
  (req, res, next) => {
    if (!req.query.userId) {
      return res.status(400).json({ error: 'userId is required in query parameters' });
    }
    next();
  },
  accountSchema,
  validateRequest,
  AccountController.saveAccountInfo
);

// Get account information
router.get('/',
  (req, res, next) => {
    if (!req.query.userId) {
      return res.status(400).json({ error: 'userId is required in query parameters' });
    }
    next();
  },
  AccountController.getAccountInfo
);

// Update account information
router.put('/',
  (req, res, next) => {
    if (!req.query.userId) {
      return res.status(400).json({ error: 'userId is required in query parameters' });
    }
    next();
  },
  accountSchema,
  validateRequest,
  AccountController.updateAccountInfo
);

module.exports = router;