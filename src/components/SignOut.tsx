import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useAuth } from "../context/AuthProvider";
import { getAuthErrorMessage } from "../utils/errors";
import FeedbackMessage from "./FeedbackMessage";
import SubmitButton from "./SubmitButton";

export default function SignOut() {
  const { signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    setError(null);
    try {
      await signOut();
      // Signing out makes Expo Router *replace* Profile with a new Home screen,
      // leaving a duplicate Home (and a stray back arrow) underneath.
      // Go back to the original Home instead so only one is left.
      if (router.canDismiss()) router.dismissAll();
    } catch (error) {
      setError(getAuthErrorMessage(error));
      setLoading(false);
    }
  }

  return (
    <View style={styles.wrapper}>
      <FeedbackMessage type="error" message={error} />
      <SubmitButton
        title="Sign out"
        loadingTitle="Signing out..."
        loading={loading}
        variant="danger"
        onPress={handleSignOut}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 8, marginTop: 16 },
});
