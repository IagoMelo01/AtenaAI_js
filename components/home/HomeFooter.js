import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import AppFooterLinks from "../layout/AppFooterLinks";

const isAndroid = Platform.OS === "android";
const withGap = (value) => (isAndroid ? {} : { gap: value });

export default function HomeFooter({ termsUrl, privacyUrl }) {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        © 2025 Faculdade Atenas. Transformando a educação com tecnologia.
      </Text>
      <AppFooterLinks termsUrl={termsUrl} privacyUrl={privacyUrl} />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 40,
    alignItems: "center",
    marginBottom: 100,
    ...withGap(12),
  },
  footerText: {
    color: "#fff",
    opacity: 0.8,
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 12,
    marginBottom: 12,
  },
});
