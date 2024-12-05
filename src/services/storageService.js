const { Storage } = require('@google-cloud/storage');

const credentials = {
  type: "service_account",
  project_id: "emotus-project",
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const storage = new Storage({
  credentials,
  projectId: 'emotus-project'
});

// Use the same bucket name as configured in Firebase
const bucket = storage.bucket('emotus-project.firebasestorage.app');

class StorageService {
  static async uploadProfilePhoto(fileName, fileBuffer) {
    try {
      const file = bucket.file(fileName);
      const stream = file.createWriteStream({
        metadata: {
          contentType: 'image/jpeg',
          cacheControl: 'public, max-age=31536000'
        },
        resumable: false
      });

      return new Promise((resolve, reject) => {
        stream.on('error', (error) => {
          reject(error);
        });

        stream.on('finish', async () => {
          // Make the file publicly accessible
          await file.makePublic();
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
          resolve(publicUrl);
        });

        stream.end(fileBuffer);
      });
    } catch (error) {
      console.error('Upload to storage error:', error);
      throw new Error('Failed to upload file to storage');
    }
  }

  static async deleteProfilePhoto(photoUrl) {
    try {
      // Extract the full path from the URL
      const urlPath = new URL(photoUrl).pathname;
      const fileName = urlPath.split('/').slice(2).join('/'); // Remove the first two segments (empty and bucket name)
      const file = bucket.file(fileName);
      await file.delete();
    } catch (error) {
      console.error('Delete from storage error:', error);
      throw new Error('Failed to delete file from storage');
    }
  }
}

module.exports = StorageService;