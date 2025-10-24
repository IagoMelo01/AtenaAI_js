import React, { forwardRef, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import WebView from "react-native-webview";
import { COLORS } from "../../constants/colors";

const isAndroid = Platform.OS === "android";

const ChatWebView = forwardRef(function ChatWebView(
  { uri, onCanGoBackChange, onLoadChange },
  ref,
) {
  const [loading, setLoading] = useState(true);

  const handleLoadStart = () => {
    setLoading(true);
    onLoadChange?.(true);
  };

  const handleLoadEnd = () => {
    setLoading(false);
    onLoadChange?.(false);
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={ref}
        source={{ uri }}
        startInLoadingState
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onNavigationStateChange={(event) => onCanGoBackChange?.(event.canGoBack)}
        style={styles.webview}
      />

      {loading && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <LinearGradient colors={[COLORS.overlay, COLORS.overlay]} style={StyleSheet.absoluteFillObject} />
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Carregando chat…</Text>
        </View>
      )}
    </View>
  );
});

export default ChatWebView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    ...(isAndroid ? {} : { gap: 12 }),
  },
  loadingText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginTop: isAndroid ? 12 : 0,
  },
});
