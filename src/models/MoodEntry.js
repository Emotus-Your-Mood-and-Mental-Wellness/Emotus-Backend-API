const { db } = require('../config/firebase');
const FirebaseUtils = require('../utils/firebaseUtils');
const { formatDate } = require('../utils/dateUtils');
const { sanitizeEntry } = require('../utils/validationUtils');
const MLService = require('../services/mlService');

class MoodEntry {
  static async create(entryData, userId = 'default-user') {
    try {
      const moodRef = db.collection('users').doc(userId).collection('moods');
      const sanitizedData = sanitizeEntry(entryData);
      
      // Get ML prediction
      const prediction = await MLService.predictMood(sanitizedData.diaryEntry);
      
      const newEntry = {
        ...sanitizedData,
        userId,
        predictedMood: prediction.predicted_mood,
        stressLevel: prediction.stress_level,
        sympathyMessage: prediction.sympathy_message,
        thoughtfulSuggestions: prediction.thoughtful_suggestions,
        thingsToDo: prediction.things_to_do,
        createdAt: formatDate(new Date()),
        updatedAt: formatDate(new Date())
      };

      const docRef = await moodRef.add(newEntry);
      return { id: docRef.id, ...newEntry };
    } catch (error) {
      console.error('Create mood entry error:', error);
      throw new Error('Error creating mood entry: ' + error.message);
    }
  }

  static async getAll(userId = 'default-user', startDate, endDate) {
    try {
      const filters = [];
      if (startDate) {
        filters.push({ field: 'createdAt', operator: '>=', value: startDate });
      }
      if (endDate) {
        filters.push({ field: 'createdAt', operator: '<=', value: endDate });
      }

      const query = FirebaseUtils.createQuery(
        `users/${userId}/moods`, 
        filters, 
        { field: 'createdAt', direction: 'desc' }
      );

      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Get mood entries error:', error);
      throw new Error('Error fetching mood entries: ' + error.message);
    }
  }

  static async update(userId = 'default-user', entryId, updateData) {
    try {
      const entryRef = db.collection('users').doc(userId).collection('moods').doc(entryId);
      const sanitizedData = sanitizeEntry(updateData);
      
      // If diary entry is updated, get new ML prediction
      let predictionData = {};
      if (sanitizedData.diaryEntry) {
        const prediction = await MLService.predictMood(sanitizedData.diaryEntry);
        predictionData = {
          predictedMood: prediction.predicted_mood,
          stressLevel: prediction.stress_level,
          sympathyMessage: prediction.sympathy_message,
          thoughtfulSuggestions: prediction.thoughtful_suggestions,
          thingsToDo: prediction.things_to_do,
        };
      }
      
      await FirebaseUtils.runTransaction(async (transaction) => {
        const doc = await transaction.get(entryRef);
        if (!doc.exists) {
          throw new Error('Mood entry not found');
        }

        transaction.update(entryRef, {
          ...sanitizedData,
          ...predictionData,
          updatedAt: formatDate(new Date())
        });
      });

      const updated = await entryRef.get();
      return { id: updated.id, ...updated.data() };
    } catch (error) {
      console.error('Update mood entry error:', error);
      throw new Error('Error updating mood entry: ' + error.message);
    }
  }

  static async delete(userId = 'default-user', entryId) {
    try {
      const entryRef = db.collection('users').doc(userId).collection('moods').doc(entryId);
      await FirebaseUtils.batchWrite([
        { type: 'delete', ref: entryRef }
      ]);
      return true;
    } catch (error) {
      console.error('Delete mood entry error:', error);
      throw new Error('Error deleting mood entry: ' + error.message);
    }
  }
}

module.exports = MoodEntry;