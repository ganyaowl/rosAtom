import { useCallback, useEffect, useState } from "react";
import { StatisticsResponse } from "@/types";
import { stationService } from "@/services/stationService";

export function useStatistics() {
  const [statistics, setStatistics] = useState<StatisticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await stationService.getStatistics();
      setStatistics(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { statistics, loading, refresh: load };
}
