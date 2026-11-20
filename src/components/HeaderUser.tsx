import { Link } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { useAuth } from "../context/AuthProvider";

export default function HeaderUser() {
  const { displayName } = useAuth();
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

const styles = StyleSheet.create({
  text: { maxWidth: 180, fontSize: 14, fontWeight: "600", color: "#1565c0" },
});
