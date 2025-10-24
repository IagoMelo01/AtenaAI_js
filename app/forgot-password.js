import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    if (submitting) return;

    if (!email.trim()) {
      setErrorMessage("Informe um e-mail cadastrado.");
      return;
    }

    try {
      setErrorMessage("");
      setSubmitting(true);
      await requestPasswordReset(email.trim());
      Alert.alert(
        "E-mail enviado",
        "Enviamos um link de redefinição de senha para o seu endereço de e-mail."
      );
      router.back();
    } catch (error) {
      setErrorMessage(error.message || "Não foi possível enviar o e-mail.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", default: undefined })}
        style={styles.wrapper}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Recuperar acesso</Text>
          <Text style={styles.description}>
            Digite o e-mail cadastrado para receber o link de redefinição de senha.
          </Text>

          <Text style={styles.label}>E-mail institucional</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="aluno@atenas.edu.br"
            placeholderTextColor="#7A869A"
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
          />

          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Enviar link</Text>
            )}
          </Pressable>

          <Link href="/" style={styles.link}>
            Voltar para o login
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0B4FA2",
  },
  wrapper: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0B4FA2",
  },
  description: {
    marginTop: 8,
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 20,
  },
  label: {
    marginTop: 24,
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  input: {
    marginTop: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    fontSize: 16,
    color: "#1F2937",
  },
  button: {
    marginTop: 24,
    borderRadius: 10,
    paddingVertical: 14,
    backgroundColor: "#0B4FA2",
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  link: {
    marginTop: 18,
    alignSelf: "center",
    color: "#0B4FA2",
    fontWeight: "600",
  },
  error: {
    marginTop: 12,
    color: "#B91C1C",
    fontWeight: "600",
  },
});
