import { useEffect, useState } from "react";
import { getLoadErrorMessage } from "../utils/errors";
import { supabase } from "../utils/supabase";

export type Instrument = {
  id: number;
  name: string;
};

type FetchResult =
  { data: Instrument[]; error: null } | { data: null; error: string };

async function fetchInstruments(): Promise<FetchResult> {
  try {
    const { data, error } = await supabase
      .from("instruments")
      .select("id, name")
      .order("name");
    if (error) {
      return { data: null, error: getLoadErrorMessage(error, "instruments") };
    }
    return { data: data ?? [], error: null };
  } catch (error) {
    return { data: null, error: getLoadErrorMessage(error, "instruments") };
  }
}

export function usePublicInstruments() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    fetchInstruments().then((result) => {
      if (!active) return;
      if (result.error !== null) {
        setError(result.error);
      } else {
        setInstruments(result.data);
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

  return { instruments, error, loading, retry };
}
