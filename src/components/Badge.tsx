import { StyleSheet, Text } from "react-native";
import type { Theme } from "../constants/theme";
import { useThemedStyles } from "../hooks/use-theme";

type BadgeProps = {
  label: string;
  /** public = green, private = indigo, neutral = grey */
  tone?: "public" | "private" | "neutral";
};

/** Small pill label, e.g. PUBLIC / MEMBERS ONLY / Beginner. */
export default function Badge({ label, tone = "neutral" }: BadgeProps) {
  const styles = useThemedStyles(createStyles);
  return <Text style={[styles.badge, styles[tone]]}>{label}</Text>;
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    badge: {
      alignSelf: "flex-start",
      overflow: "hidden",
      borderRadius: t.radius.pill,
      paddingHorizontal: t.spacing.sm,
      paddingVertical: 2,
      fontSize: t.fontSize.small,
      fontWeight: "700",
      letterSpacing: 0.3,
    },
    public: { backgroundColor: t.colors.successBg, color: t.colors.successText },
    private: { backgroundColor: t.colors.primarySoft, color: t.colors.primary },
    neutral: { backgroundColor: t.colors.surfaceMuted, color: t.colors.textMuted },
  });
