const MoodEntry = require('../models/MoodEntry');

class MoodController {
  static async createMoodEntry(req, res) {
    try {
      const moodData = req.body;
      const uid = req.user.uid;
      
      if (!moodData.diaryEntry) {
        return res.status(400).json({ error: 'Diary entry is required' });
      }

      const newEntry = await MoodEntry.create(moodData, uid);
      res.status(201).json(newEntry);
    } catch (error) {
      console.error('Create mood entry error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getMoodEntries(req, res) {
    try {
      const { startDate, endDate, period = 'daily' } = req.query;
      const uid = req.user.uid;

      const entries = await MoodEntry.getAll(uid, startDate, endDate, period);
      res.json(entries);
    } catch (error) {
      console.error('Get mood entries error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async updateMoodEntry(req, res) {
    try {
      const { entryId } = req.params;
      const uid = req.user.uid;
      const updateData = req.body;
      
      if (!entryId) {
        return res.status(400).json({ error: 'Entry ID is required' });
      }

      const updated = await MoodEntry.update(uid, entryId, updateData);
      res.json(updated);
    } catch (error) {
      console.error('Update mood entry error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteMoodEntry(req, res) {
    try {
      const { entryId } = req.params;
      const uid = req.user.uid;
      
      if (!entryId) {
        return res.status(400).json({ error: 'Entry ID is required' });
      }

      await MoodEntry.delete(uid, entryId);
      res.status(204).send();
    } catch (error) {
      console.error('Delete mood entry error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MoodController;