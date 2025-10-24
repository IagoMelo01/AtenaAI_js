import React from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/colors";

const defaultImage = require("../../assets/images/background.jpg");

export default function ScreenBackground({
  children,
  imageSource = defaultImage,
  overlayColors = [COLORS.overlay, COLORS.overlay],
  style,
  imageStyle,
}) {
  return (
    <ImageBackground source={imageSource} resizeMode="cover" style={[styles.background, style]} imageStyle={imageStyle}>
      <LinearGradient colors={overlayColors} style={StyleSheet.absoluteFillObject} pointerEvents="none" />
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
