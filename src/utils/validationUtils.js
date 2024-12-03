const isValidMood = (mood) => {
    const validMoods = ['Happy', 'Sad', 'Angry', 'Fearful', 'Love'];
    return !mood || validMoods.includes(mood);
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
      stressLevel: entry.stressLevel ? Number(entry.stressLevel) : undefined
    };
  };
  
  module.exports = {
    isValidMood,
    isValidStressLevel,
    sanitizeEntry
  };