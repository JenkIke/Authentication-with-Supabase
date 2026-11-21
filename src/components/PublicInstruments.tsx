import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import type { Theme } from "../constants/theme";
import { usePublicInstruments } from "../hooks/use-public-instruments";
import { useTheme, useThemedStyles } from "../hooks/use-theme";
import { instrumentEmoji } from "../utils/instruments";
import Badge from "./Badge";
import Card from "./Card";
import FeedbackMessage from "./FeedbackMessage";
import SubmitButton from "./SubmitButton";

export default function PublicInstruments() {
  const theme = useTheme();
  const styles = useThemedStyles(createStyles);
  const { instruments, error, loading, retry } = usePublicInstruments();

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.heading} accessibilityRole="header">
          Instruments
        </Text>
        <Badge label="PUBLIC" tone="public" />
      </View>
      <Text style={styles.description}>
        Anyone can see this list, no account needed.
      </Text>

      <Card style={styles.card}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={theme.colors.primary} />
            <Text style={styles.muted}>Loading instruments...</Text>
          </View>
        ) : error ? (
          <View style={styles.state}>
            <FeedbackMessage type="error" message={error} />
            <SubmitButton title="Try again" variant="secondary" onPress={retry} />
          </View>
        ) : instruments.length === 0 ? (
          <Text style={[styles.muted, styles.state]}>No instruments yet.</Text>
        ) : (
          <View accessibilityRole="list">
            {instruments.map((item, index) => (
              <View
                key={item.id}
                style={[styles.row, index > 0 && styles.divider]}
              >
                <Text style={styles.emoji} accessible={false}>
                  {instrumentEmoji(item.name)}
                </Text>
                <Text style={styles.name}>{item.name}</Text>
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
    emoji: { fontSize: 22 },
    name: { fontSize: t.fontSize.body, color: t.colors.text },
  });
