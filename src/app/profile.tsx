import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import FeedbackMessage from "../components/FeedbackMessage";
import ProtectedLessons from "../components/ProtectedLessons";
import SignOut from "../components/SignOut";
import SubmitButton from "../components/SubmitButton";
import { useAuth } from "../context/AuthProvider";
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
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.muted}>Loading your profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <FeedbackMessage type="error" message={error} />
        <SubmitButton title="Try again" onPress={retry} />
        <SignOut />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.card}>
        <Text style={styles.badge}>PRIVATE</Text>
        <Text style={styles.label}>Display name</Text>
        <Text style={styles.value}>{profile?.display_name ?? displayName}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>
        <Text style={styles.label}>Favourite instrument</Text>
        <Text style={styles.value}>
          {profile?.favourite_instrument ?? "None yet"}
        </Text>
      </View>
      <ProtectedLessons />
      <SignOut />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12 },
  scroll: { padding: 24, gap: 12 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  muted: { color: "#666" },
  card: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    padding: 16,
    gap: 4,
  },
  badge: {
    alignSelf: "flex-start",
    fontSize: 12,
    fontWeight: "bold",
    color: "crimson",
  },
  label: { fontSize: 12, color: "#666", marginTop: 8 },
  value: { fontSize: 18 },
});
