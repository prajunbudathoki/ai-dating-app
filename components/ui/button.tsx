import * as Haptics from "expo-haptics";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

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
  onPress,
  ...rest
}: ButtonProps) {
  const primaryColor = "#FF4B6E";
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

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
          backgroundColor: "#F3F4F6",
        };
      default:
        return {
          backgroundColor: primaryColor,
        };
    }
  };

  const getTextColor = () => {
    if (variant === "outline") return primaryColor;
    if (variant === "secondary") return "#1F2937";
    return "#FFFFFF";
  };

  const handlePress = (e: any) => {
    if (loading || disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress?.(e);
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedTouchableOpacity
      style={[
        styles.button,
        getVariantStyle(),
        animatedStyle,
        style,
        (disabled || loading) && styles.disabled,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
      )}
    </AnimatedTouchableOpacity>
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
    shadowRadius: 12,
    elevation: 4,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  disabled: {
    opacity: 0.6,
  },
});
