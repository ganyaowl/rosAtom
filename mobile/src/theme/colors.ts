export const statusColors = {
  normal: "#30D158",
  elevated: "#FFD60A",
  dangerous: "#FF9F0A",
  critical: "#FF453A",
};

export const statusLabels: Record<string, string> = {
  normal: "Норма",
  elevated: "Повышено",
  dangerous: "Опасно",
  critical: "Критично",
};

export const lightColors = {
  background: "#F2F3F7",
  backgroundSecondary: "#FFFFFF",
  card: "rgba(255,255,255,0.65)",
  cardSolid: "#FFFFFF",
  border: "rgba(60,60,67,0.12)",
  text: "#0B1120",
  textSecondary: "#6B7280",
  textTertiary: "#9CA3AF",
  accent: "#0A84FF",
  accentSoft: "rgba(10,132,255,0.12)",
  tabBar: "rgba(255,255,255,0.8)",
  shadow: "rgba(20,20,43,0.12)",
  ...statusColors,
};

export const darkColors = {
  background: "#0B1120",
  backgroundSecondary: "#111827",
  card: "rgba(30,34,48,0.55)",
  cardSolid: "#171B27",
  border: "rgba(255,255,255,0.08)",
  text: "#F5F6FA",
  textSecondary: "#9AA3B2",
  textTertiary: "#6B7280",
  accent: "#0A84FF",
  accentSoft: "rgba(10,132,255,0.18)",
  tabBar: "rgba(17,20,31,0.75)",
  shadow: "rgba(0,0,0,0.45)",
  ...statusColors,
};

export type AppColors = typeof lightColors;
