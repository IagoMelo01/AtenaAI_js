import React, { useCallback, useEffect, useRef, useState } from "react";
import { requestRecordingPermissionsAsync } from "expo-audio";
import {
  Alert,
  ActivityIndicator,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import ChatHeader from "../components/chat/ChatHeader";
import { useAuth } from "../contexts/AuthContext";
import { sendReport } from "../lib/api";

const CHAT_ID = "93e14a39-37e0-47fb-8e7d-18240b71de19";
const CHAT_URL = `https://admin.toolzz.ai/embed/${CHAT_ID}`;

export default function Chat() {
  const navigation = useNavigation();
  const webViewRef = useRef(null);
  const iosMicAlertShown = useRef(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [micPermissionStatus, setMicPermissionStatus] = useState("pending");
  const { user } = useAuth();
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reporting, setReporting] = useState(false);
  const canSubmitReport = reportReason.trim().length > 0 && !reporting;

  const handleBack = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
      return;
    }
    navigation.goBack();
  };

  const handleReload = () => {
    setLoading(true);
    setReloadKey((prev) => prev + 1);
  };

  const openReportModal = () => {
    setReportModalVisible(true);
  };

  const closeReportModal = () => {
    if (reporting) {
      return;
    }
    setReportReason("");
    setReportModalVisible(false);
  };

  const handleSubmitReport = async () => {
    const reason = reportReason.trim();
    if (!reason) {
      return;
    }

    setReporting(true);
    try {
      const studentIdentifier =
        user?.matricula ?? user?.ra ?? user?.userId ?? "desconhecido";
      const studentName = user?.nome ?? user?.name ?? "desconhecido";
      const payload = `RA: ${studentIdentifier}; nome: ${studentName}; origem: chat; timestamp: ${new Date().toISOString()}; motivo: ${reason}`;
      const response = await sendReport(payload);
      Alert.alert(
        "Denúncia enviada",
        response?.message || "Recebemos sua denúncia e vamos avaliar.",
      );
      setReportReason("");
      setReportModalVisible(false);
    } catch (error) {
      Alert.alert(
        "Erro ao enviar denúncia",
        error?.message || "Não foi possível enviar a denúncia. Tente novamente.",
      );
    } finally {
      setReporting(false);
    }
  };

  const requestMicPermission = useCallback(async () => {
    try {
      const { status } = await requestRecordingPermissionsAsync();
      setMicPermissionStatus(status === "granted" ? "granted" : "denied");
    } catch (error) {
      console.warn("Could not request microphone permission", error);
      setMicPermissionStatus("denied");
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === "ios") {
      if (!iosMicAlertShown.current) {
        iosMicAlertShown.current = true;
        Alert.alert(
          "Permissão para microfone (opcional)",
          "Se você quiser enviar mensagens de voz para a AtenaAI, o app precisará acessar o seu microfone. \nVocê também pode continuar usando o chat normalmente apenas por texto, sem conceder essa permissão. \nO áudio só é capturado quando você escolhe usar o botão de voz.\n\nIf you want to send voice messages to AtenaAI, the app will need access to your microphone.\nYou can also keep using the chat with text only, without granting this permission.\nAudio is only captured when you choose to use the voice button.",
          [
            // {
            //   text: "Cancelar",
            //   style: "cancel",
            //   onPress: () => setMicPermissionStatus("denied"),
            // },
            {
              text: "Continuar",
              onPress: requestMicPermission,
            },
          ],
          { cancelable: true },
        );
      }
    } else {
      requestMicPermission();
    }
  }, [requestMicPermission]);

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.screen}>
        <View style={styles.headerWrapper}>
          <ChatHeader
            onBack={handleBack}
            canGoBack={canGoBack}
            onReload={handleReload}
            loading={loading}
          />
        </View>

        <View style={styles.body}>
          <WebView
            key={`chat-${reloadKey}`}
            ref={webViewRef}
            source={{ uri: CHAT_URL }}
            onNavigationStateChange={(navState) =>
              setCanGoBack(navState.canGoBack)
            }
            onLoadEnd={() => setLoading(false)}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            allowsProtectedMedia={true}
            mediaPlaybackRequiresUserAction={false}
            geolocationEnabled={true}
            allowFileAccess={true}
            androidCameraAccess={true}
            androidMicrophoneAccess={true}
            onPermissionRequest={(event) => {
              // Autoriza o uso de microfone/câmera dentro do WebView (Android)
              const resources = event.nativeEvent.resources;
              if (
                resources.includes("android.webkit.resource.AUDIO_CAPTURE") ||
                resources.includes("android.webkit.resource.VIDEO_CAPTURE")
              ) {
                event.grant();
              }
            }}
          />

          {/* {micPermissionStatus === "denied" && (
            <View style={styles.permissionOverlay} pointerEvents="box-none">
              <Text style={styles.permissionTitle}>Microfone necessário</Text>
              <Text style={styles.permissionMessage}>
                Autorize o microfone para que o botão dentro do chat funcione.
              </Text>
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={requestMicPermission}
              >
                <Text style={styles.permissionButtonText}>Conceder acesso</Text>
              </TouchableOpacity>
            </View>
          )} */}
          <TouchableOpacity
            style={styles.reportButton}
            onPress={openReportModal}
            accessibilityLabel="Denunciar conteúdo"
          >
            <Text style={styles.reportButtonText}>Denunciar conteúdo</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={reportModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeReportModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Denunciar conteúdo</Text>
            <Text style={styles.modalDescription}>
              Descreva brevemente por que o conteúdo da conversa está impróprio
              ou ofensivo para que possamos analisar.
            </Text>
            <TextInput
              style={styles.modalInput}
              value={reportReason}
              onChangeText={setReportReason}
              placeholder="Explique o problema aqui..."
              placeholderTextColor="rgba(0,0,0,0.35)"
              multiline
              numberOfLines={3}
              editable={!reporting}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalAction, styles.modalCancel]}
                onPress={closeReportModal}
                disabled={reporting}
              >
                <Text style={[styles.modalActionText, styles.modalCancelText]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalAction,
                  styles.modalSubmit,
                  !canSubmitReport && styles.modalDisabled,
                ]}
                onPress={handleSubmitReport}
                disabled={!canSubmitReport}
              >
                {reporting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalActionText}>Enviar denúncia</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },
  screen: {
    flex: 1,
    width: "100%",
  },
  headerWrapper: {
    width: "100%",
  },
  body: {
    flex: 1,
    width: "110%",
    marginLeft: -15,
    minHeight: 0,
    backgroundColor: "#000",
    position: "relative",
  },
  permissionOverlay: {
    position: "absolute",
    top: 48,
    right: 16,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  permissionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  permissionMessage: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 8,
  },
  permissionButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  permissionButtonText: {
    color: "#000",
    fontWeight: "600",
  },
  reportButton: {
    position: "absolute",
    bottom: 24,
    right: "auto",
    left: "auto",
    borderRadius: 999,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 9,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  reportButtonText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 13,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: "#222",
    marginBottom: 12,
  },
  modalInput: {
    minHeight: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 16,
    backgroundColor: "#f7f7f7",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalAction: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginLeft: 8,
  },
  modalActionText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#fff",
  },
  modalCancel: {
    backgroundColor: "#e0e0e0",
    marginLeft: 0,
    marginRight: 8,
  },
  modalSubmit: {
    backgroundColor: "#0c64ff",
  },
  modalCancelText: {
    color: "#000",
  },
  modalDisabled: {
    opacity: 0.5,
  },
});
