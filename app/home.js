import React from "react";
import {
    View,
    Text,
    Image,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Linking,
    Platform,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { Feather } from "@expo/vector-icons";

const COLORS = {
    azul: "#0451b8",
    laranja: "#f47500",
    verde: "#098419",
    overlay: "rgba(0,0,0,0.65)",
};

const isAndroid = Platform.OS === "android";
const withGap = (value) => (isAndroid ? {} : { gap: value });

export default function Home() {
    const router = useRouter();
    const { user } = useAuth();

    const tempName =
        (user?.name && String(user.name).trim()) ||
        (user?.nome && String(user.nome).trim()) ||
        (user?.matricula && String(user.matricula).trim()) ||
        (user?.email && String(user.email).trim()) ||
        null;

    const displayName = tempName?.split(" ")[0];

    return (
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <StatusBar barStyle="light-content" />
            <ImageBackground
                source={require("../assets/images/background.jpg")}
                resizeMode="cover"
                style={styles.background}
            >
                <LinearGradient
                    colors={[COLORS.overlay, COLORS.overlay]}
                    style={StyleSheet.absoluteFillObject}
                />

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Image
                            source={require("../assets/images/logo.png")}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityLabel="Abrir meus dados"
                            onPress={() => router.push("/profile")}
                            activeOpacity={0.85}
                            style={styles.profileIconButton}
                        >
                            <Feather name="user" size={26} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.hero}>
                        <LinearGradient
                            colors={[COLORS.azul, COLORS.laranja]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.heroTitleWrapper}
                        >
                            <Text style={styles.heroTitle}>Conheça Atena</Text>
                        </LinearGradient>
                        {displayName && (
                            <Text style={styles.welcomeText}>Olá, {displayName}!</Text>
                        )}
                        <Text style={styles.heroSubtitle}>
                            Sua nova tutora 24 horas. Educação do futuro, hoje.
                        </Text>

                        <View style={styles.imageWrapper}>
                            <Image
                                source={require("../assets/images/atena.jpg")}
                                style={styles.heroImage}
                            />
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => router.push("/chat")}
                            style={styles.ctaWrapper}
                        >
                            <LinearGradient
                                colors={[COLORS.azul, COLORS.laranja]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.cta}
                            >
                                <Text style={styles.ctaText}>Conversar Agora</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            © 2025 Faculdade Atenas. Transformando a educação com tecnologia.
                        </Text>
                        <View style={styles.legalRow}>
                            <TouchableOpacity onPress={() => Linking.openURL("https://atenas.edu.br/Atena/termos-uso")}>
                                <Text style={styles.link}>Termos de Uso</Text>
                            </TouchableOpacity>
                            <Text style={styles.dot}>•</Text>
                            <TouchableOpacity onPress={() => Linking.openURL("https://atenas.edu.br/Atena/politica-privacidade")}>
                                <Text style={styles.link}>Política de Privacidade</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#000" },
    background: { flex: 1 },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 0,
        paddingBottom: Platform.OS === "ios" ? 32 : 24,
    },
    header: {
        padding: 10,
        margin: 0,
        marginBottom: 24,
        width: '100%',
        display: "flex",
        paddingTop: Platform.OS === "ios" ? 24 : 16,
        paddingBottom: 24,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    logo: { height: 40, width: 160 },
    profileIconButton: {
        height: 44,
        width: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.4)",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(4,81,184,0.25)",
    },
    hero: {
        alignItems: "center",
        paddingHorizontal: 20,
        ...withGap(20),
    },
    heroTitleWrapper: {
        paddingVertical: 8,
        paddingHorizontal: 32,
        borderRadius: 999,
        marginBottom: 16,
    },
    heroTitle: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "800",
        textAlign: "center",
        letterSpacing: 0.5,
    },
    welcomeText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginTop: 12,
        marginBottom: 8,
    },
    heroSubtitle: {
        color: "#fff",
        opacity: 0.9,
        textAlign: "center",
        fontSize: 16,
        lineHeight: 22,
        maxWidth: 420,
        marginTop: 8,
        marginBottom: 20,
    },
    imageWrapper: {
        borderWidth: 3,
        borderColor: COLORS.verde,
        borderRadius: 24,
        overflow: "hidden",
        marginTop: 16,
        marginBottom: 24,
    },
    heroImage: {
        width: 240,
        height: 360,
        resizeMode: "cover",
    },
    ctaWrapper: {
        width: "100%",
        marginTop: 24,
    },
    cta: {
        paddingVertical: 14,
        borderRadius: 28,
        alignItems: "center",
    },
    ctaText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
        letterSpacing: 1,
        textTransform: "uppercase",
    },
    footer: {
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
    legalRow: {
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
    dot: { color: "#fff", opacity: 0.7, marginHorizontal: 6 },
});
