const THRESHOLDS = {
  normal: 0.3,
  elevated: 0.6,
  dangerous: 1.2,
};

function getStatus(level) {
  if (level < THRESHOLDS.normal) return "normal";
  if (level < THRESHOLDS.elevated) return "elevated";
  if (level < THRESHOLDS.dangerous) return "dangerous";
  return "critical";
}

// Small chance of a spike so demo data has some interesting variety
function randomLevel(base = 0.15) {
  const noise = (Math.random() - 0.5) * 0.12;
  const spike = Math.random() < 0.06 ? Math.random() * 1.4 : 0;
  const value = Math.max(0.03, base + noise + spike);
  return Math.round(value * 1000) / 1000;
}

function randomTimestampWithinMinutes(minutes) {
  const now = Date.now();
  const delta = Math.random() * minutes * 60 * 1000;
  return new Date(now - delta).toISOString();
}

function generateLiveStations(baseStations) {
  return baseStations.map((s) => {
    const level = randomLevel(0.1 + Math.random() * 0.15);
    return {
      ...s,
      level,
      unit: "мкЗв/ч",
      status: getStatus(level),
      lastUpdated: randomTimestampWithinMinutes(15),
    };
  });
}

function generateHistoryForStation(stationId, points = 24) {
  const now = Date.now();
  const base = 0.1 + Math.random() * 0.15;
  const history = [];
  for (let i = points - 1; i >= 0; i--) {
    const timestamp = new Date(now - i * 60 * 60 * 1000).toISOString();
    const level = randomLevel(base);
    history.push({ timestamp, level, status: getStatus(level) });
  }
  return history;
}

function generateWeeklyStatistics(liveStations) {
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const weekly = days.map((day) => {
    const avg = 0.1 + Math.random() * 0.2;
    const max = avg + Math.random() * 0.3;
    const min = Math.max(0.02, avg - Math.random() * 0.08);
    return {
      day,
      average: Math.round(avg * 1000) / 1000,
      max: Math.round(max * 1000) / 1000,
      min: Math.round(min * 1000) / 1000,
    };
  });

  const levels = liveStations.map((s) => s.level);
  const average = levels.reduce((a, b) => a + b, 0) / levels.length;
  const max = Math.max(...levels);
  const min = Math.min(...levels);

  return {
    average: Math.round(average * 1000) / 1000,
    max: Math.round(max * 1000) / 1000,
    min: Math.round(min * 1000) / 1000,
    unit: "мкЗв/ч",
    weekly,
    updatedAt: new Date().toISOString(),
  };
}

function generateAlerts(liveStations) {
  return liveStations
    .filter((s) => s.status === "dangerous" || s.status === "critical")
    .map((s, idx) => ({
      id: `alert-${s.id}-${idx}`,
      stationId: s.id,
      stationName: s.name,
      level: s.level,
      status: s.status,
      message:
        s.status === "critical"
          ? `Критическое превышение уровня радиации на станции «${s.name}». Избегайте пребывания в этом районе.`
          : `Повышенный уровень радиации зафиксирован на станции «${s.name}». Следите за обновлениями.`,
      createdAt: s.lastUpdated,
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

module.exports = {
  THRESHOLDS,
  getStatus,
  randomLevel,
  generateLiveStations,
  generateHistoryForStation,
  generateWeeklyStatistics,
  generateAlerts,
};
