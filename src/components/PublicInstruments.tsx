import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { usePublicInstruments } from "../hooks/use-public-instruments";
import FeedbackMessage from "./FeedbackMessage";
import SubmitButton from "./SubmitButton";

export default function PublicInstruments() {
  const { instruments, error, loading, retry } = usePublicInstruments();

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Instruments</Text>
        <Text style={styles.badge}>PUBLIC</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.muted}>Loading instruments...</Text>
        </View>
      ) : error ? (
        <View style={styles.gap}>
          <FeedbackMessage type="error" message={error} />
          <SubmitButton title="Try again" onPress={retry} />
        </View>
      ) : instruments.length === 0 ? (
        <Text style={styles.muted}>No instruments yet.</Text>
      ) : (
        <View accessibilityRole="list">
          {instruments.map((item) => (
            <Text key={item.id} style={styles.item}>
              {item.name}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 8 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  heading: { fontSize: 20, fontWeight: "bold" },
  badge: { fontSize: 12, fontWeight: "bold", color: "#2e7d32" },
  center: { alignItems: "center", gap: 8, paddingVertical: 16 },
  muted: { color: "#666" },
  gap: { gap: 12 },
  item: {
    fontSize: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
});
