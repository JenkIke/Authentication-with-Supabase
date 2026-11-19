import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { z } from "zod";
import { supabase } from "../utils/supabase";

const signUpSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 character long")
      .max(20, "Username must be at most 20 character long"),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    email: z.string().email("Please enter a valid email address"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSignUp() {
    setLoading(true);
    setError(null);
    setNotice(null);

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else if (!data.session) {
      // Email confirmation is on: the account exists, but nobody is signed in yet
      setNotice("Check your email to confirm your account.");
    }
    setLoading(false);
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>
      <View style={styles.form}>
        <Text style={styles.heading}>Sign up</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
        />
        {error && <Text style={styles.error}>{error}</Text>}
        {notice && <Text>{notice}</Text>}
        <Button
          title="Create account"
          onPress={handleSignUp}
          disabled={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 12 },
  heading: { fontSize: 18, fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#999", borderRadius: 6, padding: 10 },
  error: { color: "crimson" },
});
