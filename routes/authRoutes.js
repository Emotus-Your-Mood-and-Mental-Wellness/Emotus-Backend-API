const express = require('express');
const firebaseAdmin = require('firebase-admin');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { token } = req.body;

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    res.status(200).json({ uid: decodedToken.uid, message: 'Login successful' });
  } catch (error) {
    res.status(401).send('Invalid or expired token');
  }
});

module.exports = router;
