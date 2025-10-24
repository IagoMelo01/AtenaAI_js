import React, { useMemo } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginAtena from './app/LoginAtena';
import ForgotPasswordView from './app/ForgotPassword';
import HomeScreen from './app/home';
import ProfileScreen from './app/profile';
import ChatScreen from './app/chat';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { forgotPassword } from './lib/api';

const Stack = createNativeStackNavigator();

function LoginScreen() {
  const { login } = useAuth();

  return <LoginAtena onLogin={login} />;
}

function ForgotPasswordScreen() {
  const sendReset = (email) => forgotPassword({ email });
  return <ForgotPasswordView onSendReset={sendReset} />;
}

function RootNavigator() {
  const { user } = useAuth();

  const navigationTheme = useMemo(() => ({
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'black',
    },
  }), []);

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        key={user ? 'app-stack' : 'auth-stack'}
      >
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
