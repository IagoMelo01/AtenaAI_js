import React, { useMemo, useState } from "react";
import { KeyboardAvoidingView, Linking, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import ScreenBackground from "../components/layout/ScreenBackground";
import AuthCard from "../components/auth/AuthCard";
import GradientTitle from "../components/typography/GradientTitle";
import FormTextField from "../components/forms/FormTextField";
import GradientButton from "../components/buttons/GradientButton";
import { COLORS, GRADIENTS } from "../constants/colors";

const emailRegex = /[^@\s]+@[^@\s]+\.[^@\s]+/;

export default function ForgotPassword({ onSendReset, backgroundImage }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const canSubmit = useMemo(() => emailRegex.test(email) && !loading, [email, loading]);

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
        (maybeMessage && maybeMessage.trim()) ||
          "Se existir uma conta com este e-mail, enviaremos um link para redefinir a senha."
      );
    } catch (e) {
      const rawMessage = typeof e?.message === "string" ? e.message : null;

      if (rawMessage) {
        const anchorRegex = /<a[^>]*href=['"]([^'"]+)['"][^>]*>(.*?)<\/a>/i;
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
      <ScreenBackground imageSource={backgroundImage} overlayColor={COLORS.overlayMedium}>
        <KeyboardAvoidingView behavior={Platform.select({ ios: "padding" })} style={styles.kav}>
          <AuthCard>
            <GradientTitle style={styles.title}>Redefinir Senha</GradientTitle>

            {success ? (
              <View style={styles.alertSuccess}>
                <Text style={styles.alertSuccessText}>{success}</Text>
              </View>
            ) : null}

            <FormTextField
              value={email}
              onChangeText={setEmail}
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {error ? (
              <Text style={styles.errorText}>
                {error.message}
                {error.supportLink ? (
                  <Text
                    style={styles.errorSupportLink}
                    accessibilityRole="link"
                    onPress={() => {
                      Linking.openURL(error.supportLink.url);
                    }}
                  >
                    {error.message.endsWith(" ") ? "" : " "}
                    {error.supportLink.label}
                  </Text>
                ) : null}
              </Text>
            ) : null}

            <GradientButton
              title="Enviar link de redefinição"
              onPress={handleSubmit}
              loading={loading}
              disabled={!canSubmit}
              gradient={GRADIENTS.primary}
              textStyle={styles.buttonText}
              style={styles.submitButton}
              contentStyle={styles.submitButtonContent}
            />

            <TouchableOpacity onPress={() => router.replace("/")} style={styles.backButton}>
              <Text style={styles.backLink}>Voltar para o login</Text>
            </TouchableOpacity>
          </AuthCard>
        </KeyboardAvoidingView>
      </ScreenBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  kav: { flex: 1, width: "100%", justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 16 },
  errorText: { color: COLORS.textoErro, alignSelf: "flex-start", marginTop: 6 },
  errorSupportLink: {
    color: COLORS.laranja,
    textDecorationLine: "underline",
    fontWeight: "700",
  },
  alertSuccess: { width: "100%", backgroundColor: COLORS.sucessoBg, borderRadius: 10, padding: 10, marginBottom: 8 },
  alertSuccessText: { color: COLORS.sucessoText },
  buttonText: { fontSize: 15, textAlign: "center" },
  submitButton: { width: "100%", marginTop: 10 },
  submitButtonContent: { borderRadius: 10 },
  backButton: { marginTop: 12 },
  backLink: { color: COLORS.laranja, textDecorationLine: "underline", fontSize: 14 },
});
