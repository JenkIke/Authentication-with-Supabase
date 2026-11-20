import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import PublicInstruments from "../components/PublicInstruments";
import { useAuth } from "../context/AuthProvider";

export default function Home() {
  const { session, displayName } = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Home Page</Text>

      {session ? (
        <View style={styles.nav}>
          <Text style={styles.welcome}>Welcome back, {displayName}!</Text>
          <Link href="/profile" style={styles.link}>
            View your profile
          </Link>
        </View>
      ) : (
        <View style={styles.nav}>
          <Link href="/sign-in" style={styles.link}>
            Sign in
          </Link>
          <Link href="/sign-up" style={styles.link}>
            Sign up
          </Link>
        </View>
      )}

      <PublicInstruments />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 24 },
  title: { fontSize: 28, fontWeight: "bold" },
  nav: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  welcome: { fontSize: 16, width: "100%" },
  link: { fontSize: 16, color: "#1565c0", textDecorationLine: "underline" },
});
