import { StyleSheet, Text } from "react-native";
import type { Theme } from "../constants/theme";
import { useThemedStyles } from "../hooks/use-theme";

type BadgeProps = {
  label: string;
  /** public = green, private = indigo */
  tone: "public" | "private";
};

/** Small pill label: PUBLIC or MEMBERS ONLY. */
export default function Badge({ label, tone }: BadgeProps) {
  const styles = useThemedStyles(createStyles);
  return <Text style={[styles.badge, styles[tone]]}>{label}</Text>;
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    badge: {
      overflow: "hidden",
      borderRadius: t.radius.pill,
      paddingHorizontal: t.spacing.sm,
      paddingVertical: 2,
      fontSize: t.fontSize.small,
      fontWeight: "700",
    },
    public: { backgroundColor: t.colors.successBg, color: t.colors.successText },
    private: { backgroundColor: t.colors.primarySoft, color: t.colors.primary },
  });
