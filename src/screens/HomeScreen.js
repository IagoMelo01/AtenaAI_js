import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { useApp } from '../context/AppContext';

export default function HomeScreen() {
  const { user, logout } = useApp();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image source={require('../../assets/icon.png')} style={styles.avatar} />
        <Text style={styles.title}>Bem-vindo(a), {user?.name}!</Text>
        <Text style={styles.subtitle}>
          Este é um exemplo simples de portal acadêmico pronto para build de produção.
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Matrícula</Text>
          <Text style={styles.infoValue}>{user?.matricula}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>E-mail institucional</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>

        <PrimaryButton title="Sair" onPress={logout} style={styles.logout} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 24,
    paddingVertical: 48,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 420,
    shadowColor: '#14213D',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#14213D',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#475569',
    marginBottom: 24,
    textAlign: 'center',
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3F51B5',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  infoValue: {
    fontSize: 16,
    color: '#14213D',
  },
  logout: {
    marginTop: 12,
    alignSelf: 'stretch',
  },
});
