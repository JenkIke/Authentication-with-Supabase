import { StyleSheet, Text, View } from "react-native";
import type { Theme } from "../constants/theme";
import { useThemedStyles } from "../hooks/use-theme";

type FeedbackMessageProps = {
  type: "error" | "success" | "info";
  message?: string | null;
};

/** Coloured banner for form-level errors, success notices and info. */
export default function FeedbackMessage({
  type,
  message,
}: FeedbackMessageProps) {
  const styles = useThemedStyles(createStyles);
  if (!message) return null;

  return (
    <View
      style={[styles.box, styles[type]]}
      accessibilityRole={type === "error" ? "alert" : "text"}
      accessibilityLiveRegion="polite"
    >
      <Text style={[styles.text, styles[`${type}Text`]]}>{message}</Text>
    </View>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    box: { borderWidth: 1, borderRadius: t.radius.sm, padding: t.spacing.md },
    text: { fontSize: t.fontSize.label, lineHeight: 20 },
    error: { backgroundColor: t.colors.errorBg, borderColor: t.colors.errorBorder },
    errorText: { color: t.colors.errorText },
    success: {
      backgroundColor: t.colors.successBg,
      borderColor: t.colors.successBorder,
    },
    successText: { color: t.colors.successText },
    info: { backgroundColor: t.colors.infoBg, borderColor: t.colors.infoBorder },
    infoText: { color: t.colors.infoText },
  });
