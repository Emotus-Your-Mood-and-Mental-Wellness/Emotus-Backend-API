const { db } = require('../config/firebase');
const { formatDate } = require('../utils/dateUtils');
const { getRandomElement } = require('../utils/moodSuggestionHelper');
const {
  happyTips,
  sadnessTips,
  fearTips,
  loveTips,
  angerTips,
  generalTips
} = require('../utils/tipCategories');

class DailyTipsService {
  static async getDailyTip(userId) {
    try {
      // Get today's date at midnight
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(startOfDay);
      endOfDay.setHours(23, 59, 59, 999);

      const moodRef = db.collection('users').doc(userId).collection('moods');
      const snapshot = await moodRef
        .where('createdAt', '>=', formatDate(startOfDay))
        .where('createdAt', '<=', formatDate(endOfDay))
        .orderBy('createdAt', 'desc')
        .get();

      const entries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      if (entries.length === 0) {
        return {
          message: "There are no mood notes today. Add some entries to get personalized tips!"
        };
      }

      const moodCounts = entries.reduce((acc, entry) => {
        const mood = entry.mood || entry.predictedMood || 'Happy';
        acc[mood] = (acc[mood] || 0) + 1;
        return acc;
      }, {});

      const dominantMood = Object.entries(moodCounts)
        .sort(([, a], [, b]) => b - a)[0][0];

      const stressLevels = entries.map(entry => entry.stressLevel || 'Low');
      const stressLevelCounts = stressLevels.reduce((acc, level) => {
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {});

      const dominantStressLevel = Object.entries(stressLevelCounts)
        .sort(([, a], [, b]) => b - a)[0][0];

      return {
        dominantMood,
        stressLevel: dominantStressLevel.toLowerCase(),
        entriesCount: entries.length,
        ...this.getFormattedTips(dominantMood.toLowerCase())
      };
    } catch (error) {
      console.error('Get daily tip error:', error);
      throw new Error('Failed to get daily tip: ' + error.message);
    }
  }

  static getFormattedTips(mood) {
    const tipCategories = {
      happy: happyTips,
      sadness: sadnessTips,
      fear: fearTips,
      love: loveTips,
      anger: angerTips,
      general: generalTips
    };

    const selectedTips = tipCategories[mood] || generalTips;
    const relaxationExercise = getRandomElement(selectedTips.relaxationExercise);

    return {
      "Take a Moment for Yourself": getRandomElement(selectedTips.takeMoment),
      "Kind Reminder": getRandomElement(selectedTips.kindReminder),
      "Quick Activity": getRandomElement(selectedTips.quickActivity),
      "Relaxation Exercise": relaxationExercise
    };
  }
}

module.exports = DailyTipsService;