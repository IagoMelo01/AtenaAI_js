import React, { useMemo } from "react";
import { ScrollView, StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import ScreenBackground from "../components/layout/ScreenBackground";
import HomeHeader from "../components/home/HomeHeader";
import HomeHeroSection from "../components/home/HomeHeroSection";
import HomeFooter from "../components/home/HomeFooter";
import { COLORS } from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const navigation = useNavigation();
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
      <ScreenBackground
        overlayColors={[COLORS.overlay, COLORS.overlay]}
        imageSource={require("../assets/images/background.jpg")}
        style={styles.background}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <HomeHeader onPressProfile={() => navigation.navigate("Profile")} />

          <HomeHeroSection displayName={displayName} onPressChat={() => navigation.navigate("Chat")} />

          <HomeFooter
            termsUrl="https://atenas.edu.br/Atena/termos-uso"
            privacyUrl="https://atenas.edu.br/Atena/politica-privacidade"
          />
        </ScrollView>
      </ScreenBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
    width: "100%",
  },
  background: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
