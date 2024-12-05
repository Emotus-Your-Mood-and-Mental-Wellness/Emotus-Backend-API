const MoodEntry = require('../models/MoodEntry');

class MoodController {
  static async createMoodEntry(req, res) {
    try {
      const moodData = req.body;
      const userId = req.query.userId || 'default-user';
      const newEntry = await MoodEntry.create(moodData, userId);
      res.status(201).json(newEntry);
    } catch (error) {
      console.error('Create mood entry error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getMoodEntries(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const userId = req.query.userId || 'default-user';
      const entries = await MoodEntry.getAll(userId, startDate, endDate);
      res.json({
        data: entries,
        total: entries.length,
        startDate,
        endDate
      });
    } catch (error) {
      console.error('Get mood entries error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async updateMoodEntry(req, res) {
    try {
      const { entryId } = req.params;
      const userId = req.query.userId || 'default-user';
      const updateData = req.body;
      
      const updated = await MoodEntry.update(userId, entryId, updateData);
      res.json(updated);
    } catch (error) {
      console.error('Update mood entry error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteMoodEntry(req, res) {
    try {
      const { entryId } = req.params;
      const userId = req.query.userId || 'default-user';
      await MoodEntry.delete(userId, entryId);
      res.status(204).send();
    } catch (error) {
      console.error('Delete mood entry error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MoodController;