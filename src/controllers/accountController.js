const { db } = require('../config/firebase');

class AccountController {
  async generateNextUserId() {
    try {
      const usersRef = db.collection('users');
      const snapshot = await usersRef.orderBy('userId', 'desc').limit(1).get();
      
      if (snapshot.empty) {
        return 'user1';
      }

      const lastUser = snapshot.docs[0].data();
      const lastNumber = parseInt(lastUser.userId.replace('user', ''));
      return `user${lastNumber + 1}`;
    } catch (error) {
      console.error('Generate user ID error:', error);
      throw new Error('Failed to generate user ID');
    }
  }

  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      
      // Generate next user ID
      const userId = await this.generateNextUserId();
      
      // Create user document
      const userRef = db.collection('users').doc(userId);
      await userRef.set({
        userId,
        username,
        email,
        password, // Note: In production, ensure password is hashed
        createdAt: new Date().toISOString()
      });

      // Create account info subcollection
      const accountRef = userRef.collection('account').doc('info');
      await accountRef.set({
        username,
        email,
        createdAt: new Date().toISOString()
      });

      res.status(201).json({ 
        message: 'Akun berhasil dibuat'
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async saveAccountInfo(req, res) {
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

  async getAccountInfo(req, res) {
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

  async updateAccountInfo(req, res) {
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

module.exports = new AccountController();