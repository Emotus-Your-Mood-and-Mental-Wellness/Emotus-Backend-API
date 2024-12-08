const { db } = require('../config/firebase');

class AccountController {
  async generateNextUserId() {
    try {
      const usersRef = db.collection('users');
      const snapshot = await usersRef
        .orderBy('userId', 'desc')
        .get();
      
      // Get all existing user IDs
      const userIds = snapshot.docs.map(doc => {
        const match = doc.data().userId.match(/^user(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      }).filter(id => !isNaN(id));

      // If no users exist, start with user1
      if (userIds.length === 0) {
        return 'user1';
      }

      // Find the highest user number
      const maxUserId = Math.max(...userIds);
      const nextUserId = `user${maxUserId + 1}`;

      // Verify the new ID doesn't exist (double-check)
      const newUserRef = db.collection('users').doc(nextUserId);
      const newUserDoc = await newUserRef.get();
      
      if (newUserDoc.exists) {
        // In case of collision, find the next available number
        let counter = maxUserId + 1;
        while (true) {
          const testId = `user${counter}`;
          const testRef = db.collection('users').doc(testId);
          const testDoc = await testRef.get();
          
          if (!testDoc.exists) {
            return testId;
          }
          counter++;
        }
      }
      
      return nextUserId;
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
      
      // Create user document with the generated ID as the document ID
      const userRef = db.collection('users').doc(userId);
      
      // Check if the document already exists
      const doc = await userRef.get();
      if (doc.exists) {
        throw new Error('User ID already exists');
      }
      
      // Create the user document
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

      // Return success message with userId
      res.status(201).json({ 
        message: 'Account created successfully',
        userId: userId
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Failed to create account' });
    }
  }

  async login(req, res) {
    try {
      const { userId, password } = req.body;

      // Get user document
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return res.status(401).json({ 
          error: 'Wrong password, try checking the password and userId again' 
        });
      }

      const userData = userDoc.data();
      
      // Check password
      if (userData.password !== password) {
        return res.status(401).json({ 
          error: 'Wrong password, try checking the password and userId again' 
        });
      }

      // Return success response
      res.json({
        userId: userId,
        message: 'login successful'
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Failed to login' });
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

      // Include userId in the response along with account info
      res.json({
        userId: userId,
        ...doc.data()
      });
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