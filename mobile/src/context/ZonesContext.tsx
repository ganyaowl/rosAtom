import React, { createContext, useContext } from "react";
import { useZones, ZonesSource } from "@/hooks/useZones";
import { Zone } from "@/types";
import { EmergencyModal } from "@/components/EmergencyModal";

interface ZonesContextValue {
  zones: Zone[];
  tick: number;
  source: ZonesSource;
  triggerTestAlert: () => Promise<void>;
}

const ZonesContext = createContext<ZonesContextValue | undefined>(undefined);

export const ZonesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { zones, tick, source, criticalZone, dismissCriticalAlert, triggerTestAlert } = useZones();

  return (
    <ZonesContext.Provider value={{ zones, tick, source, triggerTestAlert }}>
      {children}
      {/* Mounted at the root so it can overlay and block ANY screen the
          user is currently on, the moment a zone goes critical. */}
      <EmergencyModal zone={criticalZone} onDismiss={dismissCriticalAlert} />
    </ZonesContext.Provider>
  );
};

export function useZonesContext(): ZonesContextValue {
  const ctx = useContext(ZonesContext);
  if (!ctx) throw new Error("useZonesContext must be used within ZonesProvider");
  return ctx;
}
