const { MOODS } = require('../constants/moods');

// Mapping of various mood inputs to standardized format
const moodMappings = {
  // Standard moods
  'happy': MOODS.HAPPY,
  'happiness': MOODS.HAPPY,
  'joyful': MOODS.HAPPY,
  'joy': MOODS.HAPPY,

  'sadness': MOODS.SADNESS,
  'sad': MOODS.SADNESS,
  'melancholy': MOODS.SADNESS,
  'down': MOODS.SADNESS,

  'anger': MOODS.ANGER,
  'angry': MOODS.ANGER,
  'frustrated': MOODS.ANGER,
  'mad': MOODS.ANGER,

  'fear': MOODS.FEAR,
  'fearful': MOODS.FEAR,
  'scared': MOODS.FEAR,
  'anxious': MOODS.FEAR,
  'anxiety': MOODS.FEAR,

  'love': MOODS.LOVE,
  'loving': MOODS.LOVE,
  'loved': MOODS.LOVE,
  'affection': MOODS.LOVE
};

/**
 * Normalizes mood string to standard capitalized format
 * @param {string} mood - The mood to normalize
 * @returns {string} - Normalized mood string
 */
const normalizeMood = (mood) => {
  if (!mood) return 'Unknown';
  
  const normalizedInput = mood.toLowerCase().trim();
  return moodMappings[normalizedInput] || MOODS.HAPPY; // Default to Happy if unknown
};

/**
 * Normalizes an array of moods
 * @param {string[]} moods - Array of moods to normalize
 * @returns {string[]} - Array of normalized moods
 */
const normalizeMoods = (moods) => {
  return moods.map(mood => normalizeMood(mood));
};

/**
 * Checks if a mood is valid
 * @param {string} mood - The mood to validate
 * @returns {boolean} - Whether the mood is valid
 */
const isValidMood = (mood) => {
  return Object.values(MOODS).includes(normalizeMood(mood));
};

module.exports = {
  normalizeMood,
  normalizeMoods,
  isValidMood
};