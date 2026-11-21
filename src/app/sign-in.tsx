import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AuthHeader from "../components/AuthHeader";
import AuthSwitchLink from "../components/AuthSwitchLink";
import Card from "../components/Card";
import FeedbackMessage from "../components/FeedbackMessage";
import FormInput from "../components/FormInput";
import Screen from "../components/Screen";
import SubmitButton from "../components/SubmitButton";
import { useAuth } from "../context/AuthProvider";
import { signInSchema, type SignInFormData } from "../schemas/auth";
import { getAuthErrorMessage } from "../utils/errors";

export default function SignInScreen() {
  const { signIn } = useAuth();
  const {
    control,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async ({ email, password }: SignInFormData) => {
    try {
      await signIn(email, password);
      // On success the route guard in _layout.tsx redirects to /profile
    } catch (error) {
      setError("root", { message: getAuthErrorMessage(error) });
    }
  };

  const submit = () => handleSubmit(onSubmit)();

  return (
    <Screen>
      <AuthHeader
        title="Welcome back"
        subtitle="Sign in to see your profile and members-only lessons."
      />
      <Card>
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
          error={errors.password?.message}
          editable={!isSubmitting}
          placeholder="Your password"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={submit}
        />
        <FeedbackMessage type="error" message={errors.root?.message} />
        <SubmitButton
          title="Sign in"
          loadingTitle="Signing in..."
          loading={isSubmitting}
          onPress={submit}
        />
      </Card>
      <AuthSwitchLink
        prompt="New here?"
        linkText="Create an account"
        href="/sign-up"
      />
    </Screen>
  );
}
