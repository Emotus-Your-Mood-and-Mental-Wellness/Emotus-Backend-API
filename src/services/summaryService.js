const { db } = require('../config/firebase');
const { formatDate } = require('../utils/dateUtils');
const MoodMessageService = require('./moodMessageService');

class SummaryService {
  static async generateDailySummary(userId, startDate, endDate) {
    try {
      const moodRef = db.collection('users').doc(userId).collection('moods');
      const query = moodRef
        .where('createdAt', '>=', formatDate(startDate))
        .where('createdAt', '<=', formatDate(endDate));

      const snapshot = await query.get();
      const entries = snapshot.docs.map(doc => doc.data());

      const moodCounts = entries.reduce((acc, entry) => {
        if (entry.predictedMood) {
          acc[entry.predictedMood] = (acc[entry.predictedMood] || 0) + 1;
        }
        return acc;
      }, {});

      const dominantMood = Object.entries(moodCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([mood]) => mood)[0] || 'Unknown';

      const stressLevelCounts = entries.reduce((acc, entry) => {
        if (entry.stressLevel) {
          acc[entry.stressLevel.toLowerCase()] = (acc[entry.stressLevel.toLowerCase()] || 0) + 1;
        }
        return acc;
      }, {});

      const dominantStressLevel = Object.entries(stressLevelCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([level]) => level)[0] || 'unknown';

      // Get personalized messages based on mood history
      const messages = await MoodMessageService.getPersonalizedMessages(
        userId,
        dominantMood,
        dominantStressLevel,
        db
      );

      return {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        totalEntries: entries.length,
        dominantMood,
        dominantStressLevel,
        ...messages,
        summary: this.generateTextSummary(entries.length, dominantMood, dominantStressLevel)
      };
    } catch (error) {
      console.error('Summary generation error:', error);
      throw new Error('Failed to generate daily summary');
    }
  }

  static generateTextSummary(totalEntries, dominantMood, dominantStressLevel) {
    if (totalEntries === 0) {
      return "No mood entries recorded for this period.";
    }

    return `You recorded ${totalEntries} mood entries during this period. Your dominant mood was ${dominantMood} with predominantly ${dominantStressLevel} stress levels. Consider reviewing the thoughtful suggestions provided to maintain or improve your emotional well-being.`;
  }
}

module.exports = SummaryService;