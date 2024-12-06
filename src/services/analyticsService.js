const { db } = require('../config/firebase');
const { formatDate, parseDate, getDateRange } = require('../utils/dateUtils');

class AnalyticsService {
  static async getMoodTrends(userId, startDate, endDate, period = 'daily') {
    try {
      const { startDate: start, endDate: end } = getDateRange(startDate, endDate, period);
      
      const moodRef = db.collection('users').doc(userId).collection('moods');
      let query = moodRef
        .where('createdAt', '>=', formatDate(start))
        .where('createdAt', '<=', formatDate(end))
        .orderBy('createdAt');

      const snapshot = await query.get();
      const entries = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));

      return {
        period,
        startDate: formatDate(start),
        endDate: formatDate(end),
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
    const distribution = {
      Happy: { count: 0, percentage: 0 },
      Sadness: { count: 0, percentage: 0 },
      Anger: { count: 0, percentage: 0 },
      Fear: { count: 0, percentage: 0 },
      Love: { count: 0, percentage: 0 }
    };

    entries.forEach(entry => {
      const mood = entry.mood || entry.predictedMood;
      if (mood) {
        const standardizedMood = this.standardizeMood(mood);
        if (distribution[standardizedMood]) {
          distribution[standardizedMood].count++;
        }
      }
    });

    const total = entries.length;
    if (total > 0) {
      Object.keys(distribution).forEach(mood => {
        distribution[mood].percentage = Math.round((distribution[mood].count / total) * 100);
      });
    }

    return distribution;
  }

  static standardizeMood(mood) {
    const moodMap = {
      'happy': 'Happy',
      'sad': 'Sadness',
      'sadness': 'Sadness',
      'anger': 'Anger',
      'angry': 'Anger',
      'fear': 'Fear',
      'fearful': 'Fear',
      'love': 'Love'
    };
    
    return moodMap[mood.toLowerCase()] || mood;
  }

  static calculateStressLevelTrend(entries) {
    return entries.map(entry => ({
      date: entry.createdAt,
      stressLevel: entry.stressLevel || 0,
      mood: (entry.mood || entry.predictedMood || 'Unknown')
    }));
  }

  static analyzeCommonTriggers(entries) {
    const significantEntries = entries.filter(entry => {
      const mood = (entry.mood || entry.predictedMood || '').toLowerCase();
      const isNegativeMood = ['sadness', 'anger', 'fear'].includes(mood);
      const isHighStress = entry.stressLevel > 7;
      return isNegativeMood || isHighStress;
    });

    const keywords = significantEntries
      .filter(entry => entry.diaryEntry)
      .map(entry => this.extractKeywords(entry.diaryEntry))
      .flat();

    return this.aggregateCommonWords(keywords);
  }

  static analyzeTimeOfDay(entries) {
    const timeSlots = {
      morning: 0,   // 5:00 - 11:59
      afternoon: 0, // 12:00 - 16:59
      evening: 0,   // 17:00 - 21:59
      night: 0      // 22:00 - 4:59
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
    
    const words = text.toLowerCase().split(/\W+/);
    
    const commonWords = new Set([
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'a', 'an', 'is', 'are',
      'was', 'were', 'will', 'would', 'could', 'should', 'have', 'has', 'had',
      'this', 'that', 'these', 'those', 'they', 'them', 'their', 'what', 'which',
      'who', 'whom', 'whose', 'when', 'where', 'why', 'how', 'all', 'any', 'both',
      'each', 'few', 'more', 'most', 'other', 'some', 'such', 'than', 'too',
      'very', 'can', 'cannot', 'just', 'now', 'also', 'then', 'aku', 'saya', 'dia',
      'kamu'
    ]);

    return words.filter(word => 
      word.length > 3 && 
      !commonWords.has(word) && 
      isNaN(word) &&
      word.trim().length > 0
    );
  }

  static aggregateCommonWords(words) {
    if (!words.length) return [];

    const frequency = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word, count]) => ({
        trigger: word,
        frequency: count
      }));
  }
}

module.exports = AnalyticsService;