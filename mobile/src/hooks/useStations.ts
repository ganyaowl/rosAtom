import { useCallback, useEffect, useRef, useState } from "react";
import { Station } from "@/types";
import { stationService } from "@/services/stationService";

export function useStations(refreshIntervalSec = 60) {
  const [stations, setStations] = useState<Station[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const data = await stationService.getStations();
      setStations(data.stations);
      setUpdatedAt(data.updatedAt);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => load(), refreshIntervalSec * 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refreshIntervalSec, load]);

  return {
    stations,
    updatedAt,
    loading,
    refreshing,
    refresh: () => load(true),
  };
}
