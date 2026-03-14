import { View, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { X, Send } from 'lucide-react-native';
import { SafeScreen, Text } from '@/components';
import { colors } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    text: "Hey! I'm Frost's AI Concierge. I can help you find the perfect product, answer questions about strains, or assist with your order. What can I help you with?",
    isUser: false,
  },
];

const BOT_RESPONSES = [
  "Great question! For relaxation, I'd recommend our Blue Dream — it's a balanced hybrid with 22-26% THC. Would you like me to add it to your cart?",
  "Our edibles are very popular! The Frost Gummies come in a 10-pack with 10mg per piece. Perfect for controlled dosing. Want to see more options?",
  "I can help with that! Our closest store to you is Frost Downtown on Main St, open until 9pm tonight. Shall I show you their menu?",
];

function ChatBubble({ message }: { message: Message }) {
  return (
    <View className={`mb-3 max-w-[80%] ${message.isUser ? 'self-end' : 'self-start'}`}>
      <View
        className={`rounded-2xl px-4 py-3 ${
          message.isUser ? 'bg-accent-primary rounded-br-md' : 'bg-elevated rounded-bl-md'
        }`}
      >
        <Text className={`text-sm ${message.isUser ? 'text-base' : 'text-text-default'}`}>
          {message.text}
        </Text>
      </View>
    </View>
  );
}

export default function ConciergeScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    haptics.light();

    const userMsg: Message = { id: `u-${Date.now()}`, text: input.trim(), isUser: true };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botMsg: Message = {
        id: `b-${Date.now()}`,
        text: BOT_RESPONSES[messages.length % BOT_RESPONSES.length],
        isUser: false,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3 border-b border-border-default">
          <Text variant="display" className="text-lg">Frost Concierge</Text>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <X size={24} color={colors.text.muted} />
          </Pressable>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          className="flex-1 px-5 pt-4"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd()}
        >
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
        </ScrollView>

        {/* Input */}
        <View className="flex-row items-center px-5 py-3 border-t border-border-default bg-card">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask me anything..."
            placeholderTextColor={colors.text.muted}
            className="flex-1 bg-elevated rounded-xl px-4 py-2.5 text-text-default font-sans text-sm mr-3"
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <Pressable
            onPress={handleSend}
            className="w-10 h-10 rounded-xl bg-accent-primary items-center justify-center active:bg-accent-primary-hover"
          >
            <Send size={18} color="#000" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}
