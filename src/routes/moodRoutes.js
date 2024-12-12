const express = require('express');
const { validateRequest } = require('../middleware/validator');
const MoodController = require('../controllers/moodController');
const { 
  createMoodSchema, 
  updateMoodSchema, 
  getMoodsSchema 
} = require('../utils/validationSchemas');

const router = express.Router();

router.post('/', createMoodSchema, validateRequest, MoodController.createMoodEntry);

router.get('/', getMoodsSchema, validateRequest, MoodController.getMoodEntries);

router.put('/:entryId', updateMoodSchema, validateRequest, MoodController.updateMoodEntry);

router.delete('/:entryId', MoodController.deleteMoodEntry);

module.exports = router;