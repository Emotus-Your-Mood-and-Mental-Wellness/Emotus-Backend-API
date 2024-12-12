const { db } = require('../config/firebase');
const { formatDate, parseDate, getDateRange } = require('../utils/dateUtils');

class AnalyticsService {
  static async getMoodTrends(userId, startDate, endDate, period = 'daily') {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const { startDate: start, endDate: end } = getDateRange(startDate, endDate, period);
      
      const moodRef = db.collection('users').doc(userId).collection('moods');
      const query = moodRef
        .where('createdAt', '>=', formatDate(start))
        .where('createdAt', '<=', formatDate(end))
        .orderBy('createdAt', 'desc');

      const snapshot = await query.get();
      const entries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (entries.length === 0) {
        return {
          message: "No mood entries found for the specified period.",
          period,
          startDate: formatDate(start),
          endDate: formatDate(end),
          moodDistribution: {},
          stressLevelTrend: [],
          commonTriggers: [],
          timeOfDayAnalysis: {
            morning: 0,
            afternoon: 0,
            evening: 0,
            night: 0
          }
        };
      }

      const moodDistribution = this.calculateMoodDistribution(entries);
      const stressLevelTrend = this.calculateStressLevelTrend(entries);
      const commonTriggers = this.analyzeCommonTriggers(entries);
      const timeOfDayAnalysis = this.analyzeTimeOfDay(entries);

      return {
        period,
        startDate: formatDate(start),
        endDate: formatDate(end),
        totalEntries: entries.length,
        moodDistribution,
        stressLevelTrend,
        commonTriggers,
        timeOfDayAnalysis
      };
    } catch (error) {
      console.error('Get mood trends error:', error);
      throw new Error('Failed to get mood trends: ' + error.message);
    }
  }

  static calculateMoodDistribution(entries) {
    const distribution = {};
    const total = entries.length;

    entries.forEach(entry => {
      const mood = entry.mood || entry.predictedMood;
      if (mood) {
        distribution[mood] = (distribution[mood] || 0) + 1;
      }
    });

    Object.keys(distribution).forEach(mood => {
      distribution[mood] = {
        count: distribution[mood],
        percentage: Math.round((distribution[mood] / total) * 100)
      };
    });

    return distribution;
  }

  static calculateStressLevelTrend(entries) {
    return entries.map(entry => ({
      date: entry.createdAt,
      stressLevel: entry.stressLevel || 0,
      mood: entry.mood || entry.predictedMood || 'Unknown'
    }));
  }

  static analyzeCommonTriggers(entries) {
    const keywords = entries
      .filter(entry => entry.diaryEntry)
      .map(entry => this.extractKeywords(entry.diaryEntry))
      .flat();

    const frequency = {};
    keywords.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([trigger, count]) => ({
        trigger,
        frequency: count
      }));
  }

  static analyzeTimeOfDay(entries) {
    const timeSlots = {
      morning: 0,   
      afternoon: 0, 
      evening: 0,   
      night: 0      
    };

    entries.forEach(entry => {
      const date = new Date(entry.createdAt);
      const hour = date.getHours();

      if (hour >= 5 && hour < 12) timeSlots.morning++;
      else if (hour >= 12 && hour < 17) timeSlots.afternoon++;
      else if (hour >= 17 && hour < 22) timeSlots.evening++;
      else timeSlots.night++;
    });

    return timeSlots;
  }

  static extractKeywords(text) {
    if (!text) return [];
    
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/);
    
    const commonWords = new Set([
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'a', 'an', 'is', 'are',
      'was', 'were', 'will', 'would', 'could', 'should', 'have', 'has', 'had',
      'this', 'that', 'these', 'those', 'they', 'them', 'their', 'what', 'which',
      'who', 'whom', 'whose', 'when', 'where', 'why', 'how', 'all', 'any', 'both',
      'each', 'few', 'more', 'most', 'other', 'some', 'such', 'than', 'too',
      'very', 'can', 'cannot', 'just', 'now', 'also', 'then'
    ]);

    return words.filter(word => 
      word.length > 3 && 
      !commonWords.has(word) && 
      isNaN(word)
    );
  }
}

module.exports = AnalyticsService;