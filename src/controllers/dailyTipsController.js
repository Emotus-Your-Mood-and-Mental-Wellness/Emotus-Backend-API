const DailyTipsService = require('../services/dailyTipsService');

class DailyTipsController {
  static async getDailyTip(req, res) {
    try {
      const userId = req.user.uid;

      const tip = await DailyTipsService.getDailyTip(userId);
      res.json(tip);
    } catch (error) {
      console.error('Get daily tip error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = DailyTipsController;