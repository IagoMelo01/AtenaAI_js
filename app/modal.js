import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Este é um modal</Text>

      <Link href="/" asChild>
        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>Ir para a Home</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  link: { marginTop: 15, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, backgroundColor: "#0451b8" },
  linkText: { color: "#fff", fontWeight: "600" },
});
