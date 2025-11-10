import React from "react";
import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/colors";

const isAndroid = Platform.OS === "android";
const withGap = (value) => (isAndroid ? {} : { gap: value });

export default function AppFooterLinks({
  termsUrl,
  privacyUrl,
  style,
  linkStyle,
  separatorStyle,
}) {
  if (!termsUrl && !privacyUrl) {
    return null;
  }

  return (
    <View style={[styles.footer, style]}>
      {termsUrl ? (
        <TouchableOpacity onPress={() => termsUrl && Linking.openURL(termsUrl)}>
          <Text style={[styles.link, linkStyle]}>Termos de Uso</Text>
        </TouchableOpacity>
      ) : null}

      {termsUrl && privacyUrl ? (
        <Text style={[styles.separator, separatorStyle]}>•</Text>
      ) : null}

      {privacyUrl ? (
        <TouchableOpacity onPress={() => privacyUrl && Linking.openURL(privacyUrl)}>
          <Text style={[styles.link, linkStyle]}>Política de Privacidade</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    ...withGap(12),
  },
  link: {
    color: COLORS.laranja,
    textDecorationLine: "underline",
    fontSize: 13,
    marginHorizontal: 6,
  },
  separator: {
    color: "#fff",
    opacity: 0.7,
    marginHorizontal: 6,
  },
});
