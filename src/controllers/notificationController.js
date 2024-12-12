const NotificationService = require('../services/notificationService');

class NotificationController {
  static async updateSettings(req, res) {
    try {
      const userId = req.user.uid; // Get userId from authenticated token
      const settings = req.body;

      await NotificationService.updateNotificationSettings(userId, settings);
      res.json({ message: 'Notification settings updated successfully' });
    } catch (error) {
      console.error('Update notification settings error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = NotificationController;