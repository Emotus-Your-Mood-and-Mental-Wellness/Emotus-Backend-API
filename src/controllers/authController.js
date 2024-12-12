const { admin } = require('../config/firebase');
const { db } = require('../config/firebase');

class AuthController {
  async register(req, res) {
    try {
      const { email, password, username } = req.body;

      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: username
      });

      await admin.auth().setCustomUserClaims(userRecord.uid, {
        role: 'user'
      });

      const userRef = db.collection('users').doc(userRecord.uid);
      const accountRef = userRef.collection('account').doc('info');
      const moodRef = userRef.collection('moods'); 

      const accountData = {
        username,
        email,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        role: 'user',
        profilePhotoUrl: null
      };

      const batch = db.batch();
      
      batch.set(userRef, { 
        userId: userRecord.uid,
        email,
        createdAt: new Date().toISOString()
      });
      
      batch.set(accountRef, accountData);
      
      const dummyMoodRef = moodRef.doc('init');
      batch.set(dummyMoodRef, { 
        init: true,
        createdAt: new Date().toISOString()
      });
      
      await batch.commit();

      await dummyMoodRef.delete();

      res.status(201).json({ 
        message: 'User registered successfully',
        userId: userRecord.uid,
        email: userRecord.email,
        username: userRecord.displayName,
        accountInfo: accountData
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { idToken } = req.body;

      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;

      const accountRef = db.collection('users').doc(uid).collection('account').doc('info');
      const accountDoc = await accountRef.get();

      if (!accountDoc.exists) {
        const userRecord = await admin.auth().getUser(uid);
        const accountData = {
          username: userRecord.displayName || '',
          email: userRecord.email,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          role: 'user',
          profilePhotoUrl: userRecord.photoURL || null
        };

        await accountRef.set(accountData);

        const moodRef = db.collection('users').doc(uid).collection('moods');
        const dummyMoodRef = moodRef.doc('init');
        await dummyMoodRef.set({ 
          init: true,
          createdAt: new Date().toISOString()
        });
        await dummyMoodRef.delete();
      } else {
        await accountRef.update({
          lastLogin: new Date().toISOString()
        });
      }

      const userData = (await accountRef.get()).data();

      res.status(200).json({
        message: 'Login successful',
        user: {
          userId: uid,
          email: userData.email,
          username: userData.username,
          role: userData.role,
          profilePhotoUrl: userData.profilePhotoUrl
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({ error: 'Invalid credentials' });
    }
  }

  async getUserProfile(req, res) {
    try {
      const uid = req.user.uid;
      const accountRef = db.collection('users').doc(uid).collection('account').doc('info');
      const accountDoc = await accountRef.get();

      if (!accountDoc.exists) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      const userData = accountDoc.data();
      res.json(userData);
    } catch (error) {
      console.error('Get user profile error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async updateUserProfile(req, res) {
    try {
      const uid = req.user.uid;
      const { username, email } = req.body;

      const updateData = {};
      if (username) updateData.displayName = username;
      if (email) updateData.email = email;
      
      await admin.auth().updateUser(uid, updateData);

      const accountRef = db.collection('users').doc(uid).collection('account').doc('info');
      await accountRef.update({
        ...updateData,
        username: username || undefined,
        email: email || undefined,
        updatedAt: new Date().toISOString()
      });

      res.json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();