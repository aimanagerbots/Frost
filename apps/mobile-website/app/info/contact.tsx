import { View, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react-native';
import { SafeScreen, Text, Card, Button } from '@/components';
import { colors } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';

export default function ContactScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <SafeScreen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <View className="flex-row items-center px-5 py-3">
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ArrowLeft size={24} color={colors.text.default} />
          </Pressable>
          <Text variant="display" className="text-xl ml-3">Contact</Text>
        </View>
        <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
          {[
            { icon: Mail, label: 'hello@frost.com' },
            { icon: Phone, label: '(503) 555-0420' },
            { icon: MapPin, label: 'Portland, Oregon' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <Card key={i} padding="sm" className="mb-2">
                <View className="flex-row items-center">
                  <Icon size={18} color={colors.accent.primary} />
                  <Text variant="body" className="ml-3 text-sm">{item.label}</Text>
                </View>
              </Card>
            );
          })}

          <Text variant="label" className="mt-6 mb-2">Send a Message</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={colors.text.muted} className="bg-elevated rounded-xl px-4 py-3 text-text-default font-sans mb-3" />
          <TextInput value={email} onChangeText={setEmail} placeholder="Your email" placeholderTextColor={colors.text.muted} keyboardType="email-address" autoCapitalize="none" className="bg-elevated rounded-xl px-4 py-3 text-text-default font-sans mb-3" />
          <TextInput value={message} onChangeText={setMessage} placeholder="Your message" placeholderTextColor={colors.text.muted} multiline numberOfLines={4} className="bg-elevated rounded-xl px-4 py-3 text-text-default font-sans mb-4" style={{ textAlignVertical: 'top', minHeight: 100 }} />
          <Button label="Send Message" size="lg" onPress={() => haptics.success()} className="mb-8" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}
