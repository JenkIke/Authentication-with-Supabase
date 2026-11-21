import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Card from "../components/Card";
import PublicInstruments from "../components/PublicInstruments";
import Screen from "../components/Screen";
import SubmitButton from "../components/SubmitButton";
import type { Theme } from "../constants/theme";
import { useAuth } from "../context/AuthProvider";
import { useThemedStyles } from "../hooks/use-theme";

export default function Home() {
  const { session, displayName } = useAuth();
  const styles = useThemedStyles(createStyles);

  return (
    <Screen>
      <Card style={styles.hero}>
        <View style={styles.logo} accessible={false}>
          <Text style={styles.logoText}>♪</Text>
        </View>

        {session ? (
          <>
            <Text style={styles.title} accessibilityRole="header">
              Welcome back, {displayName}!
            </Text>
            <Text style={styles.subtitle}>
              Your members-only lessons are waiting on your profile.
            </Text>
            <SubmitButton
              title="Go to my profile"
              onPress={() => router.push("/profile")}
            />
          </>
        ) : (
          <>
            <Text style={styles.title} accessibilityRole="header">
              Learn an instrument
            </Text>
            <Text style={styles.subtitle}>
              Browse instruments for free. Create an account to unlock
              members-only lessons.
            </Text>
            <View style={styles.actions}>
              <SubmitButton
                title="Create account"
                onPress={() => router.push("/sign-up")}
              />
              <SubmitButton
                title="Sign in"
                variant="secondary"
                onPress={() => router.push("/sign-in")}
              />
            </View>
          </>
        )}
      </Card>

      <PublicInstruments />
    </Screen>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    hero: { padding: t.spacing.xl, gap: t.spacing.md },
    logo: {
      width: 48,
      height: 48,
      borderRadius: t.radius.pill,
      backgroundColor: t.colors.primarySoft,
      alignItems: "center",
      justifyContent: "center",
    },
    logoText: { fontSize: 24, color: t.colors.primary },
    title: {
      fontSize: t.fontSize.title,
      fontWeight: "700",
      color: t.colors.text,
    },
    subtitle: {
      fontSize: t.fontSize.body,
      color: t.colors.textMuted,
      lineHeight: 22,
    },
    actions: { gap: t.spacing.sm, marginTop: t.spacing.xs },
  });
