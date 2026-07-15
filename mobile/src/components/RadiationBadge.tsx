import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RadiationStatus } from "@/types";
import { getStatusColor, getStatusEmoji, getStatusLabel } from "@/utils/radiation";

interface Props {
  status: RadiationStatus;
  size?: "small" | "medium" | "large";
}

export const RadiationBadge: React.FC<Props> = ({ status, size = "medium" }) => {
  const color = getStatusColor(status);
  const isLarge = size === "large";
  const isSmall = size === "small";

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: `${color}22`,
          paddingHorizontal: isLarge ? 16 : isSmall ? 8 : 12,
          paddingVertical: isLarge ? 8 : isSmall ? 4 : 6,
        },
      ]}
    >
      <Text style={{ fontSize: isLarge ? 16 : isSmall ? 11 : 13 }}>
        {getStatusEmoji(status)}
      </Text>
      <Text
        style={[
          styles.label,
          {
            color,
            fontSize: isLarge ? 16 : isSmall ? 11 : 13,
            marginLeft: 5,
          },
        ]}
      >
        {getStatusLabel(status)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 100,
    alignSelf: "flex-start",
  },
  label: {
    fontWeight: "600",
  },
});
