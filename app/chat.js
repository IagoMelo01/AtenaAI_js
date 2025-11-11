import React, { useCallback, useEffect, useRef, useState } from "react";
import { requestRecordingPermissionsAsync } from "expo-audio";
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import ChatHeader from "../components/chat/ChatHeader";
import ChatWebView from "../components/chat/ChatWebView";

const CHAT_ID = "93e14a39-37e0-47fb-8e7d-18240b71de19";
const CHAT_HTML = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, maximum-scale=1, user-scalable=0" />
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      html, body, #tzzai-root { height: 100%; width: 100%; margin: 0; padding: 0; background: #fff; }
      body { display: flex; justify-content: center; align-items: stretch; overflow: hidden; width: 100vw; }
      #tzzai-root { width: 100vw; max-width: 100vw; min-height: 100%; }
    </style>
    <script>
      (function () {
        const mobileUA =
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
        try {
          Object.defineProperty(navigator, "userAgent", {
            get: function () {
              return mobileUA;
            },
            configurable: true,
          });
        } catch (error) {
          console.warn("Unable to override userAgent", error);
        }
      })();
    </script>
  </head>
  <body>
    <div id="tzzai-root"></div>
    <script type="module">
      import Chatbot from "https://chat-embed.toolzz.ai/dist/web.js";
      Chatbot.initTzzaiWeb({ id: "${CHAT_ID}" });
    </script>
  </body>
</html>
`;

export default function Chat() {
  const navigation = useNavigation();
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [micPermissionStatus, setMicPermissionStatus] = useState("pending");

  const handleBack = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
      return;
    }
    navigation.goBack();
  };

  const handleReload = () => {
    setLoading(true);
    setReloadKey((prev) => prev + 1);
  };

  const requestMicPermission = useCallback(async () => {
    try {
      const { status } = await requestRecordingPermissionsAsync();
      setMicPermissionStatus(status === "granted" ? "granted" : "denied");
    } catch (error) {
      console.warn("Could not request microphone permission", error);
      setMicPermissionStatus("denied");
    }
  }, []);

  useEffect(() => {
    requestMicPermission();
  }, [requestMicPermission]);

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.screen}>
        <View style={styles.headerWrapper}>
          <ChatHeader onBack={handleBack} canGoBack={canGoBack} onReload={handleReload} loading={loading} />
        </View>
        <View style={styles.body}>
          <ChatWebView
            key={`chat-${reloadKey}`}
            ref={webViewRef}
            html={CHAT_HTML}
            onCanGoBackChange={setCanGoBack}
            onLoadChange={setLoading}
          />
          {micPermissionStatus === "denied" && (
            <View style={styles.permissionOverlay} pointerEvents="box-none">
              <Text style={styles.permissionTitle}>Microfone necessário</Text>
              <Text style={styles.permissionMessage}>
                Autorize o microfone para que o botão dentro do chat funcione.
              </Text>
              <TouchableOpacity style={styles.permissionButton} onPress={requestMicPermission}>
                <Text style={styles.permissionButtonText}>Conceder acesso</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },
  screen: {
    flex: 1,
    width: "100%",
  },
  headerWrapper: {
    width: "100%",
  },
  body: {
    flex: 1,
    width: "110%",
    minHeight: 0,
    backgroundColor: "#000",
    position: "relative",
  },
  permissionOverlay: {
    position: "absolute",
    top: 48,
    right: 16,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  permissionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  permissionMessage: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 8,
  },
  permissionButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  permissionButtonText: {
    color: "#000",
    fontWeight: "600",
  },
});
