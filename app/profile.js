import React, { useEffect, useMemo, useState } from "react";
import { Linking, ScrollView, StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import ScreenBackground from "../components/layout/ScreenBackground";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileInfoCard from "../components/profile/ProfileInfoCard";
import ProfileSupportBox from "../components/profile/ProfileSupportBox";
import { COLORS } from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";

const SUPPORT_URL = "https://wa.me/3833651164";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, updateEmail, logout } = useAuth();

  const [email, setEmail] = useState(user?.email ? String(user.email) : "");
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (user) {
      setEmail(user.email ? String(user.email) : "");
    }
  }, [user]);

  const infoItems = useMemo(
    () =>
      [
        { label: "Nome", value: user?.name ?? user?.nome },
        { label: "Matrícula", value: user?.matricula },
        { label: "ID", value: user?.id != null ? String(user.id) : null },
      ].filter((item) => item.value != null && String(item.value).trim().length > 0),
    [user],
  );

  const handleSave = async () => {
    if (!email.trim()) {
      setError("Informe um e-mail válido.");
      setSuccess(null);
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const updated = await updateEmail(email.trim());
      setEmail(updated.email ? String(updated.email) : email.trim());
      setSuccess("E-mail atualizado com sucesso!");
    } catch (err) {
      setError(err?.message || "Não foi possível atualizar o e-mail. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    try {
      setLoggingOut(true);
      logout();
    } finally {
      setLoggingOut(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="light-content" />
      <ScreenBackground
        imageSource={require("../assets/images/background.jpg")}
        overlayColors={[COLORS.overlayStrong, COLORS.overlayStrong]}
        style={styles.background}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <ProfileHeader onBack={() => navigation.goBack()} />

          <ProfileInfoCard
            infoItems={infoItems}
            email={email}
            onEmailChange={setEmail}
            onSave={handleSave}
            onLogout={handleLogout}
            saving={saving}
            loggingOut={loggingOut}
            error={error}
            success={success}
          />

          <ProfileSupportBox onPressSupport={() => Linking.openURL(SUPPORT_URL)} />
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
    paddingHorizontal: 20,
    paddingBottom: 32,
    width: "100%",
  },
  background: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
