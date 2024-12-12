const express = require('express');
const { validateRequest } = require('../middleware/validator');
const accountController = require('../controllers/accountController');
const { accountSchema } = require('../utils/validationSchemas');

const router = express.Router();

router.post('/register', 
  [
    accountSchema.filter(validator => !validator.path), 
    validateRequest
  ],
  (req, res) => accountController.register(req, res)
);

router.post('/login',
  (req, res) => accountController.login(req, res)
);

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

router.get('/',
  (req, res, next) => {
    if (!req.query.userId) {
      return res.status(400).json({ error: 'userId is required in query parameters' });
    }
    next();
  },
  (req, res) => accountController.getAccountInfo(req, res)
);

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