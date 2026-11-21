import { useState } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import type { Theme } from "../constants/theme";
import { useTheme, useThemedStyles } from "../hooks/use-theme";

type FormInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  error?: string;
  /** Helper text shown under the field when there's no error. */
  hint?: string;
} & Omit<TextInputProps, "value" | "onChangeText" | "onBlur" | "onFocus">;

export default function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  error,
  hint,
  secureTextEntry,
  editable = true,
  ...inputProps
}: FormInputProps<T>) {
  const theme = useTheme();
  const styles = useThemedStyles(createStyles);
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPassword = !!secureTextEntry;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <View
            style={[
              styles.field,
              focused && styles.fieldFocused,
              error ? styles.fieldError : null,
              !editable && styles.fieldDisabled,
            ]}
          >
            <TextInput
              {...inputProps}
              ref={ref}
              style={styles.input}
              value={value}
              onChangeText={onChange}
              onFocus={() => setFocused(true)}
              onBlur={() => {
                setFocused(false);
                onBlur();
              }}
              editable={editable}
              secureTextEntry={isPassword && !passwordVisible}
              placeholderTextColor={theme.colors.placeholder}
              selectionColor={theme.colors.primary}
              accessibilityLabel={label}
              accessibilityHint={error ?? hint}
            />
            {isPassword && (
              <Pressable
                onPress={() => setPasswordVisible((visible) => !visible)}
                accessibilityRole="button"
                accessibilityLabel={
                  passwordVisible ? "Hide password" : "Show password"
                }
                hitSlop={8}
                style={styles.toggle}
              >
                <Text style={styles.toggleText}>
                  {passwordVisible ? "Hide" : "Show"}
                </Text>
              </Pressable>
            )}
          </View>
        )}
      />
      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    wrapper: { gap: t.spacing.xs },
    label: {
      fontSize: t.fontSize.label,
      fontWeight: "600",
      color: t.colors.text,
    },
    field: {
      flexDirection: "row",
      alignItems: "center",
      minHeight: 48,
      borderWidth: 1,
      borderColor: t.colors.border,
      borderRadius: t.radius.sm,
      backgroundColor: t.colors.surface,
    },
    fieldFocused: { borderColor: t.colors.primary, borderWidth: 2 },
    fieldError: { borderColor: t.colors.danger, borderWidth: 2 },
    fieldDisabled: { opacity: 0.6 },
    input: {
      flex: 1,
      paddingHorizontal: t.spacing.md,
      paddingVertical: t.spacing.md,
      fontSize: t.fontSize.body,
      color: t.colors.text,
    },
    toggle: { paddingHorizontal: t.spacing.md, paddingVertical: t.spacing.sm },
    toggleText: {
      color: t.colors.primary,
      fontWeight: "600",
      fontSize: t.fontSize.label,
    },
    error: { color: t.colors.errorText, fontSize: t.fontSize.small },
    hint: { color: t.colors.textMuted, fontSize: t.fontSize.small },
  });
