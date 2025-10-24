import React, { useMemo, useRef, useState } from "react";
import { ActivityIndicator, Platform, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import GradientHeader from "../components/layout/GradientHeader";
import { COLORS, GRADIENTS } from "../constants/colors";

const CHAT_URL = "https://admin.toolzz.ai/embed/93e14a39-37e0-47fb-8e7d-18240b71de19";

const isAndroid = Platform.OS === "android";
const withGap = (value) => (isAndroid ? {} : { gap: value });

export default function Chat() {
  const router = useRouter();
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);

  const backLabel = useMemo(() => (canGoBack ? "Voltar" : "Fechar"), [canGoBack]);

  const handleBack = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
      return;
    }
    router.back();
  };

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <StatusBar barStyle="light-content" />
      <GradientHeader title="Chat Atena" onBack={handleBack} backLabel={backLabel} gradient={GRADIENTS.primary} />

      <View style={styles.webContainer}>
        <WebView
          ref={(ref) => {
            webViewRef.current = ref;
          }}
          source={{ uri: CHAT_URL }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onNavigationStateChange={(event) => setCanGoBack(event.canGoBack)}
          startInLoadingState
          style={styles.webview}
        />

        {loading && (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <LinearGradient colors={[COLORS.overlayStrong, COLORS.overlayStrong]} style={StyleSheet.absoluteFillObject} />
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Carregando chat…</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  webContainer: { flex: 1, backgroundColor: "#000" },
  webview: { flex: 1 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    ...withGap(12),
  },
  loadingText: { color: "#fff", fontSize: 14, fontWeight: "500", marginTop: isAndroid ? 12 : 0 },
});
