const express = require("express");
const router = express.Router();
const baseStations = require("../data/stations.json");
const { generateLiveStations, generateWeeklyStatistics } = require("../utils/generate");

// GET /statistics
router.get("/", (req, res) => {
  const liveStations = generateLiveStations(baseStations);
  const stats = generateWeeklyStatistics(liveStations);
  res.json(stats);
});

module.exports = router;
