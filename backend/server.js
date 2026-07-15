const express = require("express");
const cors = require("cors");

const stationsRouter = require("./routes/stations");
const statisticsRouter = require("./routes/statistics");
const alertsRouter = require("./routes/alerts");
const zonesRouter = require("./routes/zones");
const zoneEngine = require("./utils/zoneEngine");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "Radiation Monitor API",
    status: "ok",
    endpoints: ["/stations", "/stations/:id", "/statistics", "/alerts"],
  });
});

app.use("/stations", stationsRouter);
app.use("/statistics", statisticsRouter);
app.use("/alerts", alertsRouter);
app.use("/zones", zonesRouter);

// Advance the safe random walk for all zones every 5 seconds.
// Manual triggers (POST /zones/trigger-alert) are the only way to get
// a critical/red zone — this loop never produces one on its own.
setInterval(() => zoneEngine.tick(), 5000);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Radiation Monitor API running on http://localhost:${PORT}`);
});
