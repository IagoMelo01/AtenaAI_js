import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../contexts/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0B4FA2" },
          headerTintColor: "#ffffff",
          contentStyle: { backgroundColor: "#F5F7FB" },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Entrar", headerShown: false }} />
        <Stack.Screen name="home" options={{ title: "Início" }} />
        <Stack.Screen name="forgot-password" options={{ title: "Recuperar acesso" }} />
        <Stack.Screen name="profile" options={{ title: "Meu perfil" }} />
        <Stack.Screen name="chat" options={{ title: "Chat" }} />
      </Stack>
    </AuthProvider>
  );
}
