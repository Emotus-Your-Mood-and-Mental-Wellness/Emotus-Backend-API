// Model untuk menyimpan metadata file jika diperlukan
const db = require('../utils/db');

exports.saveFileMetadata = async (fileData) => {
    const { filename, fileUrl, userId } = fileData;

    try {
        const query = 'INSERT INTO files (filename, file_url, user_id) VALUES ($1, $2, $3) RETURNING *';
        const values = [filename, fileUrl, userId];
        const result = await db.query(query, values);

        return result.rows[0]; // Mengembalikan file yang disimpan
    } catch (error) {
        throw new Error('Error saving file metadata');
    }
};
