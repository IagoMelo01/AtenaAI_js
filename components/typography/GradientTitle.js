import React from "react";
import { StyleSheet, Text } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { GRADIENTS } from "../../constants/colors";

export default function GradientTitle({ children, gradient = GRADIENTS.accent, style }) {
  return (
    <MaskedView maskElement={<Text style={[styles.text, style]}>{children}</Text>}>
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <Text style={[styles.text, style, styles.hidden]}>{children}</Text>
      </LinearGradient>
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
  },
  hidden: {
    opacity: 0,
  },
});
