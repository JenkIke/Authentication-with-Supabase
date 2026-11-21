import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
  type ErrorBoundaryProps,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import FeedbackMessage from "../components/FeedbackMessage";
import HeaderUser from "../components/HeaderUser";
import SubmitButton from "../components/SubmitButton";
import type { Theme } from "../constants/theme";
import { AuthProvider, useAuth } from "../context/AuthProvider";
import { useTheme, useThemedStyles } from "../hooks/use-theme";

function RootNavigator() {
  const { session, loading } = useAuth();
  const theme = useTheme();
  const styles = useThemedStyles(createStyles);

  // Shown while the saved Supabase session is being restored on launch
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.muted}>Restoring your session...</Text>
      </View>
    );
  }

  const isSignedIn = !!session;

  return (
    <Stack
      screenOptions={{
        // Expo SDK 58 makes the iOS 26 header see-through by default, so screen
        // content slides underneath it. A solid header keeps content below it.
        headerTransparent: false,
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.primary,
        headerTitleStyle: { color: theme.colors.text },
        contentStyle: { backgroundColor: theme.colors.background },
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
  const theme = useTheme();
  const base = theme.dark ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
    },
  };

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style="auto" />
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}

/**
 * Expo Router shows this instead of the red crash screen if any screen throws
 * an unexpected error while rendering. "Try again" re-renders the app.
 */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.center}>
      <Text style={styles.title} accessibilityRole="header">
        Something went wrong
      </Text>
      <Text style={styles.muted}>
        The app hit an unexpected problem. Your account and data are safe.
      </Text>
      <View style={styles.actions}>
        {__DEV__ && <FeedbackMessage type="error" message={error.message} />}
        <SubmitButton title="Try again" onPress={retry} />
      </View>
    </View>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: t.spacing.md,
      padding: t.spacing.xl,
      backgroundColor: t.colors.background,
    },
    title: {
      fontSize: t.fontSize.heading,
      fontWeight: "700",
      color: t.colors.text,
    },
    muted: {
      fontSize: t.fontSize.body,
      color: t.colors.textMuted,
      textAlign: "center",
    },
    actions: { width: "100%", maxWidth: 480, gap: t.spacing.md },
  });
