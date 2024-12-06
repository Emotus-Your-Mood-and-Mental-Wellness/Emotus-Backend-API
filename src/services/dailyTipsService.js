const { db } = require('../config/firebase');
const { formatDate } = require('../utils/dateUtils');

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
          message: "Belum ada catatan mood hari ini."
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
}

module.exports = DailyTipsService;