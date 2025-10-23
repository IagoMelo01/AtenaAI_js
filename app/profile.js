import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    ImageBackground,
    Linking,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

const SUPPORT_URL = "https://wa.me/3833651164";

const COLORS = {
    azul: "#0451b8",
    laranja: "#f47500",
    verde: "#098419",
    overlay: "rgba(0,0,0,0.75)",
};

export default function ProfileScreen() {
    const router = useRouter();
    const { user, updateEmail, logout } = useAuth();

    const [email, setEmail] = useState(user?.email ? String(user.email) : "");
    const [saving, setSaving] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (!user) {
            router.replace("/");
            return;
        }
        setEmail(user.email ? String(user.email) : "");
    }, [router, user]);

    const infoItems = useMemo(
        () =>
            [
                { label: "Nome", value: user?.name ?? user?.nome },
                { label: "Matrícula", value: user?.matricula },
                { label: "ID", value: user?.id != null ? String(user.id) : null },
            ].filter((item) => item.value != null && String(item.value).trim().length > 0),
        [user]
    );

    const handleSave = async () => {
        if (!email.trim()) {
            setError("Informe um e-mail válido.");
            setSuccess(null);
            return;
        }

        try {
            setSaving(true);
            setError(null);
            setSuccess(null);
            const updated = await updateEmail(email.trim());
            setEmail(updated.email ? String(updated.email) : email.trim());
            setSuccess("E-mail atualizado com sucesso!");
        } catch (err) {
            setError(err?.message || "Não foi possível atualizar o e-mail. Tente novamente.");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        try {
            setLoggingOut(true);
            logout();
            router.replace("/");
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <StatusBar barStyle="light-content" />
            <ImageBackground
                source={require("../assets/images/background.jpg")}
                style={styles.background}
                resizeMode="cover"
            >
                <LinearGradient colors={[COLORS.overlay, COLORS.overlay]} style={StyleSheet.absoluteFillObject} />
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Text style={styles.backButtonText}>Voltar</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Meus Dados</Text>
                        <View style={styles.headerSpacer} />
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Informações do aluno</Text>
                        {infoItems.length === 0 && (
                            <Text style={styles.emptyText}>
                                Não encontramos outras informações no momento.
                            </Text>
                        )}
                        {infoItems.map((item) => (
                            <View key={item.label} style={styles.fieldRow}>
                                <Text style={styles.fieldLabel}>{item.label}</Text>
                                <Text style={styles.fieldValue}>{String(item.value)}</Text>
                            </View>
                        ))}

                        <View style={styles.divider} />

                        <Text style={styles.sectionTitle}>E-mail cadastrado</Text>
                        <Text style={styles.helperText}>
                            Atualize seu e-mail para receber comunicados importantes.
                        </Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholder="seu-email@exemplo.com"
                            placeholderTextColor="rgba(255,255,255,0.6)"
                            style={styles.input}
                        />

                        {error && <Text style={styles.errorText}>{error}</Text>}
                        {success && <Text style={styles.successText}>{success}</Text>}

                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={handleSave}
                            disabled={saving}
                            style={styles.saveButtonWrapper}
                        >
                            <LinearGradient
                                colors={[COLORS.azul, COLORS.laranja]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                            >
                                {saving ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.saveButtonText}>Salvar e-mail</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={handleLogout}
                            disabled={loggingOut}
                            style={styles.logoutButtonWrapper}
                        >
                            <LinearGradient
                                colors={[COLORS.laranja, "#d12c2c"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={[styles.logoutButton, loggingOut && styles.logoutButtonDisabled]}
                            >
                                {loggingOut ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.logoutButtonText}>Sair</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.supportBox}>
                        <Text style={styles.supportText}>
                            Para alterar as informações entre em contato com o suporte.
                        </Text>
                        <TouchableOpacity onPress={() => Linking.openURL(SUPPORT_URL)} activeOpacity={0.8}>
                            <Text style={styles.supportLink}>(38)3365-1164</Text>
                        </TouchableOpacity>
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
        paddingHorizontal: 20,
        paddingBottom: 32,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 12,
        marginBottom: 24,
    },
    backButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.4)",
    },
    backButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    headerTitle: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "700",
    },
    headerSpacer: { width: 72 },
    card: {
        backgroundColor: "rgba(0,0,0,0.55)",
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        marginBottom: 24,
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 12,
    },
    emptyText: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 14,
        marginBottom: 12,
    },
    fieldRow: {
        marginBottom: 12,
    },
    fieldLabel: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 13,
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 4,
    },
    fieldValue: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.1)",
        marginVertical: 16,
    },
    helperText: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 13,
        marginBottom: 8,
    },
    input: {
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: "#fff",
        fontSize: 16,
    },
    errorText: {
        color: "#ff4d4f",
        fontSize: 13,
        marginTop: 10,
    },
    successText: {
        color: "#4cd964",
        fontSize: 13,
        marginTop: 10,
    },
    saveButtonWrapper: {
        marginTop: 20,
    },
    saveButton: {
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    saveButtonDisabled: {
        opacity: 0.7,
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    logoutButtonWrapper: {
        marginTop: 12,
    },
    logoutButton: {
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    logoutButtonDisabled: {
        opacity: 0.7,
    },
    logoutButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    supportBox: {
        backgroundColor: "rgba(0,0,0,0.55)",
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        marginBottom: 40,
    },
    supportText: {
        color: "rgba(255,255,255,0.8)",
        fontSize: 15,
        marginBottom: 12,
    },
    supportLink: {
        color: COLORS.verde,
        fontSize: 18,
        fontWeight: "700",
        textDecorationLine: "underline",
    },
});
