const { uploadProfilePhoto, deleteProfilePhoto } = require('../services/storageService');
const { db } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

class UserController {
  static async uploadPhoto(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const userId = req.user.uid; // Get userId from authenticated token
      const fileExtension = req.file.originalname.split('.').pop();
      const fileName = `profile-photos/${userId}/${uuidv4()}.${fileExtension}`;

      // Upload to Google Cloud Storage
      const imageUrl = await uploadProfilePhoto(fileName, req.file.buffer);

      // Update account info in Firestore
      const accountRef = db.collection('users').doc(userId).collection('account').doc('info');
      const accountDoc = await accountRef.get();

      if (accountDoc.exists) {
        // Delete old photo if exists
        const oldPhotoUrl = accountDoc.data().profilePhotoUrl;
        if (oldPhotoUrl) {
          await deleteProfilePhoto(oldPhotoUrl);
        }
      }

      // Update account document with new photo URL
      await accountRef.set({
        ...accountDoc.data(),
        profilePhotoUrl: imageUrl,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      res.json({ imageUrl });
    } catch (error) {
      console.error('Upload profile photo error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async deletePhoto(req, res) {
    try {
      const userId = req.user.uid; // Get userId from authenticated token
      const accountRef = db.collection('users').doc(userId).collection('account').doc('info');
      const accountDoc = await accountRef.get();

      if (!accountDoc.exists) {
        return res.status(404).json({ error: 'Account not found' });
      }

      const photoUrl = accountDoc.data().profilePhotoUrl;
      if (!photoUrl) {
        return res.status(404).json({ error: 'No profile photo found' });
      }

      // Delete from Google Cloud Storage
      await deleteProfilePhoto(photoUrl);

      // Update account document
      await accountRef.update({
        profilePhotoUrl: null,
        updatedAt: new Date().toISOString()
      });

      res.json({ message: 'Profile photo deleted successfully' });
    } catch (error) {
      console.error('Delete profile photo error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UserController;