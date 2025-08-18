const express = require("express");
const router = express.Router();
const mlService = require("../services/mlService");

router.post("/", async (req, res) => {
  try {
    const { image } = req.body;
    const result = await mlService.getPrediction(image);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
