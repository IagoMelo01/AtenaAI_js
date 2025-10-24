import React from "react";
import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/colors";

const isAndroid = Platform.OS === "android";
const withGap = (value) => (isAndroid ? {} : { gap: value });

export default function HomeFooter() {
  return (
    <View style={styles.container}>
      <Text style={styles.footerText}>
        © 2025 Faculdade Atenas. Transformando a educação com tecnologia.
      </Text>
      <View style={styles.linksRow}>
        <TouchableOpacity onPress={() => Linking.openURL("https://atenas.edu.br/Atena/termos-uso")}> 
          <Text style={styles.link}>Termos de Uso</Text>
        </TouchableOpacity>
        <Text style={styles.dot}>•</Text>
        <TouchableOpacity onPress={() => Linking.openURL("https://atenas.edu.br/Atena/politica-privacidade")}> 
          <Text style={styles.link}>Política de Privacidade</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  linksRow: {
    flexDirection: "row",
    alignItems: "center",
    ...withGap(12),
  },
  link: {
    color: COLORS.laranja,
    textDecorationLine: "underline",
    fontSize: 13,
    marginHorizontal: 6,
  },
  dot: {
    color: "#fff",
    opacity: 0.7,
    marginHorizontal: 6,
  },
});
