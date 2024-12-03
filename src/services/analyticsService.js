const { db } = require('../config/firebase');
const { formatDate, parseDate } = require('../utils/dateUtils');

class AnalyticsService {
  static async getMoodTrends(userId, startDate, endDate) {
    try {
      const moodRef = db.collection('users').doc(userId).collection('moods');
      const query = moodRef
        .where('createdAt', '>=', startDate)
        .where('createdAt', '<=', endDate)
        .orderBy('createdAt');

      const snapshot = await query.get();
      const entries = snapshot.docs.map(doc => doc.data());

      return {
        moodDistribution: this.calculateMoodDistribution(entries),
        stressLevelTrend: this.calculateStressLevelTrend(entries),
        commonTriggers: this.analyzeCommonTriggers(entries),
        timeOfDayAnalysis: this.analyzeTimeOfDay(entries)
      };
    } catch (error) {
      console.error('Analytics error:', error);
      throw new Error('Failed to generate mood analytics');
    }
  }

  static calculateMoodDistribution(entries) {
    const distribution = entries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(distribution).map(([mood, count]) => ({
      mood,
      count,
      percentage: (count / entries.length) * 100
    }));
  }

  static calculateStressLevelTrend(entries) {
    return entries.map(entry => ({
      date: entry.createdAt,
      stressLevel: entry.stressLevel
    }));
  }

  static analyzeCommonTriggers(entries) {
    // Simplified trigger analysis based on diary content
    const triggers = entries
      .filter(entry => entry.stressLevel > 7)
      .map(entry => this.extractKeywords(entry.diaryEntry));

    return this.aggregateCommonWords(triggers.flat());
  }

  static analyzeTimeOfDay(entries) {
    const timeSlots = {
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0
    };

    entries.forEach(entry => {
      const hour = new Date(entry.createdAt).getHours();
      if (hour >= 5 && hour < 12) timeSlots.morning++;
      else if (hour >= 12 && hour < 17) timeSlots.afternoon++;
      else if (hour >= 17 && hour < 22) timeSlots.evening++;
      else timeSlots.night++;
    });

    return timeSlots;
  }

  static extractKeywords(text) {
    // Simple keyword extraction (could be enhanced with NLP)
    const words = text.toLowerCase().split(/\W+/);
    const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to']);
    return words.filter(word => word.length > 3 && !commonWords.has(word));
  }

  static aggregateCommonWords(words) {
    const frequency = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word, count]) => ({ word, count }));
  }
}

module.exports = AnalyticsService;