const axios = require('axios');

// Fungsi untuk mengirim permintaan ke Cloud Run untuk prediksi mood
exports.getMoodPrediction = async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).send('Text input is required');
    }

    try {
        // Mengirim request ke API Cloud Run
        const response = await axios.post(`${process.env.CLOUD_RUN_URL}/predict_mood`, { text });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).send('Error predicting mood');
    }
};
