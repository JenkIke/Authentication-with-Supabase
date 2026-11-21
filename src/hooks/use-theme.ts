import { useMemo } from "react";
import { useColorScheme } from "react-native";
import { darkTheme, lightTheme, type Theme } from "../constants/theme";

/** The current theme, following the phone's light/dark setting. */
export function useTheme(): Theme {
  return useColorScheme() === "dark" ? darkTheme : lightTheme;
}

/**
 * Build a component's styles from the current theme.
 * Define `factory` outside the component (e.g. `const createStyles = (t: Theme) => StyleSheet.create({...})`)
 * so the styles are only rebuilt when the theme changes.
 */
export function useThemedStyles<T>(factory: (theme: Theme) => T): T {
  const theme = useTheme();
  return useMemo(() => factory(theme), [factory, theme]);
}
