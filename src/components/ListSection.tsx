import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import type { Theme } from "../constants/theme";
import { useTheme, useThemedStyles } from "../hooks/use-theme";
import Badge from "./Badge";
import Card from "./Card";
import FeedbackMessage from "./FeedbackMessage";
import SubmitButton from "./SubmitButton";

export type ListItem = { id: number; title: string; subtitle?: string };

type ListSectionProps = {
  title: string;
  badge: string;
  badgeTone: "public" | "private";
  items: ListItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  loadingText: string;
  emptyText: string;
};

/** Heading + badge + a card holding the list, with loading/error/empty states. */
export default function ListSection({
  title,
  badge,
  badgeTone,
  items,
  loading,
  error,
  onRetry,
  loadingText,
  emptyText,
}: ListSectionProps) {
  const theme = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.heading} accessibilityRole="header">
          {title}
        </Text>
        <Badge label={badge} tone={badgeTone} />
      </View>

      <Card style={styles.card}>
        {loading ? (
          <View style={styles.state}>
            <ActivityIndicator color={theme.colors.primary} />
            <Text style={styles.muted}>{loadingText}</Text>
          </View>
        ) : error ? (
          <View style={styles.state}>
            <FeedbackMessage type="error" message={error} />
            <SubmitButton title="Try again" variant="secondary" onPress={onRetry} />
          </View>
        ) : items.length === 0 ? (
          <Text style={[styles.muted, styles.state]}>{emptyText}</Text>
        ) : (
          <View accessibilityRole="list">
            {items.map((item, index) => (
              <View
                key={item.id}
                style={[styles.row, index > 0 && styles.divider]}
              >
                <Text style={styles.title}>{item.title}</Text>
                {item.subtitle ? (
                  <Text style={styles.muted}>{item.subtitle}</Text>
                ) : null}
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
    card: { paddingVertical: t.spacing.xs, gap: 0 },
    state: { gap: t.spacing.md, paddingVertical: t.spacing.md },
    muted: { fontSize: t.fontSize.label, color: t.colors.textMuted },
    row: { paddingVertical: t.spacing.md, gap: 2 },
    divider: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: t.colors.border,
    },
    title: { fontSize: t.fontSize.body, color: t.colors.text },
  });
