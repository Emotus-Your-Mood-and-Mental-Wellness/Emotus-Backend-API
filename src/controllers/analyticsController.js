const AnalyticsService = require('../services/analyticsService');
const SummaryService = require('../services/summaryService');

class AnalyticsController {
  static async getMoodTrends(req, res) {
    try {
      const { startDate, endDate, period = 'daily' } = req.query;
      const userId = req.user.uid;

      const trends = await AnalyticsService.getMoodTrends(
        userId,
        startDate,
        endDate,
        period
      );

      res.json(trends);
    } catch (error) {
      console.error('Get mood trends error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getDailySummary(req, res) {
    try {
      const { period, startDate, endDate } = req.query;
      const userId = req.user.uid;

      const summary = await SummaryService.generateDailySummary(
        userId,
        startDate,
        endDate,
        period
      );

      res.json(summary);
    } catch (error) {
      console.error('Get summary error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AnalyticsController;