const baseZones = require("../data/zones.json");

// Safe operating range for normal fluctuation. The random walk NEVER
// crosses into "dangerous"/"critical" on its own — only a manual trigger can.
const SAFE_MIN = 25;
const SAFE_MAX = 140;
const ELEVATED_THRESHOLD = 80;
const CRITICAL_VALUE = 1000;

// Number of ticks a manually-triggered critical zone stays red before
// automatically de-escalating back to a safe baseline (tick interval is
// defined in server.js — with a 5s tick this is ~60s).
const CRITICAL_TICKS = 12;

let state = baseZones.map((z) => ({
  id: z.id,
  name: z.name,
  centerLat: z.centerLat,
  centerLon: z.centerLon,
  level: z.baseline,
  status: z.baseline < ELEVATED_THRESHOLD ? "normal" : "elevated",
  updatedAt: new Date().toISOString(),
  criticalTicksRemaining: 0,
}));

function statusForLevel(level) {
  if (level >= CRITICAL_VALUE * 0.5) return "critical";
  if (level >= ELEVATED_THRESHOLD) return "elevated";
  return "normal";
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// Called on a fixed interval from server.js. Advances the normal, safe
// random walk for every zone that is not currently in a manually-triggered
// critical state, and counts down critical zones back to safety.
function tick() {
  state = state.map((zone) => {
    if (zone.status === "critical" && zone.criticalTicksRemaining > 0) {
      const ticksRemaining = zone.criticalTicksRemaining - 1;
      if (ticksRemaining <= 0) {
        const recoveryLevel = Math.round(SAFE_MIN + Math.random() * 30);
        return {
          ...zone,
          level: recoveryLevel,
          status: statusForLevel(recoveryLevel),
          criticalTicksRemaining: 0,
          updatedAt: new Date().toISOString(),
        };
      }
      return { ...zone, criticalTicksRemaining: ticksRemaining };
    }

    const delta = (Math.random() - 0.5) * 24; // small step
    const nextLevel = clamp(Math.round(zone.level + delta), SAFE_MIN, SAFE_MAX);
    return {
      ...zone,
      level: nextLevel,
      status: statusForLevel(nextLevel),
      updatedAt: new Date().toISOString(),
    };
  });
}

function getZones() {
  return state;
}

// Manual trigger only — this is the ONLY code path that can produce a
// critical/red zone. Picks a random zone (or a specific one if provided).
function triggerAlert(zoneId) {
  const targetId = zoneId || state[Math.floor(Math.random() * state.length)].id;
  let triggered = null;

  state = state.map((zone) => {
    if (zone.id === targetId) {
      triggered = {
        ...zone,
        level: CRITICAL_VALUE,
        status: "critical",
        criticalTicksRemaining: CRITICAL_TICKS,
        updatedAt: new Date().toISOString(),
      };
      return triggered;
    }
    return zone;
  });

  return triggered;
}

module.exports = { getZones, tick, triggerAlert };
