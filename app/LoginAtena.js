import React, { useMemo, useState } from "react";
import { KeyboardAvoidingView, Linking, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import ScreenBackground from "../components/layout/ScreenBackground";
import AuthCard from "../components/auth/AuthCard";
import GradientTitle from "../components/typography/GradientTitle";
import FormTextField from "../components/forms/FormTextField";
import GradientButton from "../components/buttons/GradientButton";
import { COLORS, GRADIENTS } from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";

const withGap = (value) => (Platform.OS === "android" ? {} : { gap: value });

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

  const canSubmit = useMemo(
    () => matricula.trim().length > 0 && password.length >= 4 && !loading,
    [loading, matricula, password]
  );

  const handleSubmit = async () => {
    setError(null);
    if (!canSubmit) {
      setError("Preencha RA e senha (mín. 4 caracteres).");
      return;
    }
    try {
      setLoading(true);
      const credentials = { matricula: matricula.trim(), password };

      const submit = typeof onLogin === "function" ? onLogin : authLogin;

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
      <ScreenBackground imageSource={backgroundImage} overlayColor={COLORS.overlayMedium}>
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
          style={styles.kav}
        >
          <AuthCard>
            <GradientTitle>{title}</GradientTitle>

            <FormTextField
              value={matricula}
              onChangeText={setMatricula}
              placeholder="RA - aluno"
              autoCapitalize="none"
            />

            <FormTextField
              value={password}
              onChangeText={setPassword}
              placeholder="Senha"
              secureTextEntry
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <GradientButton
              title="Entrar"
              onPress={handleSubmit}
              loading={loading}
              disabled={!canSubmit}
              gradient={GRADIENTS.primary}
              style={styles.loginButton}
              contentStyle={styles.loginButtonContent}
            />

            <TouchableOpacity
              onPress={() => {
                onForgotPassword?.();
                router.push("/forgot");
              }}
              style={styles.forgotButton}
            >
              <Text style={styles.forgotLink}>Esqueceu sua senha?</Text>
            </TouchableOpacity>
          </AuthCard>
        </KeyboardAvoidingView>

        <View style={[styles.footer, withGap(12)]}>
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
      </ScreenBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  kav: { flex: 1, width: "100%", justifyContent: "center", alignItems: "center" },
  errorText: { color: COLORS.textoErro, marginVertical: 6, alignSelf: "flex-start" },
  loginButton: { width: "100%", marginTop: 10 },
  loginButtonContent: { borderRadius: 10 },
  forgotButton: { marginTop: 10 },
  forgotLink: { color: COLORS.laranja, fontSize: 14, textDecorationLine: "underline" },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerLink: {
    color: COLORS.laranja,
    textDecorationLine: "underline",
    fontSize: 13,
    marginHorizontal: 6,
  },
  footerSeparator: { color: "#fff", opacity: 0.7, marginHorizontal: 6 },
});
