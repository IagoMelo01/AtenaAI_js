import React, { useRef, useState } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import ChatHeader from "../components/chat/ChatHeader";
import ChatWebView from "../components/chat/ChatWebView";

const CHAT_URL = "https://admin.toolzz.ai/embed/93e14a39-37e0-47fb-8e7d-18240b71de19";

export default function Chat() {
  const navigation = useNavigation();
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);

  const handleBack = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
      return;
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <StatusBar barStyle="light-content" />
      <ChatHeader onBack={handleBack} canGoBack={canGoBack} />
      <ChatWebView ref={webViewRef} uri={CHAT_URL} onCanGoBackChange={setCanGoBack} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },
});
