import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, GRADIENTS } from "../../constants/colors";

export default function GradientButton({
  title,
  loading = false,
  disabled = false,
  onPress,
  gradient = GRADIENTS.primary,
  style,
  contentStyle,
  textStyle,
  children,
  ...touchableProps
}) {
  const content = children ?? <Text style={[styles.text, textStyle]}>{title}</Text>;
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      disabled={disabled || loading}
      style={style}
      {...touchableProps}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.container, contentStyle, (disabled || loading) && styles.disabled]}
      >
        {loading ? <ActivityIndicator color="#fff" /> : content}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
