import React, { useCallback, useEffect, useRef, useState } from "react";
import { requestRecordingPermissionsAsync } from "expo-audio";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import ChatHeader from "../components/chat/ChatHeader";

const CHAT_ID = "93e14a39-37e0-47fb-8e7d-18240b71de19";
const CHAT_URL = `https://admin.toolzz.ai/embed/${CHAT_ID}`;

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
          <ChatHeader
            onBack={handleBack}
            canGoBack={canGoBack}
            onReload={handleReload}
            loading={loading}
          />
        </View>

        <View style={styles.body}>
          <WebView
            key={`chat-${reloadKey}`}
            ref={webViewRef}
            source={{ uri: CHAT_URL }}
            onNavigationStateChange={(navState) =>
              setCanGoBack(navState.canGoBack)
            }
            onLoadEnd={() => setLoading(false)}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            allowsProtectedMedia={true}
            mediaPlaybackRequiresUserAction={false}
            geolocationEnabled={true}
            allowFileAccess={true}
            androidCameraAccess={true}
            androidMicrophoneAccess={true}
            onPermissionRequest={(event) => {
              // Autoriza o uso de microfone/câmera dentro do WebView (Android)
              const resources = event.nativeEvent.resources;
              if (
                resources.includes("android.webkit.resource.AUDIO_CAPTURE") ||
                resources.includes("android.webkit.resource.VIDEO_CAPTURE")
              ) {
                event.grant();
              }
            }}
          />

          {micPermissionStatus === "denied" && (
            <View style={styles.permissionOverlay} pointerEvents="box-none">
              <Text style={styles.permissionTitle}>Microfone necessário</Text>
              <Text style={styles.permissionMessage}>
                Autorize o microfone para que o botão dentro do chat funcione.
              </Text>
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={requestMicPermission}
              >
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
    marginLeft: -15,
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
