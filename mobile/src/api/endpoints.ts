import { apiClient } from "./client";
import {
  AlertsResponse,
  StationDetail,
  StationsResponse,
  StatisticsResponse,
  ZonesResponse,
  Zone,
} from "@/types";

export const stationsApi = {
  getAll: () => apiClient.get<StationsResponse>("/stations"),
  getById: (id: string) => apiClient.get<StationDetail>(`/stations/${id}`),
};

export const statisticsApi = {
  get: () => apiClient.get<StatisticsResponse>("/statistics"),
};

export const alertsApi = {
  getAll: () => apiClient.get<AlertsResponse>("/alerts"),
};

export const zonesApi = {
  getAll: () => apiClient.get<ZonesResponse>("/zones"),
  triggerAlert: (zoneId?: string) =>
    apiClient.post<{ triggered: Zone; zones: Zone[] }>("/zones/trigger-alert", { zoneId }),
};
