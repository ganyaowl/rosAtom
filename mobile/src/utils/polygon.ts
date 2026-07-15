interface LatLng {
  latitude: number;
  longitude: number;
}

// Simple deterministic pseudo-random hash so the same (zoneId, tick, index)
// always produces the same jitter within a tick, but a DIFFERENT one on the
// next tick — this is what makes the polygon "breathe" over time.
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

interface PolygonOptions {
  zoneId: string;
  centerLat: number;
  centerLon: number;
  level: number; // radiation level drives the base size of the zone
  tick: number; // increases over time to continuously morph the shape
}

// Builds an irregular, non-circular, non-square polygon around a center
// point. Vertex count (6-9), radius, and per-vertex jitter all vary with
// `tick`, so the shape's size/vertex-count/outline keep changing while the
// app runs — without ever becoming a perfect circle or fixed square.
export function buildDynamicZonePolygon(opts: PolygonOptions): LatLng[] {
  const { zoneId, centerLat, centerLon, level, tick } = opts;
  const seedBase = hashString(zoneId) + tick * 37;

  // Vertex count wobbles between 6 and 9 corners over time.
  const vertexCount = 6 + (Math.floor(seededRandom(seedBase) * 4) % 4);

  // Base radius (in degrees) grows a bit with radiation level, so a more
  // active zone visually expands, then breathes +/-15% around that base.
  const baseRadius = 0.22 + Math.min(level, 200) / 200 / 3;
  const breathing = 1 + (seededRandom(seedBase + 1) - 0.5) * 0.3;
  const radius = baseRadius * breathing;

  const points: LatLng[] = [];
  for (let i = 0; i < vertexCount; i++) {
    const angle = (i / vertexCount) * Math.PI * 2;
    // Each vertex gets its own small random offset that changes every tick.
    const vertexJitter = 0.75 + seededRandom(seedBase + i * 7.13) * 0.5;
    const r = radius * vertexJitter;

    // Longitude degrees are "shorter" than latitude degrees away from the
    // equator, so correct by cos(latitude) to keep the shape visually even.
    const dLat = r * Math.sin(angle);
    const dLon = (r * Math.cos(angle)) / Math.cos((centerLat * Math.PI) / 180);

    points.push({
      latitude: centerLat + dLat,
      longitude: centerLon + dLon,
    });
  }

  return points;
}
