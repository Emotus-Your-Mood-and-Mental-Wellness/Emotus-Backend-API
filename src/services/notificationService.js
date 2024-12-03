const schedule = require('node-schedule');
const { db } = require('../config/firebase');
const { admin } = require('../config/firebase');

class NotificationService {
  static scheduleReminders() {
    // Schedule daily mood check-in reminders
    schedule.scheduleJob('0 9,15,21 * * *', async () => {
      await this.sendMoodCheckInReminders();
    });

    // Schedule weekly summary notifications
    schedule.scheduleJob('0 18 * * 0', async () => {
      await this.sendWeeklySummaryNotifications();
    });
  }

  static async sendMoodCheckInReminders() {
    try {
      const usersRef = db.collection('users');
      const snapshot = await usersRef.get();

      for (const doc of snapshot.docs) {
        const user = doc.data();
        if (user.notificationSettings?.moodReminders) {
          await this.sendNotification(doc.id, {
            title: 'Mood Check-in Time',
            body: 'How are you feeling right now? Take a moment to record your mood.',
            data: {
              type: 'mood_reminder',
              timestamp: new Date().toISOString()
            }
          });
        }
      }
    } catch (error) {
      console.error('Failed to send mood check-in reminders:', error);
    }
  }

  static async sendWeeklySummaryNotifications() {
    try {
      const usersRef = db.collection('users');
      const snapshot = await usersRef.get();

      for (const doc of snapshot.docs) {
        const user = doc.data();
        if (user.notificationSettings?.weeklySummary) {
          await this.sendNotification(doc.id, {
            title: 'Your Weekly Mood Summary',
            body: 'Check out your mood patterns and insights from the past week.',
            data: {
              type: 'weekly_summary',
              timestamp: new Date().toISOString()
            }
          });
        }
      }
    } catch (error) {
      console.error('Failed to send weekly summary notifications:', error);
    }
  }

  static async sendNotification(userId, notification) {
    try {
      const userRef = db.collection('users').doc(userId);
      const user = await userRef.get();
      const fcmToken = user.data()?.fcmToken;

      if (!fcmToken) {
        console.log(`No FCM token found for user ${userId}`);
        return;
      }

      const message = {
        notification: {
          title: notification.title,
          body: notification.body
        },
        data: notification.data,
        token: fcmToken
      };

      await admin.messaging().send(message);
      console.log(`Notification sent successfully to user ${userId}`);
    } catch (error) {
      console.error(`Failed to send notification to user ${userId}:`, error);
    }
  }

  static async updateNotificationSettings(userId, settings) {
    try {
      await db.collection('users').doc(userId).update({
        notificationSettings: settings
      });
      return true;
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      throw new Error('Failed to update notification settings');
    }
  }
}

module.exports = NotificationService;