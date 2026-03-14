import { ScrollView, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { SafeScreen, Text } from '@/components';
import { colors } from '@/theme';

export default function PrivacyScreen() {
  const router = useRouter();
  return (
    <SafeScreen>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={24} color={colors.text.default} />
        </Pressable>
        <Text variant="display" className="text-xl ml-3">Privacy Policy</Text>
      </View>
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <Text variant="body" className="text-text-muted leading-6 mb-4">
          Frost Cannabis Company respects your privacy. This policy describes how we collect, use, and protect your personal information when you use our app and services.
        </Text>
        <Text variant="display" className="text-base mb-2">Information We Collect</Text>
        <Text variant="body" className="text-text-muted leading-6 mb-4">
          We collect information you provide directly, such as your name, email, and phone number when you create an account or place an order. We also collect location data when you use the store finder feature, with your permission.
        </Text>
        <Text variant="display" className="text-base mb-2">How We Use Your Information</Text>
        <Text variant="body" className="text-text-muted leading-6 mb-4">
          Your information is used to process orders, manage your rewards account, provide customer support, and improve our services. We do not sell your personal information to third parties.
        </Text>
        <Text variant="display" className="text-base mb-2">Data Security</Text>
        <Text variant="body" className="text-text-muted leading-6 mb-8">
          We implement industry-standard security measures to protect your information, including encryption, secure storage, and access controls.
        </Text>
      </ScrollView>
    </SafeScreen>
  );
}
