import { useThemeColor } from "@/hooks/use-theme-color";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from "react-native";

export type ButtonProps = TouchableOpacityProps & {
  title: string;
  variant?: "primary" | "secondary" | "outline";
  loading?: boolean;
};

export function Button({
  title,
  variant = "primary",
  loading,
  style,
  disabled,
  ...rest
}: ButtonProps) {
  const primaryColor = "#FF4B6E";
  const textColor = useThemeColor({}, "text");
  const bgColor = useThemeColor({}, "background");

  const getVariantStyle = () => {
    switch (variant) {
      case "outline":
        return {
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: primaryColor,
        };
      case "secondary":
        return {
          backgroundColor: "#F0F0F0",
        };
      default:
        return {
          backgroundColor: primaryColor,
        };
    }
  };

  const getTextColor = () => {
    if (variant === "outline") return primaryColor;
    if (variant === "secondary") return "#11181C";
    return "#FFFFFF";
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyle(),
        style,
        (disabled || loading) && styles.disabled,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  disabled: {
    opacity: 0.6,
  },
});
