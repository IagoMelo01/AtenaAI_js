import React, { useRef, useState } from "react";
import {
    ActivityIndicator,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const COLORS = {
    azul: "#0451b8",
    laranja: "#f47500",
    overlay: "rgba(0,0,0,0.8)",
};

const CHAT_URL = "https://admin.toolzz.ai/embed/93e14a39-37e0-47fb-8e7d-18240b71de19";

const isAndroid = Platform.OS === "android";
const withGap = (value) => (isAndroid ? {} : { gap: value });

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
    root: { flex: 1, backgroundColor: "#000" },
    header: {
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },
    backButton: { flexDirection: "row", alignItems: "center", ...withGap(4) },
    backText: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: isAndroid ? 4 : 0 },
    title: { color: "#fff", fontSize: 18, fontWeight: "700" },
    headerSpacer: { width: 60 },
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
