const express = require('express');
const axios = require('axios');
const router = express.Router();

// Post request to ML model endpoint (Cloud Run)
router.post('/predict', async (req, res) => {
  const { text } = req.body;

  try {
    const response = await axios.post(`${process.env.CLOUD_RUN_URL}/predict_mood`, { text });
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error predicting mood');
  }
});

module.exports = router;
