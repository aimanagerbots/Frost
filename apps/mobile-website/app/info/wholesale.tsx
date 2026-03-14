import { View, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { SafeScreen, Text, Button } from '@/components';
import { colors } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';

export default function WholesaleScreen() {
  const router = useRouter();
  const haptics = useHaptics();

  return (
    <SafeScreen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <View className="flex-row items-center px-5 py-3">
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ArrowLeft size={24} color={colors.text.default} />
          </Pressable>
          <Text variant="display" className="text-xl ml-3">Wholesale</Text>
        </View>
        <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
          <Text variant="body" className="text-text-muted mb-6">
            Interested in carrying Frost products? Fill out the form below and our wholesale team will reach out.
          </Text>
          {['Business Name', 'Contact Name', 'Email', 'Phone', 'License Number'].map((field) => (
            <TextInput
              key={field}
              placeholder={field}
              placeholderTextColor={colors.text.muted}
              className="bg-elevated rounded-xl px-4 py-3 text-text-default font-sans mb-3"
              keyboardType={field === 'Email' ? 'email-address' : field === 'Phone' ? 'phone-pad' : 'default'}
              autoCapitalize={field === 'Email' ? 'none' : 'words'}
            />
          ))}
          <Button label="Submit Inquiry" size="lg" onPress={() => haptics.success()} className="mt-2 mb-8" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}
