const axios = require("axios");

async function getPrediction(image) {
  const response = await axios.post("http://localhost:8000/predict", { image });
  return response.data;
}

module.exports = { getPrediction };
