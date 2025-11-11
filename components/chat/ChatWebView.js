import React, { forwardRef, useEffect, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import WebView from "react-native-webview";
import { COLORS } from "../../constants/colors";

const isAndroid = Platform.OS === "android";
const userAgent = Platform.select({
  ios: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  android:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
  default: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
});

const ChatWebView = forwardRef(function ChatWebView(
  { uri, html, onCanGoBackChange, onLoadChange },
  ref,
) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timedOut, setTimedOut] = useState(false);

  const handleLoadStart = () => {
    setError("");
    setLoading(true);
    onLoadChange?.(true);
  };

  const handleLoadEnd = () => {
    setLoading(false);
    onLoadChange?.(false);
  };

  const handleError = (event) => {
    const message = event.nativeEvent?.description ?? "Falha ao carregar o chat.";
    console.warn("[ChatWebView] error", message, event.nativeEvent);
    setError(message);
    setLoading(false);
    onLoadChange?.(false);
  };

  const handleHttpError = (event) => {
    const message = `HTTP ${event.nativeEvent?.statusCode ?? "?"} - Falha ao carregar o chat.`;
    console.warn("[ChatWebView] http error", message, event.nativeEvent);
    setError(message);
    setLoading(false);
    onLoadChange?.(false);
  };

  const handleLoadProgress = ({ nativeEvent }) => {
    if (nativeEvent.progress >= 0.95) {
      setLoading(false);
      onLoadChange?.(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      setTimedOut(false);
      return;
    }

    const timeoutHandle = setTimeout(() => {
      setTimedOut(true);
      setLoading(false);
      onLoadChange?.(false);
    }, 4000);

    return () => clearTimeout(timeoutHandle);
  }, [loading, onLoadChange]);

  return (
    <View style={styles.container}>
      <WebView
        ref={ref}
        source={
          html
            ? { html }
            : { uri }
        }
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode={"always"}
        setSupportMultipleWindows={false}
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        allowsBackForwardNavigationGestures
        androidLayerType="hardware"
        startInLoadingState
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback
        allowsFullscreenVideo
        mediaCapturePermissionGrantType="grant"
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onLoadProgress={handleLoadProgress}
        onError={handleError}
        onHttpError={handleHttpError}
        onShouldStartLoadWithRequest={() => true}
        onNavigationStateChange={(event) => onCanGoBackChange?.(event.canGoBack)}
        style={styles.webview}
        userAgent={userAgent}
      />

      {error ? (
        <View style={styles.errorOverlay} pointerEvents="none">
          <LinearGradient colors={[COLORS.overlayStrong, COLORS.overlay]} style={StyleSheet.absoluteFillObject} />
          <Text style={styles.errorTitle}>Nao foi possivel carregar o chat</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Text style={styles.errorHint}>Use o botao de recarregar acima para tentar novamente.</Text>
        </View>
      ) : (
        loading && !timedOut && (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <LinearGradient colors={[COLORS.overlay, COLORS.overlay]} style={StyleSheet.absoluteFillObject} />
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Carregando chat...</Text>
          </View>
        )
      )}
    </View>
  );
});

export default ChatWebView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,
    backgroundColor: "#000",
    alignItems: "stretch",
  },
  webview: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    height: "100%",
    alignSelf: "stretch",
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
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    ...(isAndroid ? {} : { gap: 10 }),
  },
  errorTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  errorMessage: {
    color: "#fff",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  errorHint: {
    color: "#fff",
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
    opacity: 0.8,
  },
});
