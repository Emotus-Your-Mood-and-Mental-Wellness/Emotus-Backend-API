const db = require('../utils/db');

// Model untuk mengambil data pengguna berdasarkan UID
exports.getUserByUid = async (uid) => {
    try {
        const query = 'SELECT * FROM users WHERE uid = $1';
        const values = [uid];
        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            throw new Error('User not found');
        }

        return result.rows[0]; // Mengembalikan data pengguna
    } catch (error) {
        throw new Error('Error fetching user data');
    }
};
