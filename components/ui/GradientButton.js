import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GRADIENTS } from "../../constants/colors";

export default function GradientButton({
  title,
  children,
  onPress,
  loading = false,
  disabled = false,
  colors = GRADIENTS.primary,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 },
  style,
  textStyle,
  indicatorColor = "#fff",
}) {
  const content = children ?? (
    loading ? (
      <ActivityIndicator color={indicatorColor} />
    ) : (
      <Text style={[styles.text, textStyle]}>{title}</Text>
    )
  );

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      disabled={disabled || loading}
      style={styles.touchable}
    >
      <LinearGradient
        colors={colors}
        start={start}
        end={end}
        style={[styles.gradient, style, (disabled || loading) && styles.disabled]}
      >
        <View style={styles.content}>{content}</View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    width: "100%",
  },
  gradient: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    minHeight: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
});
