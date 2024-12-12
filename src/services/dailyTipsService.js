const { db } = require('../config/firebase');
const { formatDate } = require('../utils/dateUtils');
const { getTipsByMood } = require('../utils/tipSelector');
const { analyzeMoodEntries } = require('../utils/moodAnalyzer');

class DailyTipsService {
  static async getDailyTip(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(startOfDay);
      endOfDay.setHours(23, 59, 59, 999);

      const entries = await this.getTodaysMoodEntries(userId, startOfDay, endOfDay);
      
      if (entries.length === 0) {
        return {
          message: "There are no mood notes today. Add some entries to get personalized tips!",
          generalTips: getTipsByMood('general')
        };
      }

      const analysis = analyzeMoodEntries(entries);
      
      return {
        dominantMood: analysis.dominantMood,
        stressLevel: analysis.dominantStressLevel,
        entriesCount: entries.length,
        ...getTipsByMood(analysis.dominantMood.toLowerCase())
      };
    } catch (error) {
      console.error('Get daily tip error:', error);
      throw new Error('Failed to get daily tip: ' + error.message);
    }
  }

  static async getTodaysMoodEntries(userId, startOfDay, endOfDay) {
    const moodRef = db.collection('users').doc(userId).collection('moods');
    const snapshot = await moodRef
      .where('createdAt', '>=', formatDate(startOfDay))
      .where('createdAt', '<=', formatDate(endOfDay))
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
}

module.exports = DailyTipsService;