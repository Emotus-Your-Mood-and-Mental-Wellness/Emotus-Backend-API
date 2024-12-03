const { db } = require('../config/firebase');
const { formatDate } = require('../utils/dateUtils');

class SummaryService {
  static async generateDailySummary(userId, date) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const moodRef = db.collection('users').doc(userId).collection('moods');
      const query = moodRef
        .where('createdAt', '>=', formatDate(startOfDay))
        .where('createdAt', '<=', formatDate(endOfDay));

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
          time: entry.createdAt,
          mood: entry.predictedMood,
          stressLevel: entry.stressLevel,
          sympathyMessage: entry.sympathyMessage,
          thoughtfulSuggestions: entry.thoughtfulSuggestions
        }));

      return {
        date: formatDate(date),
        totalEntries: entries.length,
        dominantMood,
        dominantStressLevel,
        moodProgression,
        summary: this.generateTextSummary(entries.length, dominantMood, dominantStressLevel, moodProgression)
      };
    } catch (error) {
      console.error('Summary generation error:', error);
      throw new Error('Failed to generate daily summary');
    }
  }

  static generateTextSummary(totalEntries, dominantMood, dominantStressLevel, moodProgression) {
    if (totalEntries === 0) {
      return "No mood entries recorded for this day.";
    }

    let summary = `You recorded ${totalEntries} mood entries today. `;
    summary += `Your dominant mood was ${dominantMood} with predominantly ${dominantStressLevel} stress levels. `;

    // Analyze mood stability
    if (moodProgression.length > 1) {
      const moodChanges = moodProgression.slice(1).filter((entry, index) => 
        entry.mood !== moodProgression[index].mood
      ).length;

      const stressChanges = moodProgression.slice(1).filter((entry, index) => 
        entry.stressLevel !== moodProgression[index].stressLevel
      ).length;

      if (moodChanges === 0 && stressChanges === 0) {
        summary += "Your mood and stress levels remained very stable throughout the day.";
      } else if (moodChanges <= 2 && stressChanges <= 2) {
        summary += "Your mood and stress levels showed some minor variations during the day.";
      } else {
        summary += "Your mood and stress levels showed significant changes throughout the day. Consider reviewing the thoughtful suggestions provided for each entry.";
      }
    }

    return summary;
  }
}

module.exports = SummaryService;