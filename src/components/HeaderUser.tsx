import { Link } from "expo-router";
import { StyleSheet, Text } from "react-native";
import type { Theme } from "../constants/theme";
import { useAuth } from "../context/AuthProvider";
import { useThemedStyles } from "../hooks/use-theme";

/** Signed-in user's name (or email) in the navigation bar. Opens Profile. */
export default function HeaderUser() {
  const { displayName } = useAuth();
  const styles = useThemedStyles(createStyles);
  if (!displayName) return null;

  return (
    <Link
      href="/profile"
      accessibilityLabel={`Signed in as ${displayName}. Open profile`}
    >
      <Text style={styles.text} numberOfLines={1}>
        {displayName}
      </Text>
    </Link>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    text: {
      maxWidth: 180,
      fontSize: t.fontSize.label,
      fontWeight: "600",
      color: t.colors.primary,
    },
  });
