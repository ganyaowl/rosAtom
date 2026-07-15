import { useCallback, useEffect, useRef, useState } from "react";
import { Zone } from "@/types";
import { zonesApi } from "@/api/endpoints";
import { getLocalFallbackZones, triggerLocalFallbackAlert } from "@/services/mockZones";

const POLL_MS = 4000;

export type ZonesSource = "backend" | "local";

export function useZones() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [tick, setTick] = useState(0);
  const [source, setSource] = useState<ZonesSource>("local");
  const [criticalZone, setCriticalZone] = useState<Zone | null>(null);
  const prevStatuses = useRef<Record<string, string>>({});

  const applyZones = useCallback((next: Zone[], nextSource: ZonesSource) => {
    // Detect a transition INTO "critical" so we only fire the emergency
    // modal/sound once per event, not on every poll while it stays critical.
    next.forEach((zone) => {
      const prevStatus = prevStatuses.current[zone.id];
      if (zone.status === "critical" && prevStatus !== "critical") {
        setCriticalZone(zone);
      }
      prevStatuses.current[zone.id] = zone.status;
    });
    setZones(next);
    setSource(nextSource);
    setTick((t) => t + 1);
  }, []);

  const poll = useCallback(async () => {
    try {
      const data = await zonesApi.getAll();
      if (!data.zones || data.zones.length === 0) throw new Error("empty zones");
      applyZones(data.zones, "backend");
    } catch (e) {
      // Backend unreachable (or /zones not implemented yet) — fall back to
      // a local, safe random walk so the map never sits empty. Terminal
      // triggers (npm run radiation-alert) only affect the REAL backend,
      // so while `source` is "local" they will have no visible effect here.
      applyZones(getLocalFallbackZones(), "local");
    }
  }, [applyZones]);

  useEffect(() => {
    poll();
    const interval = setInterval(poll, POLL_MS);
    return () => clearInterval(interval);
  }, [poll]);

  const triggerTestAlert = useCallback(async () => {
    try {
      const res = await zonesApi.triggerAlert();
      applyZones(res.zones, "backend");
    } catch (e) {
      const triggered = triggerLocalFallbackAlert();
      applyZones(getLocalFallbackZones(), "local");
      prevStatuses.current[triggered.id] = "elevated";
      setCriticalZone(triggered);
    }
  }, [applyZones]);

  const dismissCriticalAlert = useCallback(() => {
    setCriticalZone(null);
  }, []);

  return { zones, tick, source, criticalZone, dismissCriticalAlert, triggerTestAlert };
}
