import React, { useEffect, useMemo, useState } from "react";
import { Linking, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import ScreenBackground from "../components/layout/ScreenBackground";
import GradientHeader from "../components/layout/GradientHeader";
import GradientButton from "../components/buttons/GradientButton";
import { COLORS, GRADIENTS } from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";

const SUPPORT_URL = "https://wa.me/3833651164";

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
      <ScreenBackground overlayColor={COLORS.overlayStrong}>
        <GradientHeader title="Meus Dados" onBack={() => router.back()} backLabel="Voltar" gradient={GRADIENTS.primary} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Informações do aluno</Text>
            {infoItems.length === 0 && (
              <Text style={styles.emptyText}>Não encontramos outras informações no momento.</Text>
            )}
            {infoItems.map((item) => (
              <View key={item.label} style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>{item.label}</Text>
                <Text style={styles.fieldValue}>{String(item.value)}</Text>
              </View>
            ))}

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>E-mail cadastrado</Text>
            <Text style={styles.helperText}>Atualize seu e-mail para receber comunicados importantes.</Text>
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

            <GradientButton
              title="Salvar e-mail"
              onPress={handleSave}
              loading={saving}
              disabled={saving}
              gradient={GRADIENTS.primary}
              style={styles.buttonSpacing}
              contentStyle={styles.primaryButton}
            />

            <GradientButton
              title="Sair"
              onPress={handleLogout}
              loading={loggingOut}
              disabled={loggingOut}
              gradient={GRADIENTS.danger}
              contentStyle={styles.dangerButton}
            />
          </View>

          <View style={styles.supportBox}>
            <Text style={styles.supportText}>Para alterar as informações entre em contato com o suporte.</Text>
            <Text style={styles.supportLink} onPress={() => Linking.openURL(SUPPORT_URL)}>
              (38)3365-1164
            </Text>
          </View>
        </ScrollView>
      </ScreenBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000" },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 24,
  },
  card: {
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginBottom: 24,
  },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 12 },
  emptyText: { color: "#fff", opacity: 0.8, fontSize: 14, marginBottom: 12 },
  fieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  fieldLabel: { color: "rgba(255,255,255,0.8)", fontSize: 14 },
  fieldValue: { color: "#fff", fontSize: 15, fontWeight: "600", maxWidth: "60%" },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 18,
  },
  helperText: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginBottom: 12 },
  input: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "#fff",
  },
  errorText: { color: "#ff7b7b", marginTop: 8 },
  successText: { color: COLORS.verde, marginTop: 8 },
  buttonSpacing: { marginTop: 18, marginBottom: 12 },
  primaryButton: { borderRadius: 12 },
  dangerButton: { borderRadius: 12 },
  supportBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    marginBottom: 32,
  },
  supportText: { color: "rgba(255,255,255,0.8)", textAlign: "center", marginBottom: 8 },
  supportLink: { color: COLORS.laranja, fontSize: 16, textAlign: "center", textDecorationLine: "underline" },
});
