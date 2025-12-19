const express = require("express");
const router = express.Router();
const mlService = require("../services/mlService");

router.post("/", async (req, res) => {
  try {
    const { image } = req.body;
     if (!image) return res.status(400).json({ error: "No image provided" });

    const result = await mlService.getPrediction(image);
    return res.json(result);
  } catch (err) {
    console.error("Predict route error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;