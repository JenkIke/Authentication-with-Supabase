import { StyleSheet, Text, View } from "react-native";
import type { Theme } from "../constants/theme";
import { useThemedStyles } from "../hooks/use-theme";

type FeedbackMessageProps = {
  type: "error" | "success" | "info";
  message?: string | null;
};

const ICONS = { error: "!", success: "✓", info: "i" } as const;

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
      <View style={[styles.icon, styles[`${type}Icon`]]} accessible={false}>
        <Text style={styles.iconText}>{ICONS[type]}</Text>
      </View>
      <Text style={[styles.text, styles[`${type}Text`]]}>{message}</Text>
    </View>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    box: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: t.spacing.md,
      borderWidth: 1,
      borderRadius: t.radius.md,
      padding: t.spacing.md,
    },
    icon: {
      width: 22,
      height: 22,
      borderRadius: 11,
      alignItems: "center",
      justifyContent: "center",
    },
    iconText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
    text: { flex: 1, fontSize: t.fontSize.label, lineHeight: 20 },

    error: { backgroundColor: t.colors.errorBg, borderColor: t.colors.errorBorder },
    errorIcon: { backgroundColor: t.colors.danger },
    errorText: { color: t.colors.errorText },

    success: {
      backgroundColor: t.colors.successBg,
      borderColor: t.colors.successBorder,
    },
    successIcon: { backgroundColor: "#2E7D32" },
    successText: { color: t.colors.successText },

    info: { backgroundColor: t.colors.infoBg, borderColor: t.colors.infoBorder },
    infoIcon: { backgroundColor: "#4F46E5" },
    infoText: { color: t.colors.infoText },
  });
