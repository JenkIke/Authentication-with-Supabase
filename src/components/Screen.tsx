import { useHeaderHeight } from "expo-router/react-navigation";
import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import type { Theme } from "../constants/theme";
import { useThemedStyles } from "../hooks/use-theme";

type ScreenProps = {
  children: ReactNode;
  /** Vertically centre the content (loading and error states). */
  centered?: boolean;
};

/**
 * Shared layout for every screen: same background, padding and max width,
 * scrolls when content is long, and moves up out of the keyboard's way.
 */
export default function Screen({ children, centered = false }: ScreenProps) {
  const styles = useThemedStyles(createStyles);
  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.content, centered && styles.centered]}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inner}>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    flex: { flex: 1, backgroundColor: t.colors.background },
    content: { flexGrow: 1, padding: t.spacing.xl },
    centered: { justifyContent: "center" },
    inner: {
      width: "100%",
      maxWidth: 480,
      alignSelf: "center",
      gap: t.spacing.xl,
    },
  });
