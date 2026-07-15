const express = require("express");
const router = express.Router();
const baseStations = require("../data/stations.json");
const {
  generateLiveStations,
  generateHistoryForStation,
  getStatus,
} = require("../utils/generate");

// Cache live snapshot for a few seconds so /stations and /stations/:id stay consistent
let cache = { data: null, ts: 0 };
const CACHE_MS = 5000;

function getLiveStations() {
  const now = Date.now();
  if (!cache.data || now - cache.ts > CACHE_MS) {
    cache = { data: generateLiveStations(baseStations), ts: now };
  }
  return cache.data;
}

// GET /stations
router.get("/", (req, res) => {
  const stations = getLiveStations();
  res.json({
    count: stations.length,
    updatedAt: new Date().toISOString(),
    stations,
  });
});

// GET /stations/:id
router.get("/:id", (req, res) => {
  const stations = getLiveStations();
  const station = stations.find((s) => s.id === req.params.id);
  if (!station) {
    return res.status(404).json({ error: "Station not found" });
  }
  const history = generateHistoryForStation(station.id, 24);
  const safe = station.status === "normal" || station.status === "elevated";

  res.json({
    ...station,
    history,
    recommendation: getRecommendation(station.status),
    safe,
  });
});

function getRecommendation(status) {
  switch (status) {
    case "normal":
      return "Радиационный фон в норме. Особые меры предосторожности не требуются.";
    case "elevated":
      return "Уровень немного повышен. Рекомендуется следить за обновлениями и избегать длительного пребывания на улице.";
    case "dangerous":
      return "Опасный уровень радиации. Ограничьте время пребывания вне помещений и следуйте указаниям местных властей.";
    case "critical":
      return "Критический уровень радиации! Немедленно покиньте зону, используйте средства защиты и следуйте инструкциям экстренных служб.";
    default:
      return "Нет данных для рекомендаций.";
  }
}

module.exports = router;
