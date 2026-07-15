import { Alert, HistoryPoint, RadiationStatus, Station, StationDetail, StatisticsResponse } from "@/types";

const NAMES: [string, string, number, number][] = [
  ["Ереван", "г. Ереван", 40.1792, 44.4991],
  ["Гюмри", "Ширакская область", 40.7942, 43.8481],
  ["Ванадзор", "Лорийская область", 40.8128, 44.4886],
  ["Вагаршапат", "Армавирская область", 40.1611, 44.2911],
  ["Раздан", "Котайкская область", 40.4972, 44.7681],
  ["Абовян", "Котайкская область", 40.2764, 44.6219],
  ["Капан", "Сюникская область", 39.2039, 46.4064],
  ["Армавир", "Армавирская область", 40.1511, 44.0428],
  ["Арташат", "Араратская область", 39.9506, 44.5486],
  ["Иджеван", "Тавушская область", 40.8781, 45.1489],
];

function getStatus(level: number): RadiationStatus {
  if (level < 0.3) return "normal";
  if (level < 0.6) return "elevated";
  if (level < 1.2) return "dangerous";
  return "critical";
}

function randomLevel(base = 0.15): number {
  const noise = (Math.random() - 0.5) * 0.12;
  const spike = Math.random() < 0.08 ? Math.random() * 1.4 : 0;
  return Math.round(Math.max(0.03, base + noise + spike) * 1000) / 1000;
}

export function buildMockStations(): Station[] {
  return NAMES.map(([name, region, latitude, longitude], idx) => {
    const level = randomLevel(0.1 + Math.random() * 0.15);
    return {
      id: `mock-${idx}`,
      name,
      region,
      latitude,
      longitude,
      level,
      unit: "мкЗв/ч",
      status: getStatus(level),
      lastUpdated: new Date(Date.now() - Math.random() * 15 * 60 * 1000).toISOString(),
    };
  });
}

export function buildMockHistory(points = 24): HistoryPoint[] {
  const now = Date.now();
  const base = 0.1 + Math.random() * 0.15;
  const history: HistoryPoint[] = [];
  for (let i = points - 1; i >= 0; i--) {
    const level = randomLevel(base);
    history.push({
      timestamp: new Date(now - i * 60 * 60 * 1000).toISOString(),
      level,
      status: getStatus(level),
    });
  }
  return history;
}

export function buildMockStationDetail(station: Station): StationDetail {
  const history = buildMockHistory();
  const safe = station.status === "normal" || station.status === "elevated";
  const recommendation =
    station.status === "critical"
      ? "Критический уровень радиации! Немедленно покиньте зону и следуйте инструкциям экстренных служб."
      : station.status === "dangerous"
      ? "Опасный уровень радиации. Ограничьте время пребывания на улице."
      : station.status === "elevated"
      ? "Уровень немного повышен. Следите за обновлениями."
      : "Радиационный фон в норме.";

  return { ...station, history, safe, recommendation };
}

export function buildMockStatistics(stations: Station[]): StatisticsResponse {
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const weekly = days.map((day) => {
    const avg = 0.1 + Math.random() * 0.2;
    return {
      day,
      average: Math.round(avg * 1000) / 1000,
      max: Math.round((avg + Math.random() * 0.3) * 1000) / 1000,
      min: Math.round(Math.max(0.02, avg - Math.random() * 0.08) * 1000) / 1000,
    };
  });
  const levels = stations.map((s) => s.level);
  return {
    average: Math.round((levels.reduce((a, b) => a + b, 0) / levels.length) * 1000) / 1000,
    max: Math.round(Math.max(...levels) * 1000) / 1000,
    min: Math.round(Math.min(...levels) * 1000) / 1000,
    unit: "мкЗв/ч",
    weekly,
    updatedAt: new Date().toISOString(),
  };
}

export function buildMockAlerts(stations: Station[]): Alert[] {
  return stations
    .filter((s) => s.status === "dangerous" || s.status === "critical")
    .map((s, idx) => ({
      id: `mock-alert-${idx}`,
      stationId: s.id,
      stationName: s.name,
      level: s.level,
      status: s.status,
      message:
        s.status === "critical"
          ? `Критическое превышение уровня радиации на станции «${s.name}».`
          : `Повышенный уровень радиации зафиксирован на станции «${s.name}».`,
      createdAt: s.lastUpdated,
    }));
}
