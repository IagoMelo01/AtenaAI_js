import React from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import GradientButton from "../buttons/GradientButton";
import { COLORS, GRADIENTS } from "../../constants/colors";

const isAndroid = Platform.OS === "android";
const withGap = (value) => (isAndroid ? {} : { gap: value });

export default function HeroSection({ displayName, onChatPress }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={GRADIENTS.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroTitleWrapper}
      >
        <Text style={styles.heroTitle}>Conheça Atena</Text>
      </LinearGradient>
      {displayName ? <Text style={styles.welcomeText}>Olá, {displayName}!</Text> : null}
      <Text style={styles.heroSubtitle}>
        Sua nova tutora 24 horas. Educação do futuro, hoje.
      </Text>

      <View style={styles.imageWrapper}>
        <Image source={require("../../assets/images/atena.jpg")} style={styles.heroImage} />
      </View>

      <GradientButton
        title="Conversar Agora"
        onPress={onChatPress}
        gradient={GRADIENTS.primary}
        style={styles.ctaWrapper}
        contentStyle={styles.ctaButton}
        textStyle={styles.ctaText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 20,
    ...withGap(20),
  },
  heroTitleWrapper: {
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 999,
    marginBottom: 16,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  welcomeText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  heroSubtitle: {
    color: "#fff",
    opacity: 0.9,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 22,
    maxWidth: 420,
    marginTop: 8,
    marginBottom: 20,
  },
  imageWrapper: {
    borderWidth: 3,
    borderColor: COLORS.verde,
    borderRadius: 24,
    overflow: "hidden",
    marginTop: 16,
    marginBottom: 24,
  },
  heroImage: {
    width: 240,
    height: 360,
    resizeMode: "cover",
  },
  ctaWrapper: {
    width: "100%",
    marginTop: 24,
  },
  ctaButton: {
    borderRadius: 28,
    paddingVertical: 14,
  },
  ctaText: {
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
