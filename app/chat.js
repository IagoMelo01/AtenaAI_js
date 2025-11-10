import React, { useRef, useState } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import ChatHeader from "../components/chat/ChatHeader";
import ChatWebView from "../components/chat/ChatWebView";

const CHAT_URL = "https://admin.toolzz.ai/embed/93e14a39-37e0-47fb-8e7d-18240b71de19";

export default function Chat() {
    const router = useRouter();
    const webViewRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [canGoBack, setCanGoBack] = useState(false);

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
            <LinearGradient colors={[COLORS.azul, COLORS.laranja]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={22} color="#fff" />
                    <Text style={styles.backText}>{canGoBack ? "Voltar" : "Fechar"}</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Chat Atena</Text>
                <View style={styles.headerSpacer} />
            </LinearGradient>

            <View style={styles.webContainer}>
                <WebView
                    ref={(ref) => { webViewRef.current = ref; }}
                    source={{ uri: CHAT_URL }}
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => setLoading(false)}
                    onNavigationStateChange={(event) => setCanGoBack(event.canGoBack)}
                    startInLoadingState
                    mediaPlaybackRequiresUserAction={false}
                    allowsInlineMediaPlayback
                    allowsFullscreenVideo
                    mediaCapturePermissionGrantType="grant"
                    style={styles.webview}
                />

                {loading && (
                    <View style={styles.loadingOverlay} pointerEvents="none">
                        <LinearGradient
                            colors={[COLORS.overlay, COLORS.overlay]}
                            style={StyleSheet.absoluteFillObject}
                        />
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={styles.loadingText}>Carregando chat…</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },
});
