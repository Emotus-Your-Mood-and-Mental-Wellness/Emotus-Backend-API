const AnalyticsService = require('../services/analyticsService');
const SummaryService = require('../services/summaryService');
const { getDateRange } = require('../utils/dateUtils');

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
      const { period, startDate, endDate } = req.query;
      const userId = req.query.userId || 'default-user';

      const { startDate: start, endDate: end } = getDateRange(startDate, endDate, period);
      const summary = await SummaryService.generateDailySummary(userId, start, end);

      // Add period information to the response
      const response = {
        period: period || 'daily',
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        ...summary
      };

      res.json(response);
    } catch (error) {
      console.error('Get summary error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AnalyticsController;