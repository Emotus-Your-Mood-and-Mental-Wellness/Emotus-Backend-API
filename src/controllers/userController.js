const { uploadProfilePhoto, deleteProfilePhoto } = require('../services/storageService');
const { db } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

class UserController {
  static async uploadPhoto(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const userId = req.query.userId || 'default-user';
      const fileExtension = req.file.originalname.split('.').pop();
      const fileName = `profile-photos/${userId}/${uuidv4()}.${fileExtension}`;

      // Upload to Google Cloud Storage
      const imageUrl = await uploadProfilePhoto(fileName, req.file.buffer);

      // Update user profile in Firestore
      const userRef = db.collection('users').doc(userId);
      const user = await userRef.get();

      if (user.exists) {
        // Delete old photo if exists
        const oldPhotoUrl = user.data().profilePhotoUrl;
        if (oldPhotoUrl) {
          await deleteProfilePhoto(oldPhotoUrl);
        }
      }

      // Update user document with new photo URL
      await userRef.set({
        ...user.data(),
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
      const userId = req.query.userId || 'default-user';
      const userRef = db.collection('users').doc(userId);
      const user = await userRef.get();

      if (!user.exists) {
        return res.status(404).json({ error: 'User not found' });
      }

      const photoUrl = user.data().profilePhotoUrl;
      if (!photoUrl) {
        return res.status(404).json({ error: 'No profile photo found' });
      }

      // Delete from Google Cloud Storage
      await deleteProfilePhoto(photoUrl);

      // Update user document
      await userRef.update({
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