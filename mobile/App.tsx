import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemeProvider, useAppTheme } from "@/theme/ThemeContext";
import { ZonesProvider } from "@/context/ZonesContext";
import RootNavigator from "@/navigation/RootNavigator";

function AppInner() {
  const { themeMode } = useAppTheme();
  return (
    <>
      <StatusBar style={themeMode === "dark" ? "light" : "dark"} />
      <RootNavigator />
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ZonesProvider>
            <AppInner />
          </ZonesProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
