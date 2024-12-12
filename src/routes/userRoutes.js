const express = require('express');
const multer = require('multer');
const { validateRequest } = require('../middleware/validator');
const UserController = require('../controllers/userController');
const { photoUploadSchema } = require('../utils/validationSchemas');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

router.post('/photo', 
  upload.single('photo'),
  photoUploadSchema,
  validateRequest,
  UserController.uploadPhoto
);

router.delete('/photo',
  UserController.deletePhoto
);

module.exports = router;