const { db } = require('../config/firebase');
const { formatDate, getDateRange } = require('../utils/dateUtils');
const MoodMessageService = require('./moodMessageService');

class SummaryService {
  static async generateDailySummary(userId, startDate, endDate, period = 'daily') {
    try {
      const { startDate: start, endDate: end } = getDateRange(startDate, endDate, period);
      const formattedStartDate = formatDate(start);
      const formattedEndDate = formatDate(end);

      const moodRef = db.collection('users').doc(userId).collection('moods');
      const query = moodRef
        .where('createdAt', '>=', formattedStartDate)
        .where('createdAt', '<=', formattedEndDate)
        .orderBy('createdAt');

      const snapshot = await query.get();
      const entries = snapshot.docs.map(doc => doc.data());

      const moodCounts = entries.reduce((acc, entry) => {
        const mood = entry.mood || entry.predictedMood;
        if (mood) {
          acc[mood] = (acc[mood] || 0) + 1;
        }
        return acc;
      }, {});

      const dominantMood = Object.entries(moodCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([mood]) => mood)[0] || 'Unknown';

      // Count occurrences of each stress level
      const stressLevelCounts = entries.reduce((acc, entry) => {
        const stressLevel = entry.stressLevel;
        if (stressLevel && ['Low', 'Medium', 'High'].includes(stressLevel)) {
          acc[stressLevel] = (acc[stressLevel] || 0) + 1;
        }
        return acc;
      }, {});

      // Determine dominant stress level based on frequency
      let dominantStressLevel = 'Low'; // Default to Low if no stress levels found
      if (Object.keys(stressLevelCounts).length > 0) {
        dominantStressLevel = Object.entries(stressLevelCounts)
          .sort(([, a], [, b]) => b - a) // Sort by frequency
          .map(([level]) => level)[0];
      }

      // Get personalized messages based on mood history
      const messages = await MoodMessageService.getPersonalizedMessages(
        userId,
        dominantMood,
        dominantStressLevel,
        db
      );

      return {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
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