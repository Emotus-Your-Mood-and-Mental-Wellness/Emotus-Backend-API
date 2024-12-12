const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = {
  type: "service_account",
  project_id: "emotus-project",
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "emotus-project",
  storageBucket: "emotus-project.firebasestorage.app",
  databaseURL: "https://emotus-project-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = getFirestore(app, "emotus-database");

db.settings({ 
  timestampsInSnapshots: true,
  ignoreUndefinedProperties: true
});

module.exports = { admin, db };