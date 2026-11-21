import { Link } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import type { Theme } from "../constants/theme";
import { useAuth } from "../context/AuthProvider";
import { useThemedStyles } from "../hooks/use-theme";
import Avatar from "./Avatar";

/** Signed-in user's initial + name in the navigation bar. Opens Profile. */
export default function HeaderUser() {
  const { displayName } = useAuth();
  const styles = useThemedStyles(createStyles);
  if (!displayName) return null;

  return (
    <Link href="/profile" asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Signed in as ${displayName}. Open profile`}
        hitSlop={8}
        style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
      >
        <Avatar name={displayName} size={26} />
        <Text style={styles.name} numberOfLines={1}>
          {displayName}
        </Text>
      </Pressable>
    </Link>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    chip: {
      flexDirection: "row",
      alignItems: "center",
      gap: t.spacing.sm,
      paddingLeft: 3,
      paddingRight: t.spacing.md,
      paddingVertical: 3,
      borderRadius: t.radius.pill,
      backgroundColor: t.colors.surfaceMuted,
    },
    pressed: { opacity: 0.7 },
    name: {
      maxWidth: 140,
      fontSize: t.fontSize.label,
      fontWeight: "600",
      color: t.colors.text,
    },
  });
