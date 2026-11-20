import { useEffect, useState } from "react";
import { getLoadErrorMessage } from "../utils/errors";
import { supabase } from "../utils/supabase";

export type Lesson = {
  id: number;
  title: string;
  instrument: string;
  level: string;
};

type FetchResult =
  { data: Lesson[]; error: null } | { data: null; error: string };

// The `lessons` table is protected by RLS: only the `authenticated` role can
// select from it, so this returns rows only when a user is signed in.
async function fetchLessons(): Promise<FetchResult> {
  try {
    const { data, error } = await supabase
      .from("lessons")
      .select("id, title, instrument, level")
      .order("id");
    if (error) {
      return { data: null, error: getLoadErrorMessage(error, "lessons") };
    }
    return { data: data ?? [], error: null };
  } catch (error) {
    return { data: null, error: getLoadErrorMessage(error, "lessons") };
  }
}

export function useProtectedLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    fetchLessons().then((result) => {
      if (!active) return;
      if (result.error !== null) {
        setError(result.error);
      } else {
        setLessons(result.data);
        setError(null);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  function retry() {
    setLoading(true);
    setError(null);
    setReloadKey((key) => key + 1);
  }

  return { lessons, error, loading, retry };
}
