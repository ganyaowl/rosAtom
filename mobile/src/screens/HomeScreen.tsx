import React, { useMemo } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";

import { useAppTheme } from "@/theme/ThemeContext";
import { useStations } from "@/hooks/useStations";
import { useZonesContext } from "@/context/ZonesContext";
import { GlassCard } from "@/components/GlassCard";
import { RadiationBadge } from "@/components/RadiationBadge";
import { AnimatedPressable } from "@/components/AnimatedPressable";
import { StationCard } from "@/components/StationCard";
import { ZoneMapView } from "@/components/ZoneMapView";
import { getStatusColor, formatLevel } from "@/utils/radiation";
import { formatDateTime } from "@/utils/date";
import { RootStackParamList } from "@/navigation/types";

export default function HomeScreen() {
  const { colors, refreshIntervalSec } = useAppTheme();
  const { stations, updatedAt, loading, refreshing, refresh } = useStations(refreshIntervalSec);
  const { zones, tick } = useZonesContext();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const overallStatus = useMemo(() => {
    if (!stations.length) return "normal" as const;
    const order = ["normal", "elevated", "dangerous", "critical"] as const;
    let worst: (typeof order)[number] = "normal";
    stations.forEach((s) => {
      if (order.indexOf(s.status) > order.indexOf(worst)) worst = s.status;
    });
    return worst;
  }, [stations]);

  const averageLevel = useMemo(() => {
    if (!stations.length) return 0;
    return stations.reduce((a, s) => a + s.level, 0) / stations.length;
  }, [stations]);

  const recentStations = stations.slice(0, 5);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.accent} />
        }
      >
        <LinearGradient
          colors={[colors.accentSoft, "transparent"]}
          style={styles.headerGradient}
        >
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            Радиационный мониторинг
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>Обстановка по стране</Text>
        </LinearGradient>

        <View style={styles.section}>
          <GlassCard radius={28}>
            <View style={styles.currentRow}>
              <View>
                <Text style={[styles.currentLabel, { color: colors.textSecondary }]}>
                  Средний уровень
                </Text>
                <Text style={[styles.currentValue, { color: colors.text }]}>
                  {formatLevel(averageLevel)}
                </Text>
              </View>
              <RadiationBadge status={overallStatus} size="large" />
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.footerRow}>
              <View style={styles.row}>
                <Ionicons name="refresh-circle-outline" size={16} color={colors.textTertiary} />
                <Text style={[styles.updatedText, { color: colors.textTertiary }]}>
                  Обновлено: {updatedAt ? formatDateTime(updatedAt) : "—"}
                </Text>
              </View>
              <AnimatedPressable onPress={refresh} style={[styles.refreshBtn, { backgroundColor: colors.accent }]}>
                <Ionicons name="refresh" size={16} color="#fff" />
                <Text style={styles.refreshBtnText}>Обновить</Text>
              </AnimatedPressable>
            </View>
          </GlassCard>
        </View>

        <View style={styles.section}>
          <View style={[styles.mapWrap, { borderColor: colors.border }]}>
            <ZoneMapView zones={zones} tick={tick} onZonePress={() => {}} pointerEventsNone />
            <AnimatedPressable
              style={styles.mapOverlayBtn}
              onPress={() => navigation.navigate("MapTab" as never)}
            >
              <View style={[styles.mapOverlayInner, { backgroundColor: colors.cardSolid }]}>
                <Ionicons name="expand-outline" size={16} color={colors.accent} />
                <Text style={[styles.mapOverlayText, { color: colors.accent }]}>
                  Полная карта
                </Text>
              </View>
            </AnimatedPressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Последние точки</Text>
          {loading && !stations.length ? (
            <Text style={{ color: colors.textSecondary }}>Загрузка данных…</Text>
          ) : (
            recentStations.map((s) => (
              <StationCard
                key={s.id}
                station={s}
                onPress={() =>
                  navigation.navigate("StationDetail", { stationId: s.id, stationName: s.name })
                }
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerGradient: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  greeting: { fontSize: 14, fontWeight: "500" },
  title: { fontSize: 28, fontWeight: "800", marginTop: 4 },
  section: { paddingHorizontal: 20, marginTop: 20 },
  currentRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  currentLabel: { fontSize: 13, fontWeight: "500" },
  currentValue: { fontSize: 30, fontWeight: "800", marginTop: 4 },
  divider: { height: 1, marginVertical: 14 },
  footerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  row: { flexDirection: "row", alignItems: "center", flexShrink: 1 },
  updatedText: { fontSize: 12, marginLeft: 4 },
  refreshBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 9, borderRadius: 100 },
  refreshBtnText: { color: "#fff", fontWeight: "700", fontSize: 13, marginLeft: 6 },
  mapWrap: { height: 240, borderRadius: 28, overflow: "hidden", borderWidth: 1 },
  map: { flex: 1 },
  mapOverlayBtn: { position: "absolute", bottom: 12, right: 12 },
  mapOverlayInner: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 100 },
  mapOverlayText: { fontWeight: "700", fontSize: 12, marginLeft: 5 },
  sectionTitle: { fontSize: 18, fontWeight: "800", marginBottom: 12 },
});
