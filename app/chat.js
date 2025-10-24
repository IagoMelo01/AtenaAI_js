import { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";

const INITIAL_MESSAGES = [
  {
    id: "1",
    from: "support",
    text: "Olá! Como posso ajudar hoje?",
    timestamp: "08:30",
  },
];

export default function ChatScreen() {
  const { user } = useAuth();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [message, setMessage] = useState("");

  if (!user) {
    return <Redirect href="/" />;
  }

  const conversation = useMemo(
    () =>
      messages.map((item) => ({
        ...item,
        role: item.from === "support" ? "Atendente" : user.name.split(" ")[0],
      })),
    [messages, user]
  );

  const handleSend = () => {
    if (!message.trim()) return;

    const userMessage = {
      id: `${Date.now()}-user`,
      from: "user",
      text: message.trim(),
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };

    const supportReply = {
      id: `${Date.now()}-support`,
      from: "support",
      text: "Recebemos sua mensagem e entraremos em contato em breve!",
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage, supportReply]);
    setMessage("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: "padding", default: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 80, android: 0 })}
      >
        <FlatList
          data={conversation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const isUser = item.from === "user";
            return (
              <View
                style={[styles.message, isUser ? styles.messageUser : styles.messageSupport]}
              >
                <Text
                  style={[styles.messageRole, !isUser && styles.messageRoleSupport]}
                >
                  {item.role}
                </Text>
                <Text
                  style={[styles.messageText, !isUser && styles.messageTextSupport]}
                >
                  {item.text}
                </Text>
                <Text
                  style={[styles.messageTimestamp, !isUser && styles.messageTimestampSupport]}
                >
                  {item.timestamp}
                </Text>
              </View>
            );
          }}
        />

        <View style={styles.inputRow}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            style={styles.input}
            placeholder="Digite sua mensagem"
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={280}
          />
          <Pressable
            style={({ pressed }) => [styles.sendButton, pressed && styles.sendButtonPressed]}
            onPress={handleSend}
          >
            <Text style={styles.sendText}>Enviar</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  flex: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  message: {
    borderRadius: 14,
    padding: 14,
    maxWidth: "85%",
    marginBottom: 12,
  },
  messageUser: {
    alignSelf: "flex-end",
    backgroundColor: "#0B4FA2",
  },
  messageSupport: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  messageRole: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
  },
  messageRoleSupport: {
    color: "#2563EB",
  },
  messageText: {
    fontSize: 15,
    color: "#ffffff",
  },
  messageTextSupport: {
    color: "#1F2937",
  },
  messageTimestamp: {
    marginTop: 8,
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
  },
  messageTimestampSupport: {
    color: "#6B7280",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 16,
    backgroundColor: "#ffffff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#1F2937",
  },
  sendButton: {
    backgroundColor: "#0B4FA2",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 12,
  },
  sendButtonPressed: {
    opacity: 0.85,
  },
  sendText: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
