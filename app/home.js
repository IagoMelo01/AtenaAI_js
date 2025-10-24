import React, { useMemo } from "react";
import { Platform, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import ScreenBackground from "../components/layout/ScreenBackground";
import HomeHeader from "../components/home/HomeHeader";
import HeroSection from "../components/home/HeroSection";
import HomeFooter from "../components/home/HomeFooter";
import { COLORS } from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";

const scrollPadding = Platform.OS === "ios" ? 32 : 24;

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  const displayName = useMemo(() => {
    const tempName =
      (user?.name && String(user.name).trim()) ||
      (user?.nome && String(user.nome).trim()) ||
      (user?.matricula && String(user.matricula).trim()) ||
      (user?.email && String(user.email).trim()) ||
      null;

    return tempName ? tempName.split(" ")[0] : null;
  }, [user]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="light-content" />
      <ScreenBackground overlayColor={COLORS.overlayLight}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <HomeHeader onProfilePress={() => router.push("/profile")} />
          <View style={styles.heroSpacing}>
            <HeroSection displayName={displayName} onChatPress={() => router.push("/chat")} />
          </View>
          <HomeFooter />
        </ScrollView>
      </ScreenBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000" },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: scrollPadding,
  },
  heroSpacing: {
    paddingTop: 16,
  },
});
