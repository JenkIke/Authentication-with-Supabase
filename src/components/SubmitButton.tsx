import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

type SubmitButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  loadingTitle?: string;
  disabled?: boolean;
  variant?: "primary" | "danger";
};

export default function SubmitButton({
  title,
  onPress,
  loading = false,
  loadingTitle,
  disabled = false,
  variant = "primary",
}: SubmitButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        variant === "danger" ? styles.danger : styles.primary,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      {loading && <ActivityIndicator color="#fff" />}
      <Text style={styles.text}>
        {loading && loadingTitle ? loadingTitle : title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  primary: { backgroundColor: "#1565c0" },
  danger: { backgroundColor: "#d32f2f" },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.6 },
  text: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
