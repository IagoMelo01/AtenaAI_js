import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { GRADIENTS } from "../../constants/colors";

const isAndroid = Platform.OS === "android";
const withGap = (value) => (isAndroid ? {} : { gap: value });

export default function GradientHeader({
  title,
  onBack,
  backLabel,
  right,
  gradient = GRADIENTS.primary,
}) {
  return (
    <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.container}>
      <TouchableOpacity onPress={onBack} style={[styles.backButton, !onBack && styles.backButtonDisabled]} disabled={!onBack}>
        {onBack ? <Ionicons name="chevron-back" size={22} color="#fff" /> : null}
        {backLabel ? <Text style={styles.backText}>{backLabel}</Text> : null}
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.right}>{right}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    ...withGap(4),
  },
  backButtonDisabled: {
    opacity: 0,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: isAndroid ? 4 : 0,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  right: {
    minWidth: 44,
    alignItems: "flex-end",
  },
});
