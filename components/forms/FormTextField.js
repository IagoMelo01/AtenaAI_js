import React from "react";
import { Platform, StyleSheet, TextInput } from "react-native";
import { COLORS } from "../../constants/colors";

export default function FormTextField({ style, placeholderTextColor = "#8c8c8c", ...props }) {
  return <TextInput style={[styles.input, style]} placeholderTextColor={placeholderTextColor} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginVertical: 6,
    borderRadius: 10,
    backgroundColor: COLORS.cinzaInput,
    fontSize: 16,
    shadowColor: COLORS.laranja,
    shadowOpacity: Platform.OS === "ios" ? 0.3 : 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
});
