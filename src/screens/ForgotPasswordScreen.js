import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import TextField from '../components/TextField';
import { useApp } from '../context/AppContext';

export default function ForgotPasswordScreen() {
  const { sendPasswordReset, goTo, loading, message } = useApp();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    try {
      await sendPasswordReset(email);
    } catch (err) {
      setError(err.message || 'Não foi possível enviar o e-mail.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Recuperar senha</Text>
        <Text style={styles.description}>
          Informe o e-mail cadastrado para receber o link de redefinição de senha.
        </Text>

        <TextField
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
          placeholder="aluno@atenas.br"
          style={styles.field}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {message ? <Text style={styles.success}>{message}</Text> : null}

        <PrimaryButton title="Enviar link" onPress={handleSubmit} loading={loading} />

        <Text style={styles.helper} onPress={() => goTo('login')}>
          Voltar para o login
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#14213D',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#14213D',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 20,
  },
  field: {
    marginBottom: 16,
  },
  helper: {
    marginTop: 24,
    color: '#3F51B5',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  error: {
    color: '#D32F2F',
    fontSize: 14,
    marginBottom: 12,
  },
  success: {
    color: '#2E7D32',
    fontSize: 14,
    marginBottom: 12,
  },
});
