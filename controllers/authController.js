const firebaseAdmin = require('firebase-admin');
const admin = firebaseAdmin.initializeApp();

router.post('/login', authController.login);

// Fungsi untuk login menggunakan Firebase Authentication
exports.login = async (req, res) => {
    const { token } = req.body;  // Mengambil token ID yang dikirimkan dari frontend
  
    try {
      // Verifikasi token ID yang dikirimkan oleh frontend
      const decodedToken = await admin.auth().verifyIdToken(token);
  
      // Ambil informasi pengguna berdasarkan token yang sudah diverifikasi
      const user = await admin.auth().getUser(decodedToken.uid);
  
      // Menyediakan respons sukses dengan data pengguna
      return res.status(200).json({
        message: 'Login successful',
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }
      });
  
    } catch (error) {
      // Tangani error jika token tidak valid atau pengguna tidak ditemukan
      console.error('Login error:', error);
      return res.status(401).json({ error: 'Authentication failed' });
    }
  };

module.exports = router;