import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../utils/supabase";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  displayName: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (details: SignUpDetails) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
};

type SignUpDetails = { email: string; password: string; username: string };
type SignUpResult = "signed-in" | "confirm-email" | "already-registered";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getDisplayName(user: User | null) {
  if (!user) return null;
  const username = user.user_metadata?.username;
  if (typeof username === "string" && username.length > 0) return username;
  return user.email ?? "Account";
}

async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

async function signUp({
  email,
  password,
  username,
}: SignUpDetails): Promise<SignUpResult> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });
  if (error) throw error;
  if (data.user?.identities?.length === 0) return "already-registered";
  return data.session ? "signed-in" : "confirm-email";
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setSession(session))
      .catch(() => setSession(null))
      .finally(() => setLoading(false));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const user = session?.user ?? null;
    return {
      session,
      user,
      displayName: getDisplayName(user),
      loading,
      signIn,
      signUp,
      signOut,
    };
  }, [session, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
