import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { GRADIENTS } from "../../constants/colors";

const isAndroid = Platform.OS === "android";

export default function ChatHeader({ onBack, canGoBack }) {
  return (
    <LinearGradient colors={GRADIENTS.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="chevron-back" size={22} color="#fff" />
        <Text style={styles.backText}>{canGoBack ? "Voltar" : "Fechar"}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Chat Atena</Text>
      <View style={styles.headerSpacer} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    ...(isAndroid ? {} : { gap: 4 }),
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
  headerSpacer: {
    width: 60,
  },
});
