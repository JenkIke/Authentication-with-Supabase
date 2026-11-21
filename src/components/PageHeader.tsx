import { StyleSheet, Text, View } from "react-native";
import type { Theme } from "../constants/theme";
import { useThemedStyles } from "../hooks/use-theme";

type PageHeaderProps = { title: string; subtitle: string };

/** Title and one-line subtitle at the top of a screen. */
export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    wrapper: { gap: t.spacing.xs },
    title: {
      fontSize: t.fontSize.title,
      fontWeight: "700",
      color: t.colors.text,
    },
    subtitle: { fontSize: t.fontSize.body, color: t.colors.textMuted },
  });
