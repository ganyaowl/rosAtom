import { alertsApi, statisticsApi, stationsApi } from "@/api/endpoints";
import { Alert, Station, StationDetail, StationsResponse, StatisticsResponse } from "@/types";
import {
  buildMockAlerts,
  buildMockStationDetail,
  buildMockStations,
  buildMockStatistics,
} from "./mockData";

let lastKnownStations: Station[] = [];

export const stationService = {
  async getStations(): Promise<StationsResponse> {
    try {
      const data = await stationsApi.getAll();
      lastKnownStations = data.stations;
      return data;
    } catch (e) {
      const stations = buildMockStations();
      lastKnownStations = stations;
      return { count: stations.length, updatedAt: new Date().toISOString(), stations };
    }
  },

  async getStationById(id: string): Promise<StationDetail> {
    try {
      return await stationsApi.getById(id);
    } catch (e) {
      const found = lastKnownStations.find((s) => s.id === id) ?? buildMockStations()[0];
      return buildMockStationDetail(found);
    }
  },

  async getStatistics(): Promise<StatisticsResponse> {
    try {
      return await statisticsApi.get();
    } catch (e) {
      const stations = lastKnownStations.length ? lastKnownStations : buildMockStations();
      return buildMockStatistics(stations);
    }
  },

  async getAlerts(): Promise<Alert[]> {
    try {
      const res = await alertsApi.getAll();
      return res.alerts;
    } catch (e) {
      const stations = lastKnownStations.length ? lastKnownStations : buildMockStations();
      return buildMockAlerts(stations);
    }
  },
};
