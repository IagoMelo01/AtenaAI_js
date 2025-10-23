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
import { useAuth } from "../contexts/AuthContext";
import { login } from "../lib/api";

const COLORS = {
    azul: "#0451b8",
    laranja: "#f47500",
    verde: "#098419",
    cinzaInput: "#e6e6e6",
    textoErro: "#ff4d4f",
};


export default function LoginAtena({
    onLogin,
    onForgotPassword,
    backgroundImage,
    title = "Login",
    termsUrl = "https://atenas.edu.br/Atena/termos-uso",
    privacyUrl = "https://atenas.edu.br/Atena/politica-privacidade",
}) {
    const router = useRouter();
    const { login: authLogin } = useAuth();

    const [matricula, setMatricula] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const canSubmit = matricula.trim().length > 0 && password.length >= 4 && !loading;

    const handleSubmit = async () => {
        setError(null);
        if (!canSubmit) {
            setError("Preencha RA e senha (mín. 4 caracteres).");
            return;
        }
        try {
            setLoading(true);
            const credentials = { matricula: matricula.trim(), password };

            const submit =
                typeof onLogin === "function"
                    ? onLogin
                    : async (creds) => {
                          const response = await login(creds);

                          const normalizedUser = response?.user
                              ? {
                                    ...response.user,
                                    ...(response.token ? { token: response.token } : {}),
                                }
                              : {
                                    ...creds,
                                    ...((response && typeof response === "object") ? response : {}),
                                };

                          await authLogin(normalizedUser);
                          return normalizedUser;
                      };

            await submit(credentials);
            router.replace("/home");
        } catch (e) {
            setError(e?.message || "Não foi possível entrar. Tente novamente.");
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
                <LinearGradient
                    pointerEvents="none"
                    colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.7)"]}
                    style={styles.overlay}
                />

                <KeyboardAvoidingView
                    behavior={Platform.select({ ios: "padding", android: undefined })}
                    style={styles.kav}
                >
                    <View style={styles.cardWrapper}>
                        <View style={styles.card}>
                            <MaskedView maskElement={<Text style={styles.title}>{title}</Text>}>
                                <LinearGradient
                                    colors={[COLORS.azul, COLORS.laranja, COLORS.verde]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Text style={[styles.title, { opacity: 0 }]}>{title}</Text>
                                </LinearGradient>
                            </MaskedView>

                            <TextInput
                                value={matricula}
                                onChangeText={setMatricula}
                                placeholder="RA - aluno"
                                placeholderTextColor="#8c8c8c"
                                autoCapitalize="none"
                                style={styles.input}
                            />

                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Senha"
                                placeholderTextColor="#8c8c8c"
                                secureTextEntry
                                style={styles.input}
                            />

                            {error && <Text style={styles.errorText}>{error}</Text>}

                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={handleSubmit}
                                disabled={!canSubmit}
                                style={{ width: "100%" }}
                            >
                                <LinearGradient
                                    colors={[COLORS.azul, COLORS.laranja]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[styles.btn, !canSubmit && styles.btnDisabled]}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.btnText}>Entrar</Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    onForgotPassword?.();
                                    router.push("/forgot");
                                }}
                                style={{ marginTop: 10 }}
                            >
                                <Text style={styles.forgotLink}>Esqueceu sua senha?</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>

                <View style={styles.footer}>
                    {!!termsUrl && (
                        <TouchableOpacity onPress={() => Linking.openURL(termsUrl)}>
                            <Text style={styles.footerLink}>Termos de Uso</Text>
                        </TouchableOpacity>
                    )}
                    {!!termsUrl && !!privacyUrl && <Text style={styles.footerSeparator}>•</Text>}
                    {!!privacyUrl && (
                        <TouchableOpacity onPress={() => Linking.openURL(privacyUrl)}>
                            <Text style={styles.footerLink}>Política de Privacidade</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    bg: { flex: 1, justifyContent: "center", alignItems: "center" },
    overlay: { ...StyleSheet.absoluteFillObject },
    kav: { flex: 1, width: "100%", justifyContent: "center", alignItems: "center" },
    cardWrapper: { alignItems: "center" },
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
    title: { fontSize: 26, fontWeight: "700", textAlign: "center", marginBottom: 18 },
    input: {
        width: "100%",
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 10,
        backgroundColor: COLORS.cinzaInput,
        fontSize: 16,
        marginVertical: 6,
        shadowColor: COLORS.laranja,
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 2,
    },
    btn: {
        width: "100%",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    btnDisabled: { opacity: 0.6 },
    btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
    forgotLink: { color: COLORS.laranja, fontSize: 14, textDecorationLine: "underline" },
    errorText: { color: COLORS.textoErro, marginVertical: 6, alignSelf: "flex-start" },
    footer: {
        position: "absolute",
        bottom: 24,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        ...(Platform.OS === "android" ? {} : { gap: 12 }),
    },
    footerLink: {
        color: COLORS.laranja,
        textDecorationLine: "underline",
        fontSize: 13,
        marginHorizontal: 6,
    },
    footerSeparator: { color: "#fff", opacity: 0.7, marginHorizontal: 6 },
});
