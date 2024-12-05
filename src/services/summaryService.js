const { db } = require('../config/firebase');
const { formatDate, getDateRange } = require('../utils/dateUtils');

class SummaryService {
  static async generateSummary(userId, startDate, endDate, period = 'daily') {
    try {
      const { startDate: start, endDate: end } = getDateRange(startDate, endDate, period);

      const moodRef = db.collection('users').doc(userId).collection('moods');
      const query = moodRef
        .where('createdAt', '>=', formatDate(start))
        .where('createdAt', '<=', formatDate(end));

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

      const moodProgression = entries
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map(entry => ({
          date: formatDate(new Date(entry.createdAt)),
          mood: entry.predictedMood,
          stressLevel: entry.stressLevel,
          sympathyMessage: entry.sympathyMessage,
          thoughtfulSuggestions: entry.thoughtfulSuggestions
        }));

      return {
        period,
        startDate: formatDate(start),
        endDate: formatDate(end),
        totalEntries: entries.length,
        dominantMood,
        dominantStressLevel,
        moodProgression,
        summary: this.generateTextSummary(
          entries.length, 
          dominantMood, 
          dominantStressLevel, 
          moodProgression, 
          period
        )
      };
    } catch (error) {
      console.error('Summary generation error:', error);
      throw new Error('Failed to generate summary');
    }
  }

  static generateTextSummary(totalEntries, dominantMood, dominantStressLevel, moodProgression, period) {
    if (totalEntries === 0) {
      return `No mood entries recorded for this ${period} period.`;
    }

    let summary = `You recorded ${totalEntries} mood entries during this ${period} period. `;
    summary += `Your dominant mood was ${dominantMood} with predominantly ${dominantStressLevel} stress levels. `;

    if (moodProgression.length > 1) {
      const moodChanges = moodProgression.slice(1).filter((entry, index) => 
        entry.mood !== moodProgression[index].mood
      ).length;

      const stressChanges = moodProgression.slice(1).filter((entry, index) => 
        entry.stressLevel !== moodProgression[index].stressLevel
      ).length;

      if (moodChanges === 0 && stressChanges === 0) {
        summary += "Your mood and stress levels remained very stable throughout the period.";
      } else if (moodChanges <= 2 && stressChanges <= 2) {
        summary += "Your mood and stress levels showed some minor variations during the period.";
      } else {
        summary += "Your mood and stress levels showed significant changes throughout the period. Consider reviewing the thoughtful suggestions provided for each entry.";
      }
    }

    return summary;
  }
}

module.exports = SummaryService;