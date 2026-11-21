import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import type { Theme } from "../constants/theme";
import { useTheme, useThemedStyles } from "../hooks/use-theme";

type SubmitButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  loadingTitle?: string;
  disabled?: boolean;
  /** primary = filled indigo, secondary = outlined, danger = filled red */
  variant?: "primary" | "secondary" | "danger";
};

export default function SubmitButton({
  title,
  onPress,
  loading = false,
  loadingTitle,
  disabled = false,
  variant = "primary",
}: SubmitButtonProps) {
  const theme = useTheme();
  const styles = useThemedStyles(createStyles);
  const isDisabled = disabled || loading;

  const textColor =
    variant === "secondary"
      ? theme.colors.primary
      : variant === "danger"
        ? theme.colors.onDanger
        : theme.colors.onPrimary;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={loading && loadingTitle ? loadingTitle : title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && (variant === "primary" ? styles.primaryPressed : styles.pressed),
        isDisabled && styles.disabled,
      ]}
    >
      {loading && <ActivityIndicator color={textColor} />}
      <Text style={[styles.text, { color: textColor }]}>
        {loading && loadingTitle ? loadingTitle : title}
      </Text>
    </Pressable>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    button: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: t.spacing.sm,
      minHeight: 48,
      borderRadius: t.radius.sm,
      paddingVertical: t.spacing.md,
      paddingHorizontal: t.spacing.lg,
    },
    primary: { backgroundColor: t.colors.primary },
    primaryPressed: { backgroundColor: t.colors.primaryPressed },
    secondary: {
      backgroundColor: "transparent",
      borderWidth: 1.5,
      borderColor: t.colors.primary,
    },
    danger: { backgroundColor: t.colors.danger },
    pressed: { opacity: 0.8 },
    disabled: { opacity: 0.6 },
    text: { fontSize: t.fontSize.body, fontWeight: "600" },
  });
