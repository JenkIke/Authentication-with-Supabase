import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AuthHeader from "../components/AuthHeader";
import AuthSwitchLink from "../components/AuthSwitchLink";
import Card from "../components/Card";
import FeedbackMessage from "../components/FeedbackMessage";
import FormInput from "../components/FormInput";
import PublicInstruments from "../components/PublicInstruments";
import Screen from "../components/Screen";
import SubmitButton from "../components/SubmitButton";
import { useAuth } from "../context/AuthProvider";
import { signUpSchema, type SignUpFormData } from "../schemas/auth";
import { getAuthErrorMessage } from "../utils/errors";

export default function SignUp() {
  const { signUp } = useAuth();
  const [notice, setNotice] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    setError,
    setFocus,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async ({ username, email, password }: SignUpFormData) => {
    setNotice(null);
    try {
      const result = await signUp({ email, password, username });

      if (result === "already-registered") {
        setError("root", {
          message:
            "An account with this email already exists. Try signing in instead.",
        });
      } else if (result === "confirm-email") {
        // Email confirmation is on: the account exists, but nobody is signed in yet
        reset();
        setNotice(
          `Account created! We sent a confirmation link to ${email}. Open it, then sign in.`,
        );
      }
      // "signed-in": the route guard in _layout.tsx redirects to /profile
    } catch (error) {
      setError("root", { message: getAuthErrorMessage(error) });
    }
  };

  const submit = () => handleSubmit(onSubmit)();

  return (
    <Screen>
      <AuthHeader
        title="Create your account"
        subtitle="Join to unlock members-only lessons. It only takes a minute."
      />
      <Card>
        <FormInput
          control={control}
          name="username"
          label="Username"
          hint="3–20 characters. Shown in the app's header."
          error={errors.username?.message}
          editable={!isSubmitting}
          placeholder="e.g. jamie_plays"
          autoCapitalize="none"
          autoComplete="username"
          textContentType="username"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => setFocus("email")}
        />
        <FormInput
          control={control}
          name="email"
          label="Email"
          error={errors.email?.message}
          editable={!isSubmitting}
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => setFocus("password")}
        />
        <FormInput
          control={control}
          name="password"
          label="Password"
          hint="At least 6 characters. A mix of letters, numbers and symbols is strongest."
          error={errors.password?.message}
          editable={!isSubmitting}
          placeholder="Create a password"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => setFocus("confirmPassword")}
        />
        <FormInput
          control={control}
          name="confirmPassword"
          label="Confirm password"
          error={errors.confirmPassword?.message}
          editable={!isSubmitting}
          placeholder="Type it again"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="go"
          onSubmitEditing={submit}
        />
        <FeedbackMessage type="error" message={errors.root?.message} />
        <FeedbackMessage type="success" message={notice} />
        <SubmitButton
          title="Create account"
          loadingTitle="Creating account..."
          loading={isSubmitting}
          onPress={submit}
        />
      </Card>
      <AuthSwitchLink
        prompt="Already have an account?"
        linkText="Sign in"
        href="/sign-in"
      />
      <PublicInstruments />
    </Screen>
  );
}
