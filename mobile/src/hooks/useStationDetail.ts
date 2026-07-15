import { useCallback, useEffect, useState } from "react";
import { StationDetail } from "@/types";
import { stationService } from "@/services/stationService";

export function useStationDetail(id: string) {
  const [station, setStation] = useState<StationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await stationService.getStationById(id);
      setStation(data);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { station, loading, refresh: load };
}
