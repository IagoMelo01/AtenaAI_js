import React, { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { COLORS } from "../constants/colors";
import ScreenBackground from "../components/layout/ScreenBackground";
import AuthCard from "../components/auth/AuthCard";
import GradientButton from "../components/ui/GradientButton";
import AppFooterLinks from "../components/layout/AppFooterLinks";
import * as Network from "expo-network";

const OFFLINE_ERROR =
  "Sem conexão com a internet. Verifique sua rede e tente novamente.";

const getFriendlyLoginError = (error) => {
  if (!error) return "Não foi possível entrar. Tente novamente.";
  if (typeof error === "string") return error;
  if (error.status === 401) {
    return "RA ou senha incorretos.";
  }
  const message = typeof error.message === "string" ? error.message : "";
  if (message.toLowerCase().includes("timeout")) {
    return "O servidor demorou para responder. Tente novamente.";
  }
  return message || "Não foi possível entrar. Tente novamente.";
};

export default function LoginAtena({
  onLogin,
  onForgotPassword,
  backgroundImage,
  title = "Login",
  termsUrl = "https://atenas.edu.br/Atena/termos-uso",
  privacyUrl = "https://atenas.edu.br/Atena/politica-privacidade",
}) {
  const navigation = useNavigation();
  const { login: authLogin } = useAuth();

  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canSubmit = useMemo(
    () => matricula.trim().length > 0 && password.length >= 4 && !loading,
    [matricula, password, loading],
  );

  const handleSubmit = async () => {
    setError(null);
    if (!canSubmit) {
      setError("Preencha RA e senha (mín. 4 caracteres).");
      return;
    }

    try {
      const state = await Network.getNetworkStateAsync();
      if (!state.isConnected || state.isInternetReachable === false) {
        Alert.alert(
          "Sem conexão",
          "Conecte-se à internet antes de tentar fazer login.",
        );
        setError(OFFLINE_ERROR);
        return;
      }
    } catch (networkError) {
      console.warn("Falha ao verificar conectividade", networkError);
    }

    try {
      setLoading(true);
      const credentials = { matricula: matricula.trim(), password };
      const submit = typeof onLogin === "function" ? onLogin : authLogin;

      await submit(credentials);
    } catch (e) {
      console.error("Login error", e);
      setError(getFriendlyLoginError(e));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    onForgotPassword?.();
    navigation.navigate("ForgotPassword");
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ScreenBackground
        imageSource={backgroundImage || require("../assets/images/background.jpg")}
        overlayColors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.7)"]}
      >
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
          style={styles.kav}
        >
          <View style={styles.cardWrapper}>
            <AuthCard title={title}>
              <TextInput
                value={matricula}
                onChangeText={setMatricula}
                placeholder="RA"
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

              {error ? (
                <>
                  <Text style={styles.errorText}>{error}</Text>
                  <TouchableOpacity
                    style={[
                      styles.retryButton,
                      (loading || !canSubmit) && styles.retryButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={loading || !canSubmit}
                  >
                    <Text style={styles.retryButtonText}>Tentar novamente</Text>
                  </TouchableOpacity>
                </>
              ) : null}

              <GradientButton
                title="Entrar"
                onPress={handleSubmit}
                loading={loading}
                disabled={!canSubmit}
                style={styles.btn}
              />

              <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotWrapper}>
                <Text style={styles.forgotLink}>Esqueceu sua senha?</Text>
              </TouchableOpacity>
            </AuthCard>
          </View>
        </KeyboardAvoidingView>

        <View style={styles.footer}>
          <AppFooterLinks termsUrl={termsUrl} privacyUrl={privacyUrl} />
        </View>
      </ScreenBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  kav: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cardWrapper: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
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
    marginTop: 10,
  },
  forgotWrapper: {
    marginTop: 10,
  },
  forgotLink: {
    color: COLORS.laranja,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  errorText: {
    color: COLORS.textoErro,
    marginVertical: 6,
    alignSelf: "flex-start",
  },
  retryButton: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.laranja,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 4,
  },
  retryButtonDisabled: {
    opacity: 0.6,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    marginBottom: 50,
  },
});


