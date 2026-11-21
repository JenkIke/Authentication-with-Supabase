import { StyleSheet, Text, View } from "react-native";
import type { Theme } from "../constants/theme";
import { useThemedStyles } from "../hooks/use-theme";

type AuthHeaderProps = { title: string; subtitle: string };

/** Logo mark, title and one-line subtitle used at the top of auth screens. */
export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.wrapper}>
      <View style={styles.logo} accessible={false}>
        <Text style={styles.logoText}>♪</Text>
      </View>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    wrapper: { alignItems: "center", gap: t.spacing.sm },
    logo: {
      width: 56,
      height: 56,
      borderRadius: t.radius.pill,
      backgroundColor: t.colors.primarySoft,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: t.spacing.xs,
    },
    logoText: { fontSize: 28, color: t.colors.primary },
    title: {
      fontSize: t.fontSize.title,
      fontWeight: "700",
      color: t.colors.text,
      textAlign: "center",
    },
    subtitle: {
      fontSize: t.fontSize.body,
      color: t.colors.textMuted,
      textAlign: "center",
      lineHeight: 22,
    },
  });
