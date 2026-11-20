import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useProtectedLessons } from "../hooks/use-protected-lessons";
import FeedbackMessage from "./FeedbackMessage";
import SubmitButton from "./SubmitButton";

export default function ProtectedLessons() {
  const { lessons, error, loading, retry } = useProtectedLessons();

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Lessons</Text>
        <Text style={styles.badge}>MEMBERS ONLY</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.muted}>Loading lessons...</Text>
        </View>
      ) : error ? (
        <View style={styles.gap}>
          <FeedbackMessage type="error" message={error} />
          <SubmitButton title="Try again" onPress={retry} />
        </View>
      ) : lessons.length === 0 ? (
        <Text style={styles.muted}>No lessons available yet.</Text>
      ) : (
        <View accessibilityRole="list">
          {lessons.map((lesson) => (
            <View key={lesson.id} style={styles.item}>
              <Text style={styles.title}>{lesson.title}</Text>
              <Text style={styles.muted}>
                {lesson.instrument} · {lesson.level}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 8, marginTop: 8 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  heading: { fontSize: 20, fontWeight: "bold" },
  badge: { fontSize: 12, fontWeight: "bold", color: "crimson" },
  center: { alignItems: "center", gap: 8, paddingVertical: 16 },
  muted: { color: "#666" },
  gap: { gap: 12 },
  item: {
    paddingVertical: 8,
    gap: 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
  title: { fontSize: 16 },
});
