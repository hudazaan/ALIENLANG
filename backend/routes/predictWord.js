const express = require("express");
const router = express.Router();
const mlService = require("../services/mlService");

router.post("/", async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "No image" });

    const response = await mlService.predictWord(image);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
