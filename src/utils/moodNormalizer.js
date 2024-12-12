const { MOODS } = require('../constants/moods');

const moodMappings = {
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
 * @param {string} mood
 * @returns {string}
 */
const normalizeMood = (mood) => {
  if (!mood) return 'Unknown';
  
  const normalizedInput = mood.toLowerCase().trim();
  return moodMappings[normalizedInput] || MOODS.HAPPY;
};

/**
 * @param {string[]} moods 
 * @returns {string[]} 
 */
const normalizeMoods = (moods) => {
  return moods.map(mood => normalizeMood(mood));
};

/**
 * @param {string} mood 
 * @returns {boolean} 
 */
const isValidMood = (mood) => {
  return Object.values(MOODS).includes(normalizeMood(mood));
};

module.exports = {
  normalizeMood,
  normalizeMoods,
  isValidMood
};