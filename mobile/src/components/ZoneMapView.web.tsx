import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Zone } from "@/types";
import { useAppTheme } from "@/theme/ThemeContext";
import { getStatusColor, getStatusLabel, formatLevel } from "@/utils/radiation";
import { AnimatedPressable } from "@/components/AnimatedPressable";

interface Props {
  zones: Zone[];
  tick: number; // unused on web, kept for API parity with the native version
  onZonePress: (zone: Zone) => void;
  pointerEventsNone?: boolean;
}

// react-native-maps has no web implementation, so on web we render a
// styled overview grid of the same 5 zones instead of a real map. Metro
// automatically picks THIS file over ZoneMapView.tsx when bundling for web
// (the .web.tsx extension takes priority), so no extra config is needed.
export const ZoneMapView: React.FC<Props> = ({ zones, onZonePress, pointerEventsNone }) => {
  const { colors } = useAppTheme();

  if (pointerEventsNone) {
    // Compact preview used on the Home screen mini-map slot.
    return (
      <View style={[styles.previewGrid, { backgroundColor: colors.backgroundSecondary }]}>
        {zones.map((zone) => (
          <View key={zone.id} style={[styles.previewCell, { backgroundColor: `${getStatusColor(zone.status)}33` }]}>
            <View style={[styles.dot, { backgroundColor: getStatusColor(zone.status) }]} />
            <Text style={[styles.previewText, { color: colors.text }]} numberOfLines={1}>
              {zone.name}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.notice, { backgroundColor: colors.accentSoft }]}>
        <Ionicons name="information-circle-outline" size={16} color={colors.accent} />
        <Text style={[styles.noticeText, { color: colors.accent }]}>
          Интерактивная гео-карта доступна в мобильном приложении (iOS/Android). В браузере — обзор зон.
        </Text>
      </View>

      <View style={styles.grid}>
        {zones.map((zone) => (
          <AnimatedPressable
            key={zone.id}
            style={[
              styles.card,
              { backgroundColor: colors.cardSolid, borderColor: `${getStatusColor(zone.status)}55` },
            ]}
            onPress={() => onZonePress(zone)}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.dot, { backgroundColor: getStatusColor(zone.status) }]} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>{zone.name}</Text>
            </View>
            <Text style={[styles.cardLevel, { color: colors.text }]}>{formatLevel(zone.level)}</Text>
            <Text style={[styles.cardStatus, { color: getStatusColor(zone.status) }]}>
              {getStatusLabel(zone.status)}
            </Text>
          </AnimatedPressable>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  notice: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    marginBottom: 16,
  },
  noticeText: { fontSize: 12, marginLeft: 8, flex: 1 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: {
    width: "48%",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 14,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  cardTitle: { fontSize: 15, fontWeight: "700" },
  cardLevel: { fontSize: 18, fontWeight: "800", marginBottom: 4 },
  cardStatus: { fontSize: 12, fontWeight: "700" },
  previewGrid: { flex: 1, flexDirection: "row", flexWrap: "wrap", padding: 8, borderRadius: 20 },
  previewCell: {
    width: "31%",
    margin: "1%",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  previewText: { fontSize: 10, fontWeight: "700", marginTop: 4 },
});
