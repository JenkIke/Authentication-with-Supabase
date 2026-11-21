import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import PageHeader from "../components/PageHeader";
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
      {session ? (
        <View style={styles.block}>
          <PageHeader
            title={`Welcome back, ${displayName}`}
            subtitle="Your members-only lessons are on your profile."
          />
          <SubmitButton
            title="Go to my profile"
            onPress={() => router.push("/profile")}
          />
        </View>
      ) : (
        <View style={styles.block}>
          <PageHeader
            title="Welcome"
            subtitle="Sign in or create an account to see members-only lessons."
          />
          <SubmitButton
            title="Sign in"
            onPress={() => router.push("/sign-in")}
          />
          <SubmitButton
            title="Create account"
            variant="secondary"
            onPress={() => router.push("/sign-up")}
          />
        </View>
      )}

      <PublicInstruments />
    </Screen>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    block: { gap: t.spacing.md },
  });
