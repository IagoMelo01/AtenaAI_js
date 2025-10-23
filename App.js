import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const formatTimestamp = (value) => {
  const date = new Date(value);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export default function App() {
  const [messages, setMessages] = useState(() => [
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Olá! Eu sou a AtenaAI. Posso ajudar com planejamento de aulas, revisão de conteúdo, criação de exercícios e muito mais. Como posso te apoiar hoje?',
      createdAt: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const flatListRef = useRef(null);
  const pendingResponseRef = useRef(null);

  const promptSuggestions = useMemo(
    () => [
      'Explique a fotossíntese de forma simples',
      'Crie um plano de aula sobre Revolução Industrial',
      'Sugira exercícios para praticar frações',
      'Como posso avaliar melhor meus alunos?',
    ],
    [],
  );

  const highlightSections = useMemo(
    () => [
      {
        title: 'Painel pedagógico',
        description: 'Resumo das turmas, engajamento dos alunos e insights acionáveis para a sua rotina.',
      },
      {
        title: 'Criação assistida',
        description: 'Gere aulas, avaliações e atividades com feedback imediato para diferentes faixas etárias.',
      },
      {
        title: 'Central de conhecimento',
        description: 'Guarde e reutilize planos de aula, sugestões e estratégias validadas pela comunidade.',
      },
    ],
    [],
  );

  const knowledgeBase = useMemo(
    () => [
      'BNCC atualizada',
      'Metodologias ativas',
      'Inclusão e acessibilidade',
      'Avaliação formativa',
      'Gamificação',
      'Desenvolvimento socioemocional',
    ],
    [],
  );

  const generateAssistantResponse = useCallback((text) => {
    const normalized = text.toLowerCase();

    if (normalized.includes('plano') || normalized.includes('aula')) {
      return 'Posso criar um plano de aula estruturado com objetivos, atividades, materiais e avaliação. Deseja focar em alguma série ou habilidade específica?';
    }

    if (normalized.includes('atividade') || normalized.includes('exerc')) {
      return 'Vamos montar uma atividade diferenciada. Conte-me qual é o tema, o ano dos alunos e o objetivo da atividade para eu sugerir algo alinhado.';
    }

    if (normalized.includes('avalia')) {
      return 'Para avaliação, posso sugerir instrumentos variados, rubricas e estratégias de feedback. Prefere algo diagnóstico, formativo ou somativo?';
    }

    if (normalized.includes('inclus') || normalized.includes('acess')) {
      return 'Tenho um conjunto de orientações para tornar as aulas mais inclusivas e acessíveis. Me conte o contexto e o perfil da turma para sugerir adaptações.';
    }

    return 'Entendido! Se quiser, posso trazer sugestões de conteúdo, adaptar materiais para diferentes níveis ou ajudar a organizar seu planejamento semanal. É só me contar mais detalhes.';
  }, []);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      if (pendingResponseRef.current) {
        clearTimeout(pendingResponseRef.current);
      }
    };
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();

    if (!trimmed || isProcessing) {
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    const responseText = generateAssistantResponse(trimmed);
    if (pendingResponseRef.current) {
      clearTimeout(pendingResponseRef.current);
    }

    pendingResponseRef.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: responseText,
          createdAt: Date.now(),
        },
      ]);
      setIsProcessing(false);
      pendingResponseRef.current = null;
    }, 600);
  }, [generateAssistantResponse, input, isProcessing]);

  const renderMessage = useCallback(({ item }) => {
    const isUser = item.sender === 'user';

    return (
      <View
        style={[
          styles.messageWrapper,
          isUser ? styles.messageWrapperUser : styles.messageWrapperAssistant,
        ]}
      >
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userText : styles.assistantText]}>{item.text}</Text>
        </View>
        <Text style={styles.timestamp}>{formatTimestamp(item.createdAt)}</Text>
      </View>
    );
  }, []);

  const handleSuggestionPress = useCallback((suggestion) => {
    setInput(suggestion.replace(/\n/g, ' '));
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', default: undefined })}
        keyboardVerticalOffset={80}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AtenaAI</Text>
          <Text style={styles.headerSubtitle}>
            Assistente pedagógica para impulsionar o planejamento e a personalização do ensino.
          </Text>
        </View>

        <ScrollView
          style={styles.summary}
          contentContainerStyle={styles.summaryContent}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {highlightSections.map((section) => (
            <View key={section.title} style={styles.highlightCard}>
              <Text style={styles.cardTitle}>{section.title}</Text>
              <Text style={styles.cardDescription}>{section.description}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.promptContainer}>
          <Text style={styles.sectionTitle}>Sugestões rápidas</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {promptSuggestions.map((suggestion) => (
              <Pressable
                key={suggestion}
                onPress={() => handleSuggestionPress(suggestion)}
                style={({ pressed }) => [
                  styles.promptChip,
                  pressed && styles.promptChipPressed,
                ]}
              >
                <Text style={styles.promptChipText}>{suggestion.replace('\n', ' ')}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.chatContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messageList}
          />
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator color="#3d6dde" size="small" />
              <Text style={styles.processingText}>AtenaAI está elaborando uma resposta...</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Descreva como posso ajudar"
            placeholderTextColor="#7a839a"
            value={input}
            onChangeText={setInput}
            multiline
          />
          <Pressable
            style={({ pressed }) => [
              styles.sendButton,
              (input.trim().length === 0 || isProcessing) && styles.sendButtonDisabled,
              pressed && !(input.trim().length === 0 || isProcessing) && styles.sendButtonPressed,
            ]}
            onPress={handleSend}
            disabled={input.trim().length === 0 || isProcessing}
          >
            <Text style={styles.sendButtonLabel}>{isProcessing ? 'Aguarde' : 'Enviar'}</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Base de conhecimento</Text>
          <View style={styles.tagsContainer}>
            {knowledgeBase.map((item) => (
              <View key={item} style={styles.tag}>
                <Text style={styles.tagText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 12,
    backgroundColor: '#0f172a',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f8fafc',
    letterSpacing: 0.4,
  },
  headerSubtitle: {
    marginTop: 6,
    fontSize: 15,
    color: '#cbd5f5',
    lineHeight: 22,
  },
  summary: {
    maxHeight: 160,
    backgroundColor: '#0f172a',
  },
  summaryContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  highlightCard: {
    width: 260,
    marginRight: 12,
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.35)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#cbd5f5',
  },
  promptContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#111c33',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(148, 163, 184, 0.25)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 8,
  },
  promptChip: {
    marginRight: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: 'rgba(148, 163, 184, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.35)',
  },
  promptChipPressed: {
    backgroundColor: 'rgba(79, 70, 229, 0.4)',
  },
  promptChipText: {
    color: '#f8fafc',
    fontWeight: '500',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  messageList: {
    paddingBottom: 12,
  },
  messageWrapper: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  messageWrapperUser: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  messageWrapperAssistant: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#4f46e5',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.35)',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#f8fafc',
  },
  assistantText: {
    color: '#e2e8f0',
  },
  timestamp: {
    marginTop: 6,
    fontSize: 12,
    color: '#94a3b8',
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingVertical: 4,
  },
  processingText: {
    marginLeft: 10,
    fontSize: 13,
    color: '#cbd5f5',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0b1220',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(148, 163, 184, 0.25)',
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#1e293b',
    color: '#f8fafc',
    borderRadius: 16,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.35)',
  },
  sendButton: {
    minWidth: 96,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonPressed: {
    backgroundColor: '#4338ca',
  },
  sendButtonLabel: {
    color: '#f8fafc',
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#0b1220',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(148, 163, 184, 0.25)',
  },
  footerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(148, 163, 184, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.35)',
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#e2e8f0',
    fontSize: 13,
  },
});
