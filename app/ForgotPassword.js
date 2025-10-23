import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    StatusBar,
    Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { useRouter } from "expo-router";

/**
 * ForgotPassword — Tela "Esqueci a senha"
 */

const COLORS = {
    azul: "#0451b8",
    laranja: "#f47500",
    verde: "#098419",
    cinzaInput: "#e6e6e6",
    textoErro: "#ff4d4f",
    sucessoBg: "#d4edda",
    sucessoText: "#155724",
};

export default function ForgotPassword({ onSendReset, backgroundImage }) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const emailRegex = /[^@\s]+@[^@\s]+\.[^@\s]+/;
    const canSubmit = emailRegex.test(email) && !loading;

    const handleSubmit = async () => {
        setError(null);
        setSuccess(null);
        if (!canSubmit) {
            setError({ message: "Informe um e-mail válido." });
            return;
        }

        try {
            setLoading(true);
            const response = await onSendReset?.(email.trim());
            const maybeMessage =
                response && typeof response === "object" && "message" in response && typeof response.message === "string"
                    ? response.message
                    : null;

            setSuccess(
                (maybeMessage && maybeMessage.trim()) || "Se existir uma conta com este e-mail, enviaremos um link para redefinir a senha."
            );
        } catch (e) {
            const rawMessage = typeof e?.message === "string" ? e.message : null;

            if (rawMessage) {
                const anchorRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/i;
                const match = rawMessage.match(anchorRegex);

                if (match) {
                    const [, url, label] = match;
                    const cleanedMessage = rawMessage
                        .replace(anchorRegex, "")
                        .replace(/<[^>]+>/g, "")
                        .replace(/\s{2,}/g, " ")
                        .trim();
                    const baseMessage = cleanedMessage || rawMessage.replace(/<[^>]+>/g, "").trim();

                    setError({
                        message: baseMessage || "Não foi possível enviar o link. Tente novamente.",
                        supportLink: { url, label },
                    });
                } else {
                    setError({ message: rawMessage });
                }
            } else {
                setError({ message: "Não foi possível enviar o link. Tente novamente." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" />
            <ImageBackground
                source={backgroundImage || require("../assets/images/background.jpg")}
                resizeMode="cover"
                style={styles.bg}
            >
                <LinearGradient colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.7)"]} style={StyleSheet.absoluteFillObject} />

                <KeyboardAvoidingView behavior={Platform.select({ ios: "padding" })} style={styles.kav}>
                    <View style={styles.cardWrapper}>
                        <View style={styles.card}>
                            <MaskedView maskElement={<Text style={styles.title}>Redefinir Senha</Text>}>
                                <LinearGradient colors={[COLORS.azul, COLORS.laranja, COLORS.verde]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                                    <Text style={[styles.title, { opacity: 0 }]}>Redefinir Senha</Text>
                                </LinearGradient>
                            </MaskedView>

                            {success ? (
                                <View style={styles.alertSuccess}>
                                    <Text style={styles.alertSuccessText}>{success}</Text>
                                </View>
                            ) : null}

                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="E-mail"
                                placeholderTextColor="#8c8c8c"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={styles.input}
                            />

                            {error ? (
                                <Text style={styles.errorText}>
                                    {error.message}
                                    {error.supportLink ? (
                                        <>
                                            {error.message.endsWith(" ") ? "" : " "}
                                            <Text
                                                style={styles.errorSupportLink}
                                                accessibilityRole="link"
                                                onPress={() => {
                                                    Linking.openURL(error.supportLink.url);
                                                }}
                                            >
                                                {error.supportLink.label}
                                            </Text>
                                        </>
                                    ) : null}
                                </Text>
                            ) : null}

                            <TouchableOpacity activeOpacity={0.9} onPress={handleSubmit} disabled={!canSubmit} style={{ width: "100%" }}>
                                <LinearGradient colors={[COLORS.azul, COLORS.laranja]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.btn, !canSubmit && styles.btnDisabled]}>
                                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Enviar link de redefinição</Text>}
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => router.replace("/")} style={{ marginTop: 12 }}>
                                <Text style={styles.backLink}>Voltar para o login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#000" },
    bg: { flex: 1, justifyContent: "center", alignItems: "center" },
    kav: { flex: 1, width: "100%", justifyContent: "center", alignItems: "center" },
    cardWrapper: { alignItems: "center" },
    cardShadow: {
        width: "auto",
        borderRadius: 20,
        borderWidth: 3,
        borderColor: COLORS.verde,
        shadowColor: COLORS.verde,
        shadowOpacity: 0.9,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 0 },
        elevation: 26,
    },
    card: {
        width: 360,
        borderRadius: 20,
        backgroundColor: "#fff",
        padding: 24,
        alignItems: "center",
        borderWidth: 3,
        borderColor: COLORS.verde,
        shadowColor: COLORS.verde,
        shadowOpacity: 0.9,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 0 },
        elevation: 26,
    },
    title: { fontSize: 24, fontWeight: "700", textAlign: "center", marginBottom: 16 },
    input: {
        width: "100%",
        paddingVertical: 12,
        paddingHorizontal: 14,
        marginVertical: 6,
        borderRadius: 10,
        backgroundColor: COLORS.cinzaInput,
        fontSize: 16,
        shadowColor: COLORS.laranja,
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 2,
    },
    btn: { width: "100%", paddingVertical: 12, borderRadius: 10, alignItems: "center", justifyContent: "center", marginTop: 10 },
    btnDisabled: { opacity: 0.6 },
    btnText: { color: "#fff", fontWeight: "700", fontSize: 15, textAlign: "center" },
    errorText: { color: COLORS.textoErro, alignSelf: "flex-start", marginTop: 6 },
    errorSupportLink: {
        color: COLORS.laranja,
        textDecorationLine: "underline",
        fontWeight: "700",
    },
    alertSuccess: { width: "100%", backgroundColor: COLORS.sucessoBg, borderRadius: 10, padding: 10, marginBottom: 8 },
    alertSuccessText: { color: COLORS.sucessoText },
    backLink: { color: COLORS.laranja, textDecorationLine: "underline", fontSize: 14 },
});
