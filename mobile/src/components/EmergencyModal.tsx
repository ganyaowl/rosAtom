import React, { useEffect, useRef } from "react";
import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";

import { Zone } from "@/types";
import { EMERGENCY_INSTRUCTIONS } from "@/data/instructions";
import { AnimatedPressable } from "@/components/AnimatedPressable";

// Bundled locally (mobile/assets/alarm.mp3) — remote-streamed audio sources
// are unreliable across expo-audio versions, so we ship the siren as a
// local asset instead.
const ALARM_SOURCE = require("../../assets/alarm.mp3");

interface Props {
  zone: Zone | null;
  onDismiss: () => void;
}

export const EmergencyModal: React.FC<Props> = ({ zone, onDismiss }) => {
  const player = useAudioPlayer(ALARM_SOURCE);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (zone) {
      try {
        player.loop = true;
        player.play();
        hasStartedRef.current = true;
      } catch (e) {
        // expo-audio can throw if the source hasn't finished loading yet —
        // safe to ignore, the siren just won't play that one time.
      }
    } else if (hasStartedRef.current) {
      // Only try to stop playback if we actually started it before —
      // calling pause()/seekTo() on a player that was never played
      // (e.g. on initial app mount) is what throws "Calling the 'pause'
      // function has failed".
      try {
        player.pause();
        player.seekTo(0);
      } catch (e) {
        // ignore
      }
    }
    return () => {
      if (hasStartedRef.current) {
        try {
          player.pause();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [zone, player]);

  return (
    <Modal
      visible={!!zone}
      transparent={false}
      animationType="slide"
      // Blocks the normal Android back-button dismissal — the user must use
      // the explicit acknowledgement button below to close this.
      onRequestClose={() => {}}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="warning" size={40} color="#fff" />
          <Text style={styles.headerTitle}>ЭКСТРЕННОЕ ОПОВЕЩЕНИЕ</Text>
          {zone && (
            <Text style={styles.headerSubtitle}>
              Зона «{zone.name}» — критический уровень радиации
            </Text>
          )}
        </View>

        <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 24 }}>
          <Text style={styles.instructionText}>{EMERGENCY_INSTRUCTIONS}</Text>
        </ScrollView>

        <AnimatedPressable style={styles.dismissBtn} onPress={onDismiss}>
          <Text style={styles.dismissBtnText}>Я ознакомился с инструкцией</Text>
        </AnimatedPressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#B00020" },
  header: { alignItems: "center", paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "800", marginTop: 10, textAlign: "center" },
  headerSubtitle: { color: "#FFE4E1", fontSize: 14, marginTop: 8, textAlign: "center" },
  body: { flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20 },
  instructionText: { fontSize: 14, lineHeight: 22, color: "#1A1A1A" },
  dismissBtn: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 30,
    marginTop: -10,
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
  },
  dismissBtnText: { color: "#B00020", fontWeight: "800", fontSize: 15 },
});
