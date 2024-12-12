const {
    happyMessages,
    sadMessages,
    fearMessages,
    loveMessages,
    angerMessages
  } = require('../utils/moodMessages');
  const { getMoodMessages } = require('../utils/moodSuggestionHelper');
  
  class MoodMessageService {
    static getMoodSpecificMessages(mood, stressLevel) {
      const moodMap = {
        'Happy': happyMessages,
        'Sadness': sadMessages,
        'Fear': fearMessages,
        'Love': loveMessages,
        'Anger': angerMessages
      };
  
      const messages = moodMap[mood] || happyMessages;
      return getMoodMessages(messages, stressLevel);
    }
  
    static async getPersonalizedMessages(userId, currentMood, stressLevel, db) {
      try {
        const recentMoods = await this.getRecentMoods(userId, db);
        
        const moodPattern = this.analyzeMoodPattern(recentMoods);
        
        let messages = this.getMoodSpecificMessages(currentMood, stressLevel);
        
        messages = this.personalizeBasedOnPattern(messages, moodPattern);
        
        return messages;
      } catch (error) {
        console.error('Error getting personalized messages:', error);
        return this.getMoodSpecificMessages(currentMood, stressLevel);
      }
    }
  
    static async getRecentMoods(userId, db, days = 7) {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
  
      const moodRef = db.collection('users').doc(userId).collection('moods');
      const snapshot = await moodRef
        .where('createdAt', '>=', startDate.toISOString().split('T')[0])
        .where('createdAt', '<=', endDate.toISOString().split('T')[0])
        .orderBy('createdAt', 'desc')
        .get();
  
      return snapshot.docs.map(doc => doc.data());
    }
  
    static analyzeMoodPattern(moods) {
      const pattern = {
        moodFrequency: {},
        stressLevels: [],
        isImproving: false,
        hasHighStress: false
      };
  
      moods.forEach(mood => {
        pattern.moodFrequency[mood.predictedMood] = 
          (pattern.moodFrequency[mood.predictedMood] || 0) + 1;
        
        if (mood.stressLevel) {
          pattern.stressLevels.push(mood.stressLevel);
          if (mood.stressLevel >= 7) {
            pattern.hasHighStress = true;
          }
        }
      });
  
      if (moods.length >= 2) {
        const recentMoods = ['Happy', 'Love'];
        pattern.isImproving = recentMoods.includes(moods[0].predictedMood);
      }
  
      return pattern;
    }
  
    static personalizeBasedOnPattern(messages, pattern) {
      const personalizedMessages = { ...messages };
  
      if (pattern.isImproving) {
        personalizedMessages.sympathyMessage += " Aku lihat mood-mu semakin membaik akhir-akhir ini!";
      }
  
      if (pattern.hasHighStress) {
        personalizedMessages.thoughtfulSuggestions.unshift(
          "Sepertinya tingkat stressmu cukup tinggi belakangan ini. Yuk, coba teknik relaksasi"
        );
      }
  
      return personalizedMessages;
    }
  }
  
  module.exports = MoodMessageService;