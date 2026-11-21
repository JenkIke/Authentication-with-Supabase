import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Card from "../components/Card";
import FeedbackMessage from "../components/FeedbackMessage";
import ProtectedLessons from "../components/ProtectedLessons";
import Screen from "../components/Screen";
import SignOut from "../components/SignOut";
import SubmitButton from "../components/SubmitButton";
import type { Theme } from "../constants/theme";
import { useAuth } from "../context/AuthProvider";
import { useTheme, useThemedStyles } from "../hooks/use-theme";
import { getLoadErrorMessage } from "../utils/errors";
import { supabase } from "../utils/supabase";

type ProfileData = {
  display_name: string | null;
  favourite_instrument: string | null;
};

type ProfileResult =
  { data: ProfileData | null; error: null } | { data: null; error: string };

async function fetchProfile(userId: string): Promise<ProfileResult> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("display_name, favourite_instrument")
      .eq("id", userId)
      .maybeSingle();
    if (error) {
      return { data: null, error: getLoadErrorMessage(error, "your profile") };
    }
    return { data, error: null };
  } catch (error) {
    return { data: null, error: getLoadErrorMessage(error, "your profile") };
  }
}

export default function Profile() {
  const { user, displayName } = useAuth();
  const theme = useTheme();
  const styles = useThemedStyles(createStyles);
  const userId = user?.id;
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    fetchProfile(userId).then((result) => {
      if (!active) return;
      if (result.error !== null) {
        setError(result.error);
      } else {
        setProfile(result.data);
        setError(null);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [userId, reloadKey]);

  function retry() {
    setLoading(true);
    setError(null);
    setReloadKey((key) => key + 1);
  }

  if (loading) {
    return (
      <Screen centered>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.label}>Loading your profile...</Text>
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen centered>
        <FeedbackMessage type="error" message={error} />
        <SubmitButton title="Try again" onPress={retry} />
        <SignOut />
      </Screen>
    );
  }

  const fields = [
    { label: "Display name", value: profile?.display_name ?? displayName },
    { label: "Email", value: user?.email },
    {
      label: "Favourite instrument",
      value: profile?.favourite_instrument ?? "None yet",
    },
  ];

  return (
    <Screen>
      <Card>
        {fields.map((field) => (
          <View key={field.label} style={styles.field}>
            <Text style={styles.label}>{field.label}</Text>
            <Text style={styles.value}>{field.value}</Text>
          </View>
        ))}
      </Card>

      <ProtectedLessons />

      <SignOut />
    </Screen>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    center: { alignItems: "center", gap: t.spacing.md },
    field: { gap: 2 },
    label: { fontSize: t.fontSize.label, color: t.colors.textMuted },
    value: { fontSize: t.fontSize.body, color: t.colors.text },
  });
