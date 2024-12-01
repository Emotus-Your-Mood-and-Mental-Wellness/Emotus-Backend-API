const firebaseAdmin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Inisialisasi Firebase Admin SDK dengan credentials
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(process.env.FIREBASE_CREDENTIALS_PATH),
});

module.exports = firebaseAdmin;
