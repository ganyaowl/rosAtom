import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/theme/ThemeContext";

interface Props {
  label: string;
  value: string;
  color?: string;
  icon?: React.ReactNode;
}

export const StatPill: React.FC<Props> = ({ label, value, color, icon }) => {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.pill, { backgroundColor: colors.cardSolid, borderColor: colors.border }]}>
      {icon}
      <Text style={[styles.value, { color: color ?? colors.text }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  value: { fontSize: 18, fontWeight: "800", marginTop: 4 },
  label: { fontSize: 12, marginTop: 2 },
});
