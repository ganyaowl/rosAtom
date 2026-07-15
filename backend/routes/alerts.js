const express = require("express");
const router = express.Router();
const baseStations = require("../data/stations.json");
const { generateLiveStations, generateAlerts } = require("../utils/generate");

// GET /alerts
router.get("/", (req, res) => {
  const liveStations = generateLiveStations(baseStations);
  const alerts = generateAlerts(liveStations);
  res.json({ count: alerts.length, alerts });
});

module.exports = router;
