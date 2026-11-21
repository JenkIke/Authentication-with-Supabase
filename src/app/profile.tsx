import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Avatar from "../components/Avatar";
import Badge from "../components/Badge";
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
          <Text style={styles.muted}>Loading your profile...</Text>
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

  const name = profile?.display_name ?? displayName;

  return (
    <Screen>
      <Card>
        <View style={styles.identity}>
          <Avatar name={name} size={56} />
          <View style={styles.identityText}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.muted} numberOfLines={1}>
              {user?.email}
            </Text>
          </View>
          <Badge label="PRIVATE" tone="private" />
        </View>
        <View style={styles.divider} />
        <View style={styles.field}>
          <Text style={styles.label}>Favourite instrument</Text>
          <Text style={styles.value}>
            {profile?.favourite_instrument ?? "None yet"}
          </Text>
        </View>
      </Card>

      <ProtectedLessons />

      <SignOut />
    </Screen>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    center: { alignItems: "center", gap: t.spacing.md },
    muted: { fontSize: t.fontSize.label, color: t.colors.textMuted },
    identity: { flexDirection: "row", alignItems: "center", gap: t.spacing.md },
    identityText: { flex: 1, gap: 2 },
    name: { fontSize: t.fontSize.heading, fontWeight: "700", color: t.colors.text },
    divider: { height: StyleSheet.hairlineWidth, backgroundColor: t.colors.border },
    field: { gap: 2 },
    label: {
      fontSize: t.fontSize.small,
      fontWeight: "600",
      color: t.colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    value: { fontSize: t.fontSize.body, color: t.colors.text },
  });
