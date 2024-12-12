const { db } = require('../config/firebase');
const FirebaseUtils = require('../utils/firebaseUtils');
const { formatDate } = require('../utils/dateUtils');
const { sanitizeEntry } = require('../utils/validationUtils');
const MLService = require('../services/mlService');
const { normalizeMood } = require('../utils/moodNormalizer');

class MoodEntry {
  static async create(entryData, uid) {
    try {
      if (!uid) {
        throw new Error('User ID is required');
      }

      const userRef = db.collection('users').doc(uid);
      const moodRef = userRef.collection('moods');
      const sanitizedData = sanitizeEntry(entryData);
      
      let predictionData = {};
      if (sanitizedData.diaryEntry) {
        const prediction = await MLService.predictMood(sanitizedData.diaryEntry);
        predictionData = {
          predictedMood: normalizeMood(prediction.predicted_mood),
          stressLevel: prediction.stress_level || 0,
          sympathyMessage: prediction.sympathy_message,
          thoughtfulSuggestions: prediction.thoughtful_suggestions || [],
          thingsToDo: prediction.things_to_do || []
        };
      }

      const now = new Date();
      const timestamp = now.toISOString();

      const newEntry = {
        ...sanitizedData,
        ...predictionData,
        userId: uid,
        mood: normalizeMood(sanitizedData.mood || predictionData.predictedMood || 'Unknown'),
        createdAt: timestamp,
        updatedAt: timestamp
      };

      const docRef = await moodRef.add(newEntry);
      return { id: docRef.id, ...newEntry };
    } catch (error) {
      console.error('Create mood entry error:', error);
      throw new Error('Error creating mood entry: ' + error.message);
    }
  }

  static async getAll(uid, startDate, endDate, period = 'daily') {
    try {
      if (!uid) {
        throw new Error('User ID is required');
      }

      const moodRef = db.collection('users').doc(uid).collection('moods');
      let query = moodRef.orderBy('createdAt', 'desc');

      if (startDate) {
        query = query.where('createdAt', '>=', startDate);
      }
      if (endDate) {
        query = query.where('createdAt', '<=', endDate);
      }

      const snapshot = await query.get();
      const entries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        mood: normalizeMood(doc.data().mood || doc.data().predictedMood)
      }));

      return {
        data: entries,
        total: entries.length,
        period,
        startDate: startDate || entries[entries.length - 1]?.createdAt,
        endDate: endDate || entries[0]?.createdAt
      };
    } catch (error) {
      console.error('Get mood entries error:', error);
      throw new Error('Error fetching mood entries: ' + error.message);
    }
  }

  static async update(uid, entryId, updateData) {
    try {
      if (!uid) {
        throw new Error('User ID is required');
      }

      const entryRef = db.collection('users').doc(uid).collection('moods').doc(entryId);
      const sanitizedData = sanitizeEntry(updateData);
      
      let predictionData = {};
      if (sanitizedData.diaryEntry) {
        const prediction = await MLService.predictMood(sanitizedData.diaryEntry);
        predictionData = {
          predictedMood: prediction.predicted_mood,
          stressLevel: prediction.stress_level || 0,
          sympathyMessage: prediction.sympathy_message,
          thoughtfulSuggestions: prediction.thoughtful_suggestions || [],
          thingsToDo: prediction.things_to_do || []
        };
      }

      const now = new Date();
      const timestamp = now.toISOString();
      
      const updatePayload = {
        ...sanitizedData,
        ...predictionData,
        updatedAt: timestamp
      };

      await entryRef.update(updatePayload);
      const updated = await entryRef.get();
      
      return { id: updated.id, ...updated.data() };
    } catch (error) {
      console.error('Update mood entry error:', error);
      throw new Error('Error updating mood entry: ' + error.message);
    }
  }

  static async delete(uid, entryId) {
    try {
      if (!uid) {
        throw new Error('User ID is required');
      }

      const entryRef = db.collection('users').doc(uid).collection('moods').doc(entryId);
      await entryRef.delete();
      return true;
    } catch (error) {
      console.error('Delete mood entry error:', error);
      throw new Error('Error deleting mood entry: ' + error.message);
    }
  }
}

module.exports = MoodEntry;