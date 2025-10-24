import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import { AppProvider, useApp } from './src/context/AppContext';

function AppContent() {
  const { user, screen } = useApp();

  if (user) {
    return <HomeScreen />;
  }

  if (screen === 'forgot') {
    return <ForgotPasswordScreen />;
  }

  return <LoginScreen />;
}

export default function App() {
  return (
    <AppProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <View style={styles.container}>
          <AppContent />
        </View>
      </SafeAreaView>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
  },
});
