import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/colors";

const defaultImage = require("../../assets/images/background.jpg");

export default function ScreenBackground({
  children,
  imageSource = defaultImage,
  overlayColor = COLORS.overlayMedium,
  style,
  overlayStyle,
  ...imageProps
}) {
  return (
    <ImageBackground
      source={imageSource}
      resizeMode="cover"
      style={[styles.background, style]}
      {...imageProps}
    >
      <LinearGradient
        colors={[overlayColor, overlayColor]}
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, overlayStyle]}
      />
      <View style={styles.content}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  content: { flex: 1 },
});
