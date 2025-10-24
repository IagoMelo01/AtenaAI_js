import React from "react";
import { StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/colors";
import MaskedGradientTitle from "../ui/MaskedGradientTitle";

export default function AuthCard({ title, children, style, titleStyle, titleColors }) {
  return (
    <View style={[styles.card, style]}>
      {title ? <MaskedGradientTitle text={title} colors={titleColors} style={[styles.title, titleStyle]} /> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 360,
    borderRadius: 20,
    backgroundColor: "#fff",
    padding: 24,
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.verde,
    shadowColor: COLORS.verde,
    shadowOpacity: 0.9,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 26,
  },
  title: {
    marginBottom: 18,
  },
});
