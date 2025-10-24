import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/colors";

export default function AuthCard({ children, style, ...rest }) {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.card, style]} {...rest}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    width: "100%",
  },
  card: {
    width: 360,
    maxWidth: "90%",
    borderRadius: 20,
    backgroundColor: "#fff",
    padding: 24,
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.verde,
    shadowColor: COLORS.verde,
    shadowOpacity: Platform.OS === "ios" ? 0.9 : 0.6,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 26,
  },
});
