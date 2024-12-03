const AnalyticsService = require('../services/analyticsService');
const SummaryService = require('../services/summaryService');

class AnalyticsController {
  static async getMoodTrends(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const userId = req.query.userId || 'default-user';

      const trends = await AnalyticsService.getMoodTrends(
        userId,
        startDate,
        endDate
      );

      res.json(trends);
    } catch (error) {
      console.error('Get mood trends error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getDailySummary(req, res) {
    try {
      const { date } = req.query;
      const userId = req.query.userId || 'default-user';

      const summary = await SummaryService.generateDailySummary(
        userId,
        date ? new Date(date) : new Date()
      );

      res.json(summary);
    } catch (error) {
      console.error('Get daily summary error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AnalyticsController;