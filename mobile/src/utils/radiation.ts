import { RadiationStatus } from "@/types";
import { statusColors, statusLabels } from "@/theme/colors";

export function getStatusColor(status: RadiationStatus): string {
  return statusColors[status];
}

export function getStatusLabel(status: RadiationStatus): string {
  return statusLabels[status];
}

export function getStatusEmoji(status: RadiationStatus): string {
  switch (status) {
    case "normal":
      return "🟢";
    case "elevated":
      return "🟡";
    case "dangerous":
      return "🟠";
    case "critical":
      return "🔴";
    default:
      return "⚪";
  }
}

export function formatLevel(level: number, unit = "мкЗв/ч"): string {
  return `${level.toFixed(2)} ${unit}`;
}
