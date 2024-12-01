const firebaseAdmin = require('firebase-admin');
const { Request, Response, NextFunction } = require('express');

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(403).send('Access Denied');
  }

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).send('Invalid Token');
  }
};

module.exports = { authenticate };
