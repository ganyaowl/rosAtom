import React from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAppTheme } from "@/theme/ThemeContext";
import { useStatistics } from "@/hooks/useStatistics";
import { GlassCard } from "@/components/GlassCard";
import { StatPill } from "@/components/StatPill";
import { WeeklyBarChart } from "@/components/WeeklyBarChart";
import { RadiationChart } from "@/components/RadiationChart";
import { formatDateTime } from "@/utils/date";

export default function StatisticsScreen() {
  const { colors } = useAppTheme();
  const { statistics, loading, refresh } = useStatistics();

  const weekly = statistics?.weekly ?? [];
  const labels = weekly.map((d) => d.day);
  const averages = weekly.map((d) => d.average);

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.accent} />}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Статистика</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Обновлено: {statistics ? formatDateTime(statistics.updatedAt) : "—"}
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.pillsRow}>
          <StatPill
            label="Минимум"
            value={statistics ? `${statistics.min.toFixed(2)}` : "—"}
            color={colors.normal}
            icon={<Ionicons name="arrow-down-circle" size={20} color={colors.normal} />}
          />
          <StatPill
            label="Среднее"
            value={statistics ? `${statistics.average.toFixed(2)}` : "—"}
            color={colors.accent}
            icon={<Ionicons name="analytics" size={20} color={colors.accent} />}
          />
          <StatPill
            label="Максимум"
            value={statistics ? `${statistics.max.toFixed(2)}` : "—"}
            color={colors.critical}
            icon={<Ionicons name="arrow-up-circle" size={20} color={colors.critical} />}
          />
        </View>
      </View>

      <View style={styles.section}>
        <GlassCard radius={26}>
          <RadiationChart
            title="Динамика уровня радиации"
            labels={labels}
            values={averages}
            unit={statistics?.unit}
          />
        </GlassCard>
      </View>

      <View style={styles.section}>
        <GlassCard radius={26}>
          <WeeklyBarChart
            title="Недельная статистика (среднее)"
            labels={labels}
            values={averages}
            unit={statistics?.unit}
          />
        </GlassCard>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>По дням недели</Text>
        {weekly.map((d) => (
          <View
            key={d.day}
            style={[styles.dayRow, { backgroundColor: colors.cardSolid, borderColor: colors.border }]}
          >
            <Text style={[styles.dayLabel, { color: colors.text }]}>{d.day}</Text>
            <View style={styles.dayValues}>
              <Text style={[styles.dayValueText, { color: colors.textSecondary }]}>
                min {d.min.toFixed(2)}
              </Text>
              <Text style={[styles.dayValueText, { color: colors.text, fontWeight: "700" }]}>
                avg {d.average.toFixed(2)}
              </Text>
              <Text style={[styles.dayValueText, { color: colors.textSecondary }]}>
                max {d.max.toFixed(2)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 10 },
  title: { fontSize: 28, fontWeight: "800" },
  subtitle: { fontSize: 13, marginTop: 4 },
  section: { paddingHorizontal: 20, marginTop: 18 },
  pillsRow: { flexDirection: "row" },
  sectionTitle: { fontSize: 18, fontWeight: "800", marginBottom: 12 },
  dayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 10,
  },
  dayLabel: { fontSize: 15, fontWeight: "700", width: 40 },
  dayValues: { flexDirection: "row", flex: 1, justifyContent: "flex-end" },
  dayValueText: { fontSize: 12, marginLeft: 10 },
});
