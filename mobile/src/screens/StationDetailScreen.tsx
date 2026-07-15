import React from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { useAppTheme } from "@/theme/ThemeContext";
import { useStationDetail } from "@/hooks/useStationDetail";
import { GlassCard } from "@/components/GlassCard";
import { RadiationBadge } from "@/components/RadiationBadge";
import { RadiationChart } from "@/components/RadiationChart";
import { formatLevel } from "@/utils/radiation";
import { formatDateTime, formatTime } from "@/utils/date";
import { RootStackParamList } from "@/navigation/types";

type DetailRoute = RouteProp<RootStackParamList, "StationDetail">;

export default function StationDetailScreen() {
  const { params } = useRoute<DetailRoute>();
  const { colors } = useAppTheme();
  const { station, loading, refresh } = useStationDetail(params.stationId);

  const labels =
    station?.history
      .filter((_, idx) => idx % 4 === 0)
      .map((h) => formatTime(h.timestamp)) ?? [];
  const values = station?.history.filter((_, idx) => idx % 4 === 0).map((h) => h.level) ?? [];

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.accent} />}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {station?.name ?? params.stationName ?? "Станция"}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{station?.region}</Text>
      </View>

      <View style={styles.section}>
        <GlassCard radius={26}>
          <View style={styles.topRow}>
            <View>
              <Text style={[styles.levelLabel, { color: colors.textSecondary }]}>
                Текущий уровень
              </Text>
              <Text style={[styles.levelValue, { color: colors.text }]}>
                {station ? formatLevel(station.level, station.unit) : "—"}
              </Text>
            </View>
            {station && <RadiationBadge status={station.status} size="large" />}
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color={colors.textTertiary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              {station ? `${station.latitude.toFixed(4)}, ${station.longitude.toFixed(4)}` : "—"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color={colors.textTertiary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Последнее измерение: {station ? formatDateTime(station.lastUpdated) : "—"}
            </Text>
          </View>
        </GlassCard>
      </View>

      <View style={styles.section}>
        <GlassCard radius={26}>
          <RadiationChart title="История измерений (24ч)" labels={labels} values={values} />
        </GlassCard>
      </View>

      <View style={styles.section}>
        <GlassCard
          radius={26}
          style={{
            borderColor: station?.safe ? colors.normal + "55" : colors.critical + "55",
          }}
        >
          <View style={styles.safeRow}>
            <Ionicons
              name={station?.safe ? "shield-checkmark" : "warning"}
              size={22}
              color={station?.safe ? colors.normal : colors.critical}
            />
            <Text
              style={[
                styles.safeText,
                { color: station?.safe ? colors.normal : colors.critical },
              ]}
            >
              {station?.safe ? "Находиться рядом безопасно" : "Находиться рядом небезопасно"}
            </Text>
          </View>
          <Text style={[styles.recommendation, { color: colors.textSecondary }]}>
            {station?.recommendation ?? "Загрузка рекомендаций…"}
          </Text>
        </GlassCard>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 60, paddingHorizontal: 20 },
  title: { fontSize: 26, fontWeight: "800" },
  subtitle: { fontSize: 14, marginTop: 4 },
  section: { paddingHorizontal: 20, marginTop: 18 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  levelLabel: { fontSize: 13, fontWeight: "500" },
  levelValue: { fontSize: 26, fontWeight: "800", marginTop: 4 },
  divider: { height: 1, marginVertical: 14 },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  infoText: { fontSize: 13, marginLeft: 6 },
  safeRow: { flexDirection: "row", alignItems: "center" },
  safeText: { fontSize: 16, fontWeight: "800", marginLeft: 8 },
  recommendation: { fontSize: 14, lineHeight: 20, marginTop: 12 },
});
