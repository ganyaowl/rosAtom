import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Station } from "@/types";
import { useAppTheme } from "@/theme/ThemeContext";
import { AnimatedPressable } from "./AnimatedPressable";
import { RadiationBadge } from "./RadiationBadge";
import { formatLevel } from "@/utils/radiation";
import { timeAgo } from "@/utils/date";

interface Props {
  station: Station;
  onPress: () => void;
}

export const StationCard: React.FC<Props> = ({ station, onPress }) => {
  const { colors } = useAppTheme();

  return (
    <AnimatedPressable onPress={onPress}>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.cardSolid, borderColor: colors.border },
        ]}
      >
        <View style={styles.left}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {station.name}
          </Text>
          <Text style={[styles.region, { color: colors.textSecondary }]} numberOfLines={1}>
            {station.region}
          </Text>
          <View style={styles.row}>
            <Ionicons name="time-outline" size={13} color={colors.textTertiary} />
            <Text style={[styles.timeText, { color: colors.textTertiary }]}>
              {timeAgo(station.lastUpdated)}
            </Text>
          </View>
        </View>
        <View style={styles.right}>
          <Text style={[styles.level, { color: colors.text }]}>
            {formatLevel(station.level, station.unit)}
          </Text>
          <RadiationBadge status={station.status} size="small" />
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 12,
  },
  left: { flex: 1, marginRight: 12 },
  name: { fontSize: 16, fontWeight: "700" },
  region: { fontSize: 13, marginTop: 2 },
  row: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  timeText: { fontSize: 12, marginLeft: 4 },
  right: { alignItems: "flex-end" },
  level: { fontSize: 15, fontWeight: "700", marginBottom: 6 },
});
