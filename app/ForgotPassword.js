import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import ScreenBackground from "../components/layout/ScreenBackground";
import AuthCard from "../components/auth/AuthCard";
import GradientButton from "../components/ui/GradientButton";
import { COLORS } from "../constants/colors";

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
        response && typeof response === "object" && typeof response.message === "string"
          ? response.message
          : null;

      setSuccess(
        (maybeMessage && maybeMessage.trim()) ||
          "Se existir uma conta com este e-mail, enviaremos um link para redefinir a senha.",
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
      <ScreenBackground
        imageSource={backgroundImage || require("../assets/images/background.jpg")}
        overlayColors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.7)"]}
      >
        <KeyboardAvoidingView behavior={Platform.select({ ios: "padding" })} style={styles.kav}>
          <View style={styles.cardWrapper}>
            <AuthCard title="Redefinir Senha">
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
                        onPress={() => error.supportLink && Linking.openURL(error.supportLink.url)}
                      >
                        {error.supportLink.label}
                      </Text>
                    </>
                  ) : null}
                </Text>
              ) : null}

              <GradientButton
                title="Enviar link de redefinição"
                onPress={handleSubmit}
                loading={loading}
                disabled={!canSubmit}
                style={styles.btn}
                textStyle={styles.btnText}
              />

              <TouchableOpacity onPress={() => router.replace("/")} style={styles.backWrapper}>
                <Text style={styles.backLink}>Voltar para o login</Text>
              </TouchableOpacity>
            </AuthCard>
          </View>
        </KeyboardAvoidingView>
      </ScreenBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
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
    marginVertical: 6,
    borderRadius: 10,
    backgroundColor: COLORS.cinzaInput,
    fontSize: 16,
    shadowColor: COLORS.laranja,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
  },
  btn: {
    marginTop: 10,
  },
  btnText: {
    fontSize: 15,
  },
  errorText: {
    color: COLORS.textoErro,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  errorSupportLink: {
    color: COLORS.laranja,
    textDecorationLine: "underline",
    fontWeight: "700",
  },
  alertSuccess: {
    width: "100%",
    backgroundColor: COLORS.sucessoBg,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  alertSuccessText: {
    color: COLORS.sucessoText,
  },
  backWrapper: {
    marginTop: 12,
  },
  backLink: {
    color: COLORS.laranja,
    textDecorationLine: "underline",
    fontSize: 14,
  },
});
