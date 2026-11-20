import {
  isAuthApiError,
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
};

function isNetworkError(error: unknown) {
  return (
    error instanceof Error && /network|fetch|timed? ?out/i.test(error.message)
  );
}

export function getAuthErrorMessage(error: unknown): string {
  if (isAuthRetryableFetchError(error) || isNetworkError(error)) {
    return NETWORK_MESSAGE;
  }
  if (isAuthWeakPasswordError(error)) {
    return AUTH_MESSAGES.weak_password;
  }
  if (isAuthApiError(error) && error.code && AUTH_MESSAGES[error.code]) {
    return AUTH_MESSAGES[error.code];
  }
  return FALLBACK_MESSAGE;
}

export function getLoadErrorMessage(error: unknown, what: string): string {
  if (isNetworkError(error)) return NETWORK_MESSAGE;
  return `We couldn't load ${what}. Please try again.`;
}
