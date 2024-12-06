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
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const moodRef = db.collection('users').doc(userId).collection('moods');
      const snapshot = await moodRef
        .where('createdAt', '>=', formatDate(today))
        .where('createdAt', '<', formatDate(tomorrow))
        .get();

      const entries = snapshot.docs.map(doc => doc.data());
      
      if (entries.length === 0) {
        return {
          message: "Belum ada catatan mood hari ini. Tambahkan beberapa entri untuk mendapatkan tips yang dipersonalisasi!",
          ...this.getFormattedTips('general')
        };
      }

      const moodCounts = entries.reduce((acc, entry) => {
        const mood = entry.mood || entry.predictedMood;
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
      throw new Error('Gagal mendapatkan tip harian');
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
      "Relaxation Exercise": `\n${relaxationExercise}`
    };
  }
}

module.exports = DailyTipsService;