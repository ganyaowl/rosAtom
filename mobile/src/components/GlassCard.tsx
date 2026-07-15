import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { useAppTheme } from "@/theme/ThemeContext";

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  radius?: number;
  intensity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  radius = 24,
  intensity = 40,
}) => {
  const { colors, themeMode } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius: radius,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
        style,
      ]}
    >
      <BlurView
        intensity={intensity}
        tint={themeMode === "dark" ? "dark" : "light"}
        style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: colors.card, borderRadius: radius },
        ]}
      />
      <View style={{ padding: 18 }}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 6,
  },
});
