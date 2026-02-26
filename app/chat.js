import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Linking,
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
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import ScreenBackground from "../components/layout/ScreenBackground";
import { COLORS, GRADIENTS } from "../constants/colors";
import { CHAT_URL, sendChat } from "../src/services/chatApi";

const STORAGE_KEY = "atena.chat.messages.v1";
const HISTORY_LIMIT = 10;
const NETWORK_ERROR_MESSAGE =
  "Falha ao conectar ao servidor. Tente novamente.";
const MISSING_API_ERROR_MESSAGE =
  "Configuração ausente. Defina EXPO_PUBLIC_API_URL para usar o chat.";
const NO_WEB_SEARCH_MESSAGE = "Ok, sem pesquisa na web.";
const INLINE_TOKEN_REGEX =
  /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s]+|\*\*[^*]+\*\*)/g;
const MARKDOWN_LINK_REGEX = /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/;
const URL_REGEX = /^https?:\/\/[^\s]+$/;
const BOLD_REGEX = /^\*\*([^*]+)\*\*$/;

function createMessage(role, content, extras = {}) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    createdAt: new Date().toISOString(),
    ...extras,
  };
}

function toHistory(messages) {
  return messages.slice(-HISTORY_LIMIT).map((message) => ({
    role: message.role,
    content: message.content,
  }));
}

function parseStoredMessages(value) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        (item.role === "user" ||
          item.role === "assistant" ||
          item.role === "system") &&
        typeof item.content === "string" &&
        typeof item.createdAt === "string",
    );
  } catch (error) {
    return [];
  }
}

function getInitialMessages() {
  return [
    createMessage(
      "assistant",
      "Olá! Sou a Atena. Me conte no que você precisa de ajuda.",
    ),
  ];
}

function buildInlineTokens(text) {
  const source = String(text ?? "");
  const parts = source.split(INLINE_TOKEN_REGEX).filter(Boolean);

  return parts.map((part) => {
    const markdownMatch = part.match(MARKDOWN_LINK_REGEX);
    if (markdownMatch) {
      return {
        type: "link",
        label: markdownMatch[1],
        url: markdownMatch[2],
      };
    }

    if (URL_REGEX.test(part)) {
      return {
        type: "link",
        label: part,
        url: part,
      };
    }

    const boldMatch = part.match(BOLD_REGEX);
    if (boldMatch) {
      return {
        type: "bold",
        content: boldMatch[1],
      };
    }

    return {
      type: "text",
      content: part,
    };
  });
}

function FormattedMessageText({ content, textStyle, boldStyle, linkStyle }) {
  const rows = String(content ?? "").split("\n");

  const openLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.warn("Could not open link", error);
    }
  };

  return (
    <View style={styles.formattedTextWrapper}>
      {rows.map((row, rowIndex) => (
        <Text key={`row-${rowIndex}`} style={textStyle}>
          {buildInlineTokens(row).map((token, tokenIndex) => {
            if (token.type === "bold") {
              return (
                <Text key={`token-${rowIndex}-${tokenIndex}`} style={boldStyle}>
                  {token.content}
                </Text>
              );
            }

            if (token.type === "link") {
              return (
                <Text
                  key={`token-${rowIndex}-${tokenIndex}`}
                  style={linkStyle}
                  onPress={() => openLink(token.url)}
                >
                  {token.label}
                </Text>
              );
            }

            return (
              <Text key={`token-${rowIndex}-${tokenIndex}`}>{token.content}</Text>
            );
          })}
        </Text>
      ))}
    </View>
  );
}

export default function Chat() {
  const navigation = useNavigation();
  const listRef = useRef(null);
  const [messages, setMessages] = useState(getInitialMessages);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [pendingWebRequest, setPendingWebRequest] = useState(null);
  const [isHydrated, setIsHydrated] = useState(Platform.OS !== "web");

  const hasApiUrl = Boolean(CHAT_URL);

  const handleNewChat = useCallback(() => {
    setMessages(getInitialMessages());
    setDraft("");
    setPendingWebRequest(null);
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }

    try {
      const storage = globalThis?.localStorage;
      const stored = storage?.getItem(STORAGE_KEY);
      const storedMessages = parseStoredMessages(stored);
      if (storedMessages.length > 0) {
        setMessages(storedMessages);
      }
    } catch (error) {
      console.warn("Could not restore chat history", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web" || !isHydrated) {
      return;
    }

    try {
      const storage = globalThis?.localStorage;
      storage?.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-100)));
    } catch (error) {
      console.warn("Could not persist chat history", error);
    }
  }, [isHydrated, messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 0);

    return () => clearTimeout(timer);
  }, [messages, isSending]);

  const handleSend = useCallback(async () => {
    const text = draft.trim();

    if (!text || isSending) {
      return;
    }

    if (!hasApiUrl) {
      setMessages((current) => [
        ...current,
        createMessage("system", MISSING_API_ERROR_MESSAGE),
      ]);
      setPendingWebRequest(null);
      return;
    }

    const userMessage = createMessage("user", text);
    const historyWithUserMessage = [...messages, userMessage];
    const historySnapshot = toHistory(historyWithUserMessage);

    setMessages(historyWithUserMessage);
    setDraft("");
    setIsSending(true);
    setPendingWebRequest(null);

    try {
      const response = await sendChat({
        message: text,
        history: historySnapshot,
        confirm_web: true,
      });

      setMessages((current) => [
        ...current,
        createMessage("assistant", response.answer, {
          usedWeb: response.used_web,
        }),
      ]);

      if (response.should_web_next) {
        setPendingWebRequest({
          lastUserMessage: text,
          historySnapshot,
        });
      }
    } catch (error) {
      const errorMessage =
        error?.message === "API_URL_MISSING"
          ? MISSING_API_ERROR_MESSAGE
          : NETWORK_ERROR_MESSAGE;

      setMessages((current) => [
        ...current,
        createMessage("system", errorMessage),
      ]);
      setPendingWebRequest(null);
    } finally {
      setIsSending(false);
    }
  }, [draft, hasApiUrl, isSending, messages]);

  const handleConfirmWebSearch = useCallback(async () => {
    if (!pendingWebRequest || isSending) {
      return;
    }

    setIsSending(true);

    try {
      const response = await sendChat({
        message: pendingWebRequest.lastUserMessage,
        history: pendingWebRequest.historySnapshot,
        confirm_web: false,
      });

      setMessages((current) => [
        ...current,
        createMessage("assistant", response.answer, {
          usedWeb: response.used_web,
        }),
      ]);
    } catch (error) {
      const errorMessage =
        error?.message === "API_URL_MISSING"
          ? MISSING_API_ERROR_MESSAGE
          : NETWORK_ERROR_MESSAGE;

      setMessages((current) => [
        ...current,
        createMessage("system", errorMessage),
      ]);
    } finally {
      setPendingWebRequest(null);
      setIsSending(false);
    }
  }, [isSending, pendingWebRequest]);

  const handleSkipWebSearch = useCallback(() => {
    if (!pendingWebRequest || isSending) {
      return;
    }

    setMessages((current) => [
      ...current,
      createMessage("system", NO_WEB_SEARCH_MESSAGE),
    ]);
    setPendingWebRequest(null);
  }, [isSending, pendingWebRequest]);

  const handleInputKeyPress = useCallback(
    (event) => {
      if (Platform.OS !== "web") {
        return;
      }

      const nativeEvent = event?.nativeEvent;
      const isEnter = nativeEvent?.key === "Enter";
      const isShiftPressed = Boolean(nativeEvent?.shiftKey);

      if (isEnter && !isShiftPressed) {
        event.preventDefault?.();
        handleSend();
      }
    },
    [handleSend],
  );

  const renderedMessages = useMemo(() => {
    if (!isSending) {
      return messages;
    }

    return [
      ...messages,
      {
        id: "assistant-typing",
        role: "assistant",
        content: "digitando...",
        createdAt: new Date().toISOString(),
        typing: true,
      },
    ];
  }, [isSending, messages]);

  const canSend = hasApiUrl && draft.trim().length > 0 && !isSending;

  const renderMessage = ({ item }) => {
    const isUser = item.role === "user";
    const isAssistant = item.role === "assistant";
    const isSystem = item.role === "system";

    return (
      <View
        style={[
          styles.messageRow,
          isUser && styles.userRow,
          isAssistant && styles.assistantRow,
          isSystem && styles.systemRow,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUser && styles.userBubble,
            isAssistant && styles.assistantBubble,
            isSystem && styles.systemBubble,
          ]}
        >
          {item.typing ? (
            <View style={styles.typingRow}>
              <ActivityIndicator size="small" color="#111111" />
              <Text style={[styles.typingText, styles.assistantMessageText]}>
                Atena está digitando...
              </Text>
            </View>
          ) : (
            <FormattedMessageText
              content={item.content}
              textStyle={[
                styles.messageText,
                isUser && styles.userMessageText,
                isAssistant && styles.assistantMessageText,
                isSystem && styles.systemMessageText,
              ]}
              boldStyle={styles.boldMessageText}
              linkStyle={[
                styles.linkMessageText,
                isUser && styles.userLinkMessageText,
                isAssistant && styles.assistantLinkMessageText,
                isSystem && styles.systemLinkMessageText,
              ]}
            />
          )}

          {item.usedWeb ? (
            <View style={styles.webBadge}>
              <Text style={styles.webBadgeText}>Pesquisado na web</Text>
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar barStyle="light-content" />

      <ScreenBackground
        overlayColors={[COLORS.overlay, COLORS.overlayStrong]}
        imageSource={require("../assets/images/background.jpg")}
        style={styles.background}
      >
        <View style={styles.screenContent}>
          <LinearGradient
            colors={GRADIENTS.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.header}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={22} color="#fff" />
              <Text style={styles.backText}>Voltar</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Chat Atena</Text>
            <TouchableOpacity
              onPress={handleNewChat}
              style={styles.newChatButton}
              disabled={isSending}
            >
              <Text style={styles.newChatButtonText}>Novo Chat</Text>
            </TouchableOpacity>
          </LinearGradient>

          {!hasApiUrl ? (
            <View style={styles.configErrorBox}>
              <Text style={styles.configErrorText}>{MISSING_API_ERROR_MESSAGE}</Text>
            </View>
          ) : null}

          <FlatList
            ref={listRef}
            data={renderedMessages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesContent}
            style={styles.messagesList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />

          {pendingWebRequest ? (
            <View style={styles.pendingWebCard}>
              <Text style={styles.pendingWebText}>
                Essa pergunta precisa de pesquisa na web. Deseja pesquisar?
              </Text>
              <View style={styles.pendingWebActions}>
                <TouchableOpacity
                  style={[styles.pendingWebButton, styles.pendingWebPrimary]}
                  onPress={handleConfirmWebSearch}
                  disabled={isSending}
                >
                  <Text style={styles.pendingWebPrimaryText}>Pesquisar agora</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.pendingWebButton, styles.pendingWebSecondary]}
                  onPress={handleSkipWebSearch}
                  disabled={isSending}
                >
                  <Text style={styles.pendingWebSecondaryText}>Não pesquisar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <View style={styles.inputContainer}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Digite sua mensagem..."
                placeholderTextColor="rgba(255,255,255,0.6)"
                style={styles.input}
                multiline
                onKeyPress={handleInputKeyPress}
                editable={hasApiUrl && !isSending}
              />
              <TouchableOpacity
                style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
                onPress={handleSend}
                disabled={!canSend}
              >
                {isSending ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.sendButtonText}>Enviar</Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScreenBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  background: {
    flex: 1,
    width: "100%",
  },
  screenContent: {
    flex: 1,
    width: "100%",
  },
  header: {
    width: "100%",
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  newChatButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    minWidth: 74,
    alignItems: "center",
  },
  newChatButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  configErrorBox: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "rgba(244,117,0,0.18)",
    borderWidth: 1,
    borderColor: "rgba(244,117,0,0.55)",
  },
  configErrorText: {
    color: "#fff",
    fontSize: 13,
    lineHeight: 18,
  },
  messagesList: {
    flex: 1,
    width: "100%",
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 24,
  },
  messageRow: {
    width: "100%",
    marginBottom: 12,
  },
  userRow: {
    alignItems: "flex-end",
  },
  assistantRow: {
    alignItems: "flex-start",
  },
  systemRow: {
    alignItems: "center",
  },
  messageBubble: {
    maxWidth: "86%",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {
    backgroundColor: COLORS.azul,
    borderTopRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
    borderTopLeftRadius: 4,
  },
  systemBubble: {
    maxWidth: "100%",
    backgroundColor: "rgba(255,77,79,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,77,79,0.5)",
  },
  messageText: {
    color: "#fff",
    fontSize: 17,
    lineHeight: 26,
  },
  userMessageText: {
    color: "#fff",
  },
  assistantMessageText: {
    color: "#111111",
  },
  boldMessageText: {
    fontWeight: "800",
  },
  linkMessageText: {
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  userLinkMessageText: {
    color: "#d8ebff",
  },
  assistantLinkMessageText: {
    color: "#0a5ac2",
  },
  systemLinkMessageText: {
    color: "#ffd5d6",
  },
  systemMessageText: {
    color: "#ffd5d6",
  },
  formattedTextWrapper: {
    width: "100%",
    gap: 2,
  },
  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  typingText: {
    color: "#fff",
    fontSize: 14,
  },
  webBadge: {
    alignSelf: "flex-start",
    marginTop: 8,
    borderRadius: 999,
    backgroundColor: "rgba(9,132,25,0.25)",
    borderWidth: 1,
    borderColor: "rgba(9,132,25,0.75)",
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  webBadgeText: {
    color: "#00300aff",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  pendingWebCard: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
  },
  pendingWebText: {
    color: "#111",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
    fontWeight: "600",
  },
  pendingWebActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },
  pendingWebButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  pendingWebPrimary: {
    backgroundColor: COLORS.azul,
  },
  pendingWebSecondary: {
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  pendingWebPrimaryText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  pendingWebSecondaryText: {
    color: "#111",
    fontSize: 13,
    fontWeight: "700",
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 140,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    borderRadius: 14,
    color: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: "rgba(0,0,0,0.35)",
    textAlignVertical: "top",
  },
  sendButton: {
    marginLeft: 10,
    height: 48,
    minWidth: 92,
    paddingHorizontal: 16,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.laranja,
  },
  sendButtonDisabled: {
    opacity: 0.45,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
