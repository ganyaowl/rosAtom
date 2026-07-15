import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useAppTheme } from "@/theme/ThemeContext";

interface Props {
  labels: string[];
  values: number[];
  title?: string;
  unit?: string;
}

const screenWidth = Dimensions.get("window").width;

export const WeeklyBarChart: React.FC<Props> = ({ labels, values, title, unit = "мкЗв/ч" }) => {
  const { colors } = useAppTheme();

  const chartConfig = {
    backgroundGradientFrom: colors.cardSolid,
    backgroundGradientTo: colors.cardSolid,
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(48,209,88,${opacity})`,
    labelColor: () => colors.textSecondary,
    barPercentage: 0.55,
    propsForBackgroundLines: {
      stroke: colors.border,
      strokeDasharray: "4",
    },
  };

  return (
    <View>
      {title ? (
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      ) : null}
      <BarChart
        data={{ labels, datasets: [{ data: values.length ? values : [0] }] }}
        width={screenWidth - 64}
        height={200}
        yAxisLabel=""
        yAxisSuffix={` ${unit}`}
        chartConfig={chartConfig}
        fromZero
        showValuesOnTopOfBars
        style={{ borderRadius: 16, marginLeft: -16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
});
