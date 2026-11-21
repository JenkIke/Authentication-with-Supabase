import {
  isAuthApiError,
  isAuthError,
  isAuthRetryableFetchError,
  isAuthWeakPasswordError,
} from "@supabase/supabase-js";

const NETWORK_MESSAGE =
  "Can't reach the server. Check your internet connection and try again.";
const FALLBACK_MESSAGE = "Something went wrong. Please try again.";

const AUTH_MESSAGES: Record<string, string> = {
  invalid_credentials: "Incorrect email or password.",
  email_not_confirmed:
    "Please confirm your email address first. Check your inbox for the link.",
  user_already_exists:
    "An account with this email already exists. Try signing in instead.",
  email_exists:
    "An account with this email already exists. Try signing in instead.",
  email_address_invalid: "That email address isn't valid.",
  weak_password:
    "That password is too weak. Use a longer mix of letters, numbers and symbols.",
  over_email_send_rate_limit:
    "Too many emails have been sent. Please wait a few minutes and try again.",
  over_request_rate_limit:
    "Too many attempts. Please wait a moment and try again.",
  signup_disabled: "New sign-ups are currently disabled.",
  email_provider_disabled: "Signing in with email is currently disabled.",
  user_banned: "This account has been suspended.",
  session_expired: "Your session has expired. Please sign in again.",
  session_not_found: "Your session has expired. Please sign in again.",
  refresh_token_not_found: "Your session has expired. Please sign in again.",
  validation_failed: "Please check your details and try again.",
};

// Supabase tells us *why* a password was rejected; turn that into plain English
const WEAK_PASSWORD_REASONS: Record<string, string> = {
  length: "it's too short",
  characters: "it needs a mix of letters, numbers and symbols",
  pwned: "it has appeared in a known data breach, so choose a different one",
};

function isNetworkError(error: unknown) {
  return (
    error instanceof Error && /network|fetch|timed? ?out/i.test(error.message)
  );
}

function weakPasswordMessage(reasons: readonly string[]): string {
  const explained = reasons
    .map((reason) => WEAK_PASSWORD_REASONS[reason])
    .filter(Boolean);
  if (explained.length === 0) return AUTH_MESSAGES.weak_password;
  return `That password is too weak: ${explained.join("; ")}.`;
}

/** Turn a Supabase Auth error into a message a user can act on. */
export function getAuthErrorMessage(error: unknown): string {
  if (isAuthRetryableFetchError(error) || isNetworkError(error)) {
    return NETWORK_MESSAGE;
  }
  if (isAuthWeakPasswordError(error)) {
    return weakPasswordMessage(error.reasons ?? []);
  }
  if (isAuthApiError(error) && error.code && AUTH_MESSAGES[error.code]) {
    return AUTH_MESSAGES[error.code];
  }
  // Unknown Supabase error: show its own message so it's still informative
  if (isAuthError(error) && error.message) {
    return `${error.message.replace(/\.$/, "")}. Please try again.`;
  }
  return FALLBACK_MESSAGE;
}

/** Message for a failed data load (profiles, instruments, lessons). */
export function getLoadErrorMessage(error: unknown, what: string): string {
  if (isNetworkError(error)) return NETWORK_MESSAGE;

  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : undefined;

  // 42501 = Postgres "permission denied" (blocked by RLS / missing grant)
  if (code === "42501") {
    return `You don't have permission to view ${what}. Try signing out and back in.`;
  }
  // PGRST205 = the table doesn't exist yet (setup.sql hasn't been run)
  if (code === "PGRST205") {
    return `We couldn't find ${what} on the server. The database may not be set up yet.`;
  }
  return `We couldn't load ${what}. Please try again.`;
}
