import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import GradientButton from "../ui/GradientButton";
import { COLORS, GRADIENTS } from "../../constants/colors";

export default function ProfileInfoCard({
  infoItems,
  email,
  onEmailChange,
  onSave,
  onLogout,
  saving,
  loggingOut,
  error,
  success,
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Informações do aluno</Text>
      {infoItems.length === 0 ? (
        <Text style={styles.emptyText}>Não encontramos outras informações no momento.</Text>
      ) : (
        infoItems.map((item) => (
          <View key={item.label} style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>{item.label}</Text>
            <Text style={styles.fieldValue}>{String(item.value)}</Text>
          </View>
        ))
      )}

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>E-mail cadastrado</Text>
      <Text style={styles.helperText}>Atualize seu e-mail para receber comunicados importantes.</Text>
      <TextInput
        value={email}
        onChangeText={onEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="seu-email@exemplo.com"
        placeholderTextColor="rgba(255,255,255,0.6)"
        style={styles.input}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {success ? <Text style={styles.successText}>{success}</Text> : null}

      <View style={styles.actions}>
        <GradientButton
          title="Salvar e-mail"
          onPress={onSave}
          loading={saving}
          disabled={saving}
          style={styles.saveButton}
        />
        <GradientButton
          title="Sair"
          onPress={onLogout}
          loading={loggingOut}
          disabled={loggingOut}
          colors={GRADIENTS.danger}
          style={styles.logoutButton}
          textStyle={styles.logoutText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(4, 81, 184, 0.25)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  emptyText: {
    color: "#fff",
    opacity: 0.8,
    marginBottom: 16,
  },
  fieldRow: {
    marginBottom: 10,
  },
  fieldLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    marginBottom: 4,
  },
  fieldValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 18,
  },
  helperText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    marginBottom: 12,
  },
  input: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    color: "#fff",
    marginBottom: 12,
  },
  errorText: {
    color: COLORS.textoErro,
    marginBottom: 8,
  },
  successText: {
    color: COLORS.sucessoText,
    backgroundColor: COLORS.sucessoBg,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  actions: {
    marginTop: 8,
    width: "100%",
  },
  saveButton: {
    borderRadius: 20,
    paddingVertical: 14,
    marginBottom: 12,
  },
  logoutButton: {
    borderRadius: 20,
    paddingVertical: 14,
  },
  logoutText: {
    fontSize: 16,
  },
});
