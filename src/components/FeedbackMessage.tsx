import { StyleSheet, Text, View } from "react-native";

type FeedbackMessageProps = {
  type: "error" | "success" | "info";
  message?: string | null;
};

export default function FeedbackMessage({
  type,
  message,
}: FeedbackMessageProps) {
  if (!message) return null;

  return (
    <View
      style={[styles.box, styles[type]]}
      accessibilityRole={type === "error" ? "alert" : "text"}
      accessibilityLiveRegion="polite"
    >
      <Text style={[styles.text, styles[`${type}Text`]]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderWidth: 1, borderRadius: 6, padding: 12 },
  text: { fontSize: 14 },
  error: { backgroundColor: "#fdecea", borderColor: "#f5c2c0" },
  errorText: { color: "#b71c1c" },
  success: { backgroundColor: "#e8f5e9", borderColor: "#b9dfbb" },
  successText: { color: "#1b5e20" },
  info: { backgroundColor: "#e3f2fd", borderColor: "#b6d8f5" },
  infoText: { color: "#0d47a1" },
});
