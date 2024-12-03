const express = require('express');
const { validateRequest } = require('../middleware/validator');
const MoodController = require('../controllers/moodController');
const { 
  createMoodSchema, 
  updateMoodSchema, 
  getMoodsSchema 
} = require('../utils/validationSchemas');

const router = express.Router();

// Create new mood entry
router.post('/', createMoodSchema, validateRequest, MoodController.createMoodEntry);

// Get mood entries with optional date filtering
router.get('/', getMoodsSchema, validateRequest, MoodController.getMoodEntries);

// Update mood entry
router.put('/:entryId', updateMoodSchema, validateRequest, MoodController.updateMoodEntry);

// Delete mood entry
router.delete('/:entryId', MoodController.deleteMoodEntry);

module.exports = router;