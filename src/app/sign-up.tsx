import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import FeedbackMessage from "../components/FeedbackMessage";
import FormInput from "../components/FormInput";
import PublicInstruments from "../components/PublicInstruments";
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
    } catch (error) {
      setError("root", { message: getAuthErrorMessage(error) });
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.form}>
        <Text style={styles.heading}>Sign up</Text>
        <FormInput
          control={control}
          name="username"
          error={errors.username?.message}
          editable={!isSubmitting}
          placeholder="Username"
          autoCapitalize="none"
          autoComplete="username"
        />
        <FormInput
          control={control}
          name="email"
          error={errors.email?.message}
          editable={!isSubmitting}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        <FormInput
          control={control}
          name="password"
          error={errors.password?.message}
          editable={!isSubmitting}
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
        />
        <FormInput
          control={control}
          name="confirmPassword"
          error={errors.confirmPassword?.message}
          editable={!isSubmitting}
          placeholder="Confirm password"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
        />
        <FeedbackMessage type="error" message={errors.root?.message} />
        <FeedbackMessage type="success" message={notice} />
        <SubmitButton
          title="Create account"
          loadingTitle="Creating account..."
          loading={isSubmitting}
          onPress={() => handleSubmit(onSubmit)()}
        />
      </View>
      <Link href="/sign-in">Already have an account? Sign in</Link>
      <PublicInstruments />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 16 },
  form: { gap: 12 },
  heading: { fontSize: 18, fontWeight: "bold" },
});
