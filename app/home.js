import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Redirect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import { fetchHomeSummary } from "../lib/api";

export default function HomeScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchHomeSummary({ token: user.token });
        setSummary(data);
      } catch (error) {
        setErrorMessage(error.message || "Não foi possível carregar o painel.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  if (!user) {
    return <Redirect href="/" />;
  }

  const quickActions = [
    {
      label: "Meu perfil",
      description: "Dados pessoais e acadêmicos",
      onPress: () => router.push("/profile"),
    },
    {
      label: "Chat com suporte",
      description: "Fale com a central Atena",
      onPress: () => router.push("/chat"),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user.name.split(" ")[0]} 👋</Text>
          <Text style={styles.subtitle}>Seja bem-vindo(a) ao seu painel acadêmico.</Text>
        </View>
        <Pressable style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0B4FA2" />
        </View>
      ) : errorMessage ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Ops!</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      ) : summary ? (
        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Próxima aula</Text>
            <Text style={styles.cardHighlight}>{summary.nextClass.title}</Text>
            <Text style={styles.cardDetail}>{summary.nextClass.when}</Text>
            <Text style={styles.cardDetail}>{summary.nextClass.location}</Text>
          </View>

          <View style={[styles.card, styles.cardSpacing]}>
            <Text style={styles.cardTitle}>Avisos recentes</Text>
            {summary.notices.length === 0 ? (
              <Text style={styles.cardDetail}>Tudo certo por aqui!</Text>
            ) : (
              summary.notices.map((notice) => (
                <View key={notice.id} style={styles.noticeItem}>
                  <Text style={styles.noticeTitle}>{notice.title}</Text>
                  <Text style={styles.noticeDescription}>{notice.description}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      ) : null}

      <Text style={styles.sectionTitle}>Acessos rápidos</Text>
      <FlatList
        data={quickActions}
        keyExtractor={(item) => item.label}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickList}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.quickItem, pressed && styles.quickItemPressed]}
            onPress={item.onPress}
          >
            <Text style={styles.quickTitle}>{item.label}</Text>
            <Text style={styles.quickDescription}>{item.description}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0B4FA2",
  },
  subtitle: {
    marginTop: 4,
    color: "#4B5563",
  },
  logoutButton: {
    backgroundColor: "#E0E7FF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  logoutText: {
    color: "#1D4ED8",
    fontWeight: "600",
  },
  loadingContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  errorCard: {
    marginTop: 32,
    padding: 20,
    borderRadius: 14,
    backgroundColor: "#FEE2E2",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#B91C1C",
  },
  errorMessage: {
    marginTop: 6,
    color: "#7F1D1D",
    lineHeight: 20,
  },
  cardsContainer: {
    marginTop: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardSpacing: {
    marginTop: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  cardHighlight: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8,
    color: "#0B4FA2",
  },
  cardDetail: {
    marginTop: 6,
    color: "#4B5563",
  },
  noticeItem: {
    marginTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
  },
  noticeTitle: {
    fontWeight: "600",
    color: "#1F2937",
  },
  noticeDescription: {
    color: "#4B5563",
    marginTop: 4,
  },
  sectionTitle: {
    marginTop: 32,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  quickList: {
    paddingRight: 12,
  },
  quickItem: {
    width: 220,
    marginRight: 12,
    backgroundColor: "#0B4FA2",
    borderRadius: 16,
    padding: 18,
  },
  quickItemPressed: {
    opacity: 0.85,
  },
  quickTitle: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  quickDescription: {
    color: "rgba(255,255,255,0.85)",
    marginTop: 8,
    lineHeight: 18,
  },
});
