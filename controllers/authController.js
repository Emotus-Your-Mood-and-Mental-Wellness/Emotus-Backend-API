const firebaseAdmin = require('firebase-admin');

// Fungsi untuk login dan memverifikasi token Firebase
exports.loginUser = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).send('Token is required');
    }

    try {
        // Verifikasi token Firebase
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
        res.status(200).json({ uid: decodedToken.uid, message: 'Login successful' });
    } catch (error) {
        res.status(401).send('Invalid or expired token');
    }
};
