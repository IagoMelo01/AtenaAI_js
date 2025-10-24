import React from "react";
import { Image, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function HomeHeader({ onProfilePress }) {
  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Abrir meus dados"
        onPress={onProfilePress}
        activeOpacity={0.85}
        style={styles.profileIconButton}
      >
        <Feather name="user" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: Platform.OS === "ios" ? 24 : 16,
    paddingBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  logo: {
    height: 40,
    width: 160,
  },
  profileIconButton: {
    height: 44,
    width: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(4,81,184,0.25)",
  },
});
