import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import type { Theme } from "../constants/theme";
import { useProtectedLessons } from "../hooks/use-protected-lessons";
import { useTheme, useThemedStyles } from "../hooks/use-theme";
import { instrumentEmoji } from "../utils/instruments";
import Badge from "./Badge";
import Card from "./Card";
import FeedbackMessage from "./FeedbackMessage";
import SubmitButton from "./SubmitButton";

export default function ProtectedLessons() {
  const theme = useTheme();
  const styles = useThemedStyles(createStyles);
  const { lessons, error, loading, retry } = useProtectedLessons();

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.heading} accessibilityRole="header">
          Your lessons
        </Text>
        <Badge label="MEMBERS ONLY" tone="private" />
      </View>
      <Text style={styles.description}>
        Protected by Row Level Security. Only signed-in users can load these.
      </Text>

      <Card style={styles.card}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={theme.colors.primary} />
            <Text style={styles.muted}>Loading lessons...</Text>
          </View>
        ) : error ? (
          <View style={styles.state}>
            <FeedbackMessage type="error" message={error} />
            <SubmitButton title="Try again" variant="secondary" onPress={retry} />
          </View>
        ) : lessons.length === 0 ? (
          <Text style={[styles.muted, styles.state]}>
            No lessons available yet.
          </Text>
        ) : (
          <View accessibilityRole="list">
            {lessons.map((lesson, index) => (
              <View
                key={lesson.id}
                style={[styles.row, index > 0 && styles.divider]}
                accessible
                accessibilityLabel={`${lesson.title}. ${lesson.instrument}, ${lesson.level}`}
              >
                <View style={styles.emojiWrap}>
                  <Text style={styles.emoji}>
                    {instrumentEmoji(lesson.instrument)}
                  </Text>
                </View>
                <View style={styles.body}>
                  <Text style={styles.title}>{lesson.title}</Text>
                  <View style={styles.meta}>
                    <Text style={styles.muted}>{lesson.instrument}</Text>
                    <Badge label={lesson.level} />
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </Card>
    </View>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    section: { gap: t.spacing.sm },
    headerRow: { flexDirection: "row", alignItems: "center", gap: t.spacing.sm },
    heading: {
      fontSize: t.fontSize.heading,
      fontWeight: "700",
      color: t.colors.text,
    },
    description: { fontSize: t.fontSize.label, color: t.colors.textMuted },
    card: { paddingVertical: t.spacing.xs, gap: 0 },
    center: { alignItems: "center", gap: t.spacing.sm, paddingVertical: t.spacing.xl },
    state: { gap: t.spacing.md, paddingVertical: t.spacing.md },
    muted: { color: t.colors.textMuted, fontSize: t.fontSize.label },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: t.spacing.md,
      paddingVertical: t.spacing.md,
    },
    divider: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: t.colors.border,
    },
    emojiWrap: {
      width: 44,
      height: 44,
      borderRadius: t.radius.md,
      backgroundColor: t.colors.surfaceMuted,
      alignItems: "center",
      justifyContent: "center",
    },
    emoji: { fontSize: 22 },
    body: { flex: 1, gap: t.spacing.xs },
    title: { fontSize: t.fontSize.body, fontWeight: "600", color: t.colors.text },
    meta: { flexDirection: "row", alignItems: "center", gap: t.spacing.sm },
  });
