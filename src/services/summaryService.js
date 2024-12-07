const { db } = require('../config/firebase');
const { formatDate, getDateRange } = require('../utils/dateUtils');
const MoodMessageService = require('./moodMessageService');
const { getRandomHint } = require('../utils/moodHints');
const { getRandomFeelInspire } = require('../utils/feelInspireMessages');

class SummaryService {
  static async generateDailySummary(userId, startDate, endDate, period = 'daily') {
    try {
      const dateRange = startDate && endDate 
        ? { startDate, endDate }
        : getDateRange(null, null, period);

      const moodRef = db.collection('users').doc(userId).collection('moods');
      const query = moodRef
        .where('createdAt', '>=', dateRange.startDate)
        .where('createdAt', '<=', dateRange.endDate)
        .orderBy('createdAt');

      const snapshot = await query.get();
      const entries = snapshot.docs.map(doc => doc.data());

      // If no entries found, return a simplified response
      if (entries.length === 0) {
        const periodText = this.getPeriodText(period);
        return {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          totalEntries: 0,
          message: `Belum ada catatan mood untuk ${periodText}. Tambahkan entri mood untuk mendapatkan analisis dan saran yang dipersonalisasi.`
        };
      }

      const moodCounts = entries.reduce((acc, entry) => {
        const mood = entry.mood || entry.predictedMood;
        if (mood) {
          acc[mood] = (acc[mood] || 0) + 1;
        }
        return acc;
      }, {});

      const dominantMood = Object.entries(moodCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([mood]) => mood)[0];

      // Count occurrences of each stress level
      const stressLevelCounts = entries.reduce((acc, entry) => {
        const stressLevel = entry.stressLevel;
        if (stressLevel && ['Low', 'Medium', 'High'].includes(stressLevel)) {
          acc[stressLevel] = (acc[stressLevel] || 0) + 1;
        }
        return acc;
      }, {});

      // Determine dominant stress level based on frequency
      const dominantStressLevel = Object.entries(stressLevelCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([level]) => level)[0] || 'Low';

      // Get personalized messages based on mood history
      const messages = await MoodMessageService.getPersonalizedMessages(
        userId,
        dominantMood,
        dominantStressLevel,
        db
      );

      // Get a random helpful hint based on the dominant mood
      const helpfulHint = getRandomHint(dominantMood);

      // Get a random feel inspire message based on the dominant mood
      const feelInspire = getRandomFeelInspire(dominantMood);

      return {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        totalEntries: entries.length,
        dominantMood,
        dominantStressLevel,
        ...messages,
        helpfulHint,
        feelInspire,
        summary: this.generateTextSummary(entries.length, dominantMood, dominantStressLevel)
      };
    } catch (error) {
      console.error('Summary generation error:', error);
      throw new Error('Failed to generate daily summary');
    }
  }

  static getPeriodText(period) {
    switch (period) {
      case 'daily':
        return 'hari ini';
      case 'weekly':
        return '7 hari terakhir';
      case 'monthly':
        return '30 hari terakhir';
      default:
        return 'periode yang dipilih';
    }
  }

  static generateTextSummary(totalEntries, dominantMood, dominantStressLevel) {
    if (totalEntries === 0) {
      return "No mood entries recorded for this period.";
    }

    return `Anda mencatat ${totalEntries} entri suasana hati selama periode ini. Suasana hati Anda yang dominan adalah ${dominantMood} dengan tingkat stres yang didominasi ${dominantStressLevel}. Pertimbangkan untuk meninjau kembali saran-saran bijaksana yang diberikan untuk mempertahankan atau meningkatkan kesejahteraan emosional Anda.`;
  }
}

module.exports = SummaryService;