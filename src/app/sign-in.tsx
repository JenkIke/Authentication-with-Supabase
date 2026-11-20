import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import FeedbackMessage from "../components/FeedbackMessage";
import FormInput from "../components/FormInput";
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
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async ({ email, password }: SignInFormData) => {
    try {
      await signIn(email, password);
    } catch (error) {
      setError("root", { message: getAuthErrorMessage(error) });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.heading}>Sign in</Text>
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
          autoComplete="current-password"
        />
        <FeedbackMessage type="error" message={errors.root?.message} />
        <SubmitButton
          title="Sign in"
          loadingTitle="Signing in..."
          loading={isSubmitting}
          onPress={() => handleSubmit(onSubmit)()}
        />
      </View>
      <Link href="/sign-up">Need an account? Sign up</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16 },
  form: { gap: 12 },
  heading: { fontSize: 18, fontWeight: "bold" },
});
