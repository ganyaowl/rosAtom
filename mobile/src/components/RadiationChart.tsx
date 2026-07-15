import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useAppTheme } from "@/theme/ThemeContext";

interface Props {
  labels: string[];
  values: number[];
  title?: string;
  unit?: string;
}

const screenWidth = Dimensions.get("window").width;

export const RadiationChart: React.FC<Props> = ({ labels, values, title, unit = "мкЗв/ч" }) => {
  const { colors, themeMode } = useAppTheme();

  const chartConfig = {
    backgroundGradientFrom: colors.cardSolid,
    backgroundGradientTo: colors.cardSolid,
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(10,132,255,${opacity})`,
    labelColor: () => colors.textSecondary,
    propsForBackgroundLines: {
      stroke: colors.border,
      strokeDasharray: "4",
    },
    propsForDots: {
      r: "3",
      strokeWidth: "1",
      stroke: colors.accent,
    },
  };

  return (
    <View>
      {title ? (
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      ) : null}
      <LineChart
        data={{
          labels,
          datasets: [{ data: values.length ? values : [0] }],
        }}
        width={screenWidth - 64}
        height={200}
        yAxisSuffix={` ${unit}`}
        chartConfig={chartConfig}
        bezier
        withInnerLines
        withOuterLines={false}
        style={{ borderRadius: 16, marginLeft: -16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
});
