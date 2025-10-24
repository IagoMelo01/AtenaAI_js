import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

export default function ProfileScreen() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [updating, setUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!user) {
    return <Redirect href="/" />;
  }

  const handleSave = async () => {
    if (updating) return;

    if (!name.trim() || !email.trim()) {
      setErrorMessage("Informe nome e e-mail válidos.");
      return;
    }

    try {
      setUpdating(true);
      setErrorMessage("");
      await updateProfile({ name: name.trim(), email: email.trim() });
      Alert.alert("Perfil atualizado", "Suas informações foram salvas com sucesso.");
    } catch (error) {
      setErrorMessage(error.message || "Não foi possível atualizar o perfil.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Informações pessoais</Text>
        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholder="Nome completo"
        />

        <Text style={styles.label}>E-mail institucional</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholder="aluno@atenas.edu.br"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Matrícula</Text>
        <Text style={styles.readonly}>{user.matricula}</Text>

        <Text style={styles.label}>Curso</Text>
        <Text style={styles.readonly}>{user.course}</Text>

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={handleSave}
          disabled={updating}
        >
          {updating ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Salvar alterações</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F5F7FB",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0B4FA2",
    marginBottom: 16,
  },
  label: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  input: {
    marginTop: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  readonly: {
    marginTop: 6,
    fontSize: 16,
    color: "#4B5563",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
  },
  button: {
    marginTop: 24,
    borderRadius: 10,
    paddingVertical: 14,
    backgroundColor: "#0B4FA2",
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  error: {
    marginTop: 12,
    color: "#B91C1C",
    fontWeight: "600",
  },
});
