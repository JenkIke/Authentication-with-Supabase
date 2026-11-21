import { StyleSheet, Text, View } from "react-native";
import type { Theme } from "../constants/theme";
import { useThemedStyles } from "../hooks/use-theme";

type AvatarProps = { name: string | null; size?: number };

/** Circle showing the first letter of the user's name or email. */
export default function Avatar({ name, size = 32 }: AvatarProps) {
  const styles = useThemedStyles(createStyles);
  const initial = name?.trim().charAt(0).toUpperCase() || "?";

  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
      accessible={false}
    >
      <Text style={[styles.initial, { fontSize: size * 0.45 }]}>{initial}</Text>
    </View>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    circle: {
      backgroundColor: t.colors.primarySoft,
      alignItems: "center",
      justifyContent: "center",
    },
    initial: { color: t.colors.primary, fontWeight: "700" },
  });
