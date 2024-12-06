const express = require('express');
const { validateRequest } = require('../middleware/validator');
const AccountController = require('../controllers/accountController');
const { accountSchema } = require('../utils/validationSchemas');

const router = express.Router();

// Save or update account information
router.post('/', accountSchema, validateRequest, AccountController.saveAccountInfo);

// Get account information
router.get('/', AccountController.getAccountInfo);

// Update account information
router.put('/', accountSchema, validateRequest, AccountController.updateAccountInfo);

module.exports = router;