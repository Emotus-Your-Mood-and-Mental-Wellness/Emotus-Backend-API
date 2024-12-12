const { VALID_MOODS } = require('../constants/moods');
const { normalizeAndCapitalizeMood } = require('./moodAnalyzer');

const isValidMood = (mood) => {
  return !mood || VALID_MOODS.includes(normalizeAndCapitalizeMood(mood));
};

const isValidStressLevel = (level) => {
  if (!level) return true;
  const numLevel = Number(level);
  return !isNaN(numLevel) && numLevel >= 1 && numLevel <= 10;
};

const sanitizeEntry = (entry) => {
  return {
    ...entry,
    diaryEntry: entry.diaryEntry?.trim(),
    mood: entry.mood ? normalizeAndCapitalizeMood(entry.mood) : undefined,
    stressLevel: entry.stressLevel ? Number(entry.stressLevel) : undefined
  };
};

module.exports = {
  isValidMood,
  isValidStressLevel,
  sanitizeEntry
};