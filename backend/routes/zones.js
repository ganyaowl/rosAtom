const express = require("express");
const router = express.Router();
const zoneEngine = require("../utils/zoneEngine");

// GET /zones — current live state of all 5 zones
router.get("/", (req, res) => {
  res.json({ zones: zoneEngine.getZones(), updatedAt: new Date().toISOString() });
});

// POST /zones/trigger-alert — manual-only trigger of a critical event.
// Optional body: { "zoneId": "zone-center" } to target a specific zone,
// otherwise a random zone is selected.
router.post("/trigger-alert", (req, res) => {
  const { zoneId } = req.body || {};
  const triggered = zoneEngine.triggerAlert(zoneId);
  if (!triggered) {
    return res.status(404).json({ error: "Zone not found" });
  }
  res.json({ triggered, zones: zoneEngine.getZones() });
});

module.exports = router;
