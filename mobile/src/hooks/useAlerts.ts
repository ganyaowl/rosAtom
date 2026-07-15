import { useCallback, useEffect, useState } from "react";
import { Alert } from "@/types";
import { stationService } from "@/services/stationService";

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await stationService.getAlerts();
      setAlerts(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { alerts, loading, refresh: load };
}
