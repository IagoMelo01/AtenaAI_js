import React, { useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import TextField from '../components/TextField';
import { useApp } from '../context/AppContext';

export default function LoginScreen() {
  const { login, goTo, loading } = useApp();
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const passwordRef = useRef(null);

  const handleSubmit = async () => {
    setError('');
    try {
      await login({ matricula, password });
    } catch (err) {
      setError(err.message || 'Não foi possível fazer login.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.branding}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} />
        <Text style={styles.title}>Portal Atena</Text>
        <Text style={styles.subtitle}>Acesse com sua matrícula para continuar</Text>
      </View>

      <View style={styles.form}>
        <TextField
          label="Matrícula"
          value={matricula}
          onChangeText={setMatricula}
          keyboardType="numeric"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="000000"
          style={styles.field}
        />

        <TextField
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          inputRef={passwordRef}
          placeholder="••••••"
          style={styles.field}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton title="Entrar" onPress={handleSubmit} loading={loading} style={styles.submit} />

        <Text style={styles.helper} onPress={() => goTo('forgot')}>
          Esqueci minha senha
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
  branding: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: 16,
    borderRadius: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#14213D',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#14213D',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  field: {
    marginBottom: 16,
  },
  submit: {
    marginTop: 12,
  },
  helper: {
    marginTop: 18,
    color: '#3F51B5',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  error: {
    color: '#D32F2F',
    fontSize: 14,
    marginBottom: 4,
  },
});
