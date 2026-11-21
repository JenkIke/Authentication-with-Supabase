import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import type { Theme } from "../constants/theme";
import { useThemedStyles } from "../hooks/use-theme";

type CardProps = { children: ReactNode; style?: StyleProp<ViewStyle> };

/** Rounded surface used for forms, the profile and lists. */
export default function Card({ children, style }: CardProps) {
  const styles = useThemedStyles(createStyles);
  return <View style={[styles.card, style]}>{children}</View>;
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: t.colors.surface,
      borderColor: t.colors.border,
      borderWidth: 1,
      borderRadius: t.radius.lg,
      padding: t.spacing.lg,
      gap: t.spacing.md,
    },
  });
