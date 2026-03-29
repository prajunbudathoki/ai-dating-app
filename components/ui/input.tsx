import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";

export type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function Input({ label, error, icon, style, ...rest }: InputProps) {
  const textColor = useThemeColor({}, "text");
  const placeholderColor = useThemeColor(
    { light: "#9BA1A6", dark: "#687076" },
    "icon",
  );
  const borderColor = useThemeColor(
    { light: "#E5E7EB", dark: "#374151" },
    "icon",
  );

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      )}
      <View
        style={[
          styles.inputWrapper,
          { borderColor: error ? "#FF4B6E" : borderColor },
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={placeholderColor}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, { color: textColor }, style]}
          placeholderTextColor={placeholderColor}
          {...rest}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  errorText: {
    color: "#FF4B6E",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
