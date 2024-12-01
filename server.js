const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const firebaseAdmin = require('firebase-admin');
const { authenticate } = require('./utils/validateAuth');
const db = require('./utils/db');

dotenv.config();

// Firebase Admin Initialization
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(process.env.FIREBASE_CREDENTIALS_PATH),
});

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require('./routes/authRoutes');
const moodRoutes = require('./routes/moodRoutes');
const fileRoutes = require('./routes/fileRoutes');

app.use('/auth', authRoutes);
app.use('/mood', authenticate, moodRoutes); // Authenticated routes
app.use('/file', fileRoutes);
app.use('/api', authRoutes);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
