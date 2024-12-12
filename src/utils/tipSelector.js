const {
    happyTips,
    sadnessTips,
    fearTips,
    loveTips,
    angerTips,
    generalTips
  } = require('./tipCategories');
  
  const getTipsByMood = (mood) => {
    const tipCategories = {
      happy: happyTips,
      sadness: sadnessTips,
      fear: fearTips,
      love: loveTips,
      anger: angerTips,
      general: generalTips
    };
  
    const selectedTips = tipCategories[mood] || generalTips;
    
    return {
      "Take a Moment for Yourself": getRandomTip(selectedTips.takeMoment),
      "Kind Reminder": getRandomTip(selectedTips.kindReminder),
      "Quick Activity": getRandomTip(selectedTips.quickActivity),
      "Relaxation Exercise": getRandomTip(selectedTips.relaxationExercise)
    };
  };
  
  const getRandomTip = (tips) => {
    return tips[Math.floor(Math.random() * tips.length)];
  };
  
  module.exports = {
    getTipsByMood
  };