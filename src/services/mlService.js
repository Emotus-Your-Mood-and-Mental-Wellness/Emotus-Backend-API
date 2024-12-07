const axios = require('axios');
const NodeCache = require('node-cache');

// Cache predictions for 1 hour
const predictionCache = new NodeCache({ stdTTL: 3600 });

class MLService {
  static async predictMood(diaryEntry) {
    try {
      // Check cache first
      const cacheKey = `mood_${Buffer.from(diaryEntry).toString('base64')}`;
      const cachedPrediction = predictionCache.get(cacheKey);
      
      if (cachedPrediction) {
        return cachedPrediction;
      }

      const response = await axios.post(
        'https://my-mood-api-1089286517825.asia-southeast2.run.app/predict_mood',
        { text: diaryEntry }
      );

      const prediction = response.data;
      
      // Cache the prediction
      predictionCache.set(cacheKey, prediction);
      
      return prediction;
    } catch (error) {
      console.error('ML prediction error:', error);
      throw new Error('Failed to predict mood: ' + error.message);
    }
  }
}

module.exports = MLService;