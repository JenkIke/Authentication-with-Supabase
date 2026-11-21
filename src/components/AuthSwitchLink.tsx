import { Link, type Href } from "expo-router";
import { StyleSheet, Text } from "react-native";
import type { Theme } from "../constants/theme";
import { useThemedStyles } from "../hooks/use-theme";

type AuthSwitchLinkProps = { prompt: string; linkText: string; href: Href };

/** "New here? Create an account" line under the auth forms. */
export default function AuthSwitchLink({
  prompt,
  linkText,
  href,
}: AuthSwitchLinkProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <Text style={styles.text}>
      {prompt}{" "}
      {/* replace: swapping between sign-in and sign-up shouldn't stack screens */}
      <Link href={href} replace style={styles.link}>
        {linkText}
      </Link>
    </Text>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    text: {
      textAlign: "center",
      fontSize: t.fontSize.body,
      color: t.colors.textMuted,
    },
    link: { color: t.colors.primary, fontWeight: "600" },
  });
