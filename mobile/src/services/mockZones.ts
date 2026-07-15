import { RadiationStatus, Zone } from "@/types";

const BASE_ZONES = [
  { id: "zone-north", name: "Север", centerLat: 41.05, centerLon: 44.55, baseline: 60 },
  { id: "zone-south", name: "Юг", centerLat: 39.35, centerLon: 45.35, baseline: 55 },
  { id: "zone-west", name: "Запад", centerLat: 40.1, centerLon: 43.75, baseline: 65 },
  { id: "zone-east", name: "Восток", centerLat: 40.1, centerLon: 45.6, baseline: 70 },
  { id: "zone-center", name: "Центр", centerLat: 40.3, centerLon: 44.6, baseline: 90 },
];

const SAFE_MIN = 25;
const SAFE_MAX = 140;
const ELEVATED_THRESHOLD = 80;

function statusForLevel(level: number): RadiationStatus {
  if (level >= 500) return "critical";
  if (level >= ELEVATED_THRESHOLD) return "elevated";
  return "normal";
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

// Keeps its own in-memory levels across calls so the client-side fallback
// walk feels continuous (same idea as the backend's zoneEngine), only used
// when the real backend can't be reached.
let localState: Zone[] = BASE_ZONES.map((z) => ({
  id: z.id,
  name: z.name,
  centerLat: z.centerLat,
  centerLon: z.centerLon,
  level: z.baseline,
  status: statusForLevel(z.baseline),
  updatedAt: new Date().toISOString(),
}));

export function getLocalFallbackZones(): Zone[] {
  localState = localState.map((zone) => {
    if (zone.status === "critical") return zone; // stays until locally reset
    const delta = (Math.random() - 0.5) * 24;
    const nextLevel = clamp(Math.round(zone.level + delta), SAFE_MIN, SAFE_MAX);
    return { ...zone, level: nextLevel, status: statusForLevel(nextLevel), updatedAt: new Date().toISOString() };
  });
  return localState;
}

export function triggerLocalFallbackAlert(): Zone {
  const idx = Math.floor(Math.random() * localState.length);
  localState = localState.map((z, i) =>
    i === idx ? { ...z, level: 1000, status: "critical" as const, updatedAt: new Date().toISOString() } : z
  );
  return localState[idx];
}
