const db = require('../utils/db');

// Model untuk menyimpan mood yang diprediksi ke dalam database
exports.saveMoodPrediction = async (userId, moodData) => {
    const { predictedMood, stressLevel, suggestions } = moodData;

    try {
        const query = 'INSERT INTO mood_predictions (user_id, predicted_mood, stress_level, suggestions) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [userId, predictedMood, stressLevel, JSON.stringify(suggestions)];
        const result = await db.query(query, values);

        return result.rows[0]; // Mengembalikan data mood yang disimpan
    } catch (error) {
        throw new Error('Error saving mood prediction');
    }
};
