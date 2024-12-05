const { db } = require('../config/firebase');
const { formatDate, parseDate } = require('../utils/dateUtils');

class AnalyticsService {
  static async getMoodTrends(userId, startDate, endDate) {
    try {
      const moodRef = db.collection('users').doc(userId).collection('moods');
      
      // Create query with date range
      let query = moodRef;
      if (startDate) {
        // Set time to start of day
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        query = query.where('createdAt', '>=', formatDate(start));
      }
      if (endDate) {
        // Set time to end of day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query = query.where('createdAt', '<=', formatDate(end));
      }
      
      query = query.orderBy('createdAt');
      const snapshot = await query.get();
      const entries = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));

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
    // Initialize with all possible moods
    const distribution = {
      Happy: {
        count: 0,
        percentage: 0
      },
      Sadness: {
        count: 0,
        percentage: 0
      },
      Anger: {
        count: 0,
        percentage: 0
      },
      Fear: {
        count: 0,
        percentage: 0
      },
      Love: {
        count: 0,
        percentage: 0
      }
    };

    // Count occurrences of each mood
    entries.forEach(entry => {
      const mood = (entry.mood || entry.predictedMood || '');
      if (mood) {
        const standardizedMood = this.standardizeMood(mood);
        if (distribution[standardizedMood]) {
          distribution[standardizedMood].count++;
        }
      }
    });

    // Calculate percentages
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
      mood: (entry.mood || entry.predictedMood || 'Unknown').toLowerCase()
    }));
  }

  static analyzeCommonTriggers(entries) {
    // Filter entries with high stress or negative moods
    const significantEntries = entries.filter(entry => {
      const mood = (entry.mood || entry.predictedMood || '').toLowerCase();
      const isNegativeMood = ['sadness', 'anger', 'fear'].includes(mood);
      const isHighStress = entry.stressLevel > 7;
      return isNegativeMood || isHighStress;
    });

    // Extract keywords from diary entries
    const keywords = significantEntries
      .filter(entry => entry.diaryEntry)
      .map(entry => this.extractKeywords(entry.diaryEntry))
      .flat();

    // Get top triggers
    const triggers = this.aggregateCommonWords(keywords);
    
    // Return empty array if no triggers found
    return triggers.length > 0 ? triggers : [];
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
    
    // Convert text to lowercase and split into words
    const words = text.toLowerCase().split(/\W+/);
    
    // Enhanced list of common words to filter out
    const commonWords = new Set([
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'a', 'an', 'is', 'are',
      'was', 'were', 'will', 'would', 'could', 'should', 'have', 'has', 'had',
      'this', 'that', 'these', 'those', 'they', 'them', 'their', 'what', 'which',
      'who', 'whom', 'whose', 'when', 'where', 'why', 'how', 'all', 'any', 'both',
      'each', 'few', 'more', 'most', 'other', 'some', 'such', 'than', 'too',
      'very', 'can', 'cannot', 'just', 'now', 'also', 'then', 'aku', 'saya', 'dia',
      'kamu'
    ]);

    // Filter words: length > 3, not common words, not numbers
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