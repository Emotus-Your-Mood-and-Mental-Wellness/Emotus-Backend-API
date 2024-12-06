const { db } = require('../config/firebase');

class AccountController {
  static async saveAccountInfo(req, res) {
    try {
      const userId = req.query.userId;
      if (!userId) {
        return res.status(400).json({ error: 'userId is required in query parameters' });
      }

      const accountData = req.body;
      const accountRef = db.collection('users').doc(userId).collection('account').doc('info');
      await accountRef.set(accountData, { merge: true });

      res.json({ message: 'Account information saved successfully' });
    } catch (error) {
      console.error('Save account info error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getAccountInfo(req, res) {
    try {
      const userId = req.query.userId;
      if (!userId) {
        return res.status(400).json({ error: 'userId is required in query parameters' });
      }

      const accountRef = db.collection('users').doc(userId).collection('account').doc('info');
      const doc = await accountRef.get();
      
      if (!doc.exists) {
        return res.status(404).json({ error: 'Account information not found' });
      }

      res.json(doc.data());
    } catch (error) {
      console.error('Get account info error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async updateAccountInfo(req, res) {
    try {
      const userId = req.query.userId;
      if (!userId) {
        return res.status(400).json({ error: 'userId is required in query parameters' });
      }

      const updateData = req.body;
      const accountRef = db.collection('users').doc(userId).collection('account').doc('info');
      
      const doc = await accountRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Account not found' });
      }

      await accountRef.update(updateData);
      res.json({ message: 'Account information updated successfully' });
    } catch (error) {
      console.error('Update account info error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AccountController;