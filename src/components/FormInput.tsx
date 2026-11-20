import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";

type FormInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  error?: string;
} & Omit<TextInputProps, "value" | "onChangeText" | "onBlur">;

export default function FormInput<T extends FieldValues>({
  control,
  name,
  error,
  ...inputProps
}: FormInputProps<T>) {
  return (
    <View style={styles.wrapper}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            {...inputProps}
          />
        )}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 4 },
  input: { borderWidth: 1, borderColor: "#999", borderRadius: 6, padding: 10 },
  inputError: { borderColor: "crimson" },
  error: { color: "crimson", fontSize: 12 },
});
