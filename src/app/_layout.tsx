import { Stack } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import HeaderUser from "../components/HeaderUser";
import { AuthProvider, useAuth } from "../context/AuthProvider";

function RootNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const isSignedIn = !!session;

  return (
    <Stack
      screenOptions={{
        headerRight: isSignedIn ? () => <HeaderUser /> : undefined,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Home" }} />

      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="profile" options={{ title: "Profile" }} />
      </Stack.Protected>

      <Stack.Protected guard={!isSignedIn} redirectTo="/profile">
        <Stack.Screen name="sign-in" options={{ title: "Sign in" }} />
        <Stack.Screen name="sign-up" options={{ title: "Sign up" }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  loadingText: { color: "#666" },
});
