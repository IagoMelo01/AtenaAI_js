import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfileSupportBox({ onPressSupport }) {
  return (
    <View style={styles.supportBox}>
      <Text style={styles.supportText}>
        Para alterar as informações entre em contato com o suporte.
      </Text>
      <TouchableOpacity onPress={onPressSupport} activeOpacity={0.8}>
        <Text style={styles.supportLink}>(38)3365-1164</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  supportBox: {
    marginTop: 28,
    padding: 20,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
  },
  supportText: {
    color: "#fff",
    opacity: 0.8,
    textAlign: "center",
    marginBottom: 12,
  },
  supportLink: {
    color: "#fff",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
