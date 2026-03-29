import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function Input({
  label,
  error,
  icon,
  style,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textColor = useThemeColor({}, "text");
  const placeholderColor = useThemeColor(
    { light: "#9BA1A6", dark: "#687076" },
    "icon",
  );
  const borderColor = useThemeColor(
    { light: "#E5E7EB", dark: "#374151" },
    "icon",
  );
  const activeColor = "#FF4B6E";

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(
        error ? "#FF4B6E" : isFocused ? activeColor : borderColor,
        { duration: 200 },
      ),
      borderWidth: withTiming(isFocused || error ? 2 : 1, { duration: 200 }),
      backgroundColor: withTiming(
        isFocused ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.8)",
        { duration: 200 },
      ),
    };
  });

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      )}
      <Animated.View style={[styles.inputWrapper, animatedStyle]}>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={isFocused ? activeColor : placeholderColor}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, { color: textColor }, style]}
          placeholderTextColor={placeholderColor}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
      </Animated.View>
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
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
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
