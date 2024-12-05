const express = require('express');
const multer = require('multer');
const { validateRequest } = require('../middleware/validator');
const UserController = require('../controllers/userController');
const { photoUploadSchema } = require('../utils/validationSchemas');

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Upload profile photo
router.post('/photo', 
  upload.single('photo'),
  photoUploadSchema,
  validateRequest,
  UserController.uploadPhoto
);

// Delete profile photo
router.delete('/photo',
  UserController.deletePhoto
);

module.exports = router;