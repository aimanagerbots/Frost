import { ScrollView, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { SafeScreen, Text } from '@/components';
import { colors } from '@/theme';

export default function TermsScreen() {
  const router = useRouter();
  return (
    <SafeScreen>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={24} color={colors.text.default} />
        </Pressable>
        <Text variant="display" className="text-xl ml-3">Terms of Service</Text>
      </View>
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <Text variant="body" className="text-text-muted leading-6 mb-4">
          By using the Frost app, you agree to these terms of service. You must be 21 years of age or older to use this app and purchase cannabis products.
        </Text>
        <Text variant="display" className="text-base mb-2">Age Requirement</Text>
        <Text variant="body" className="text-text-muted leading-6 mb-4">
          You represent and warrant that you are at least 21 years old. We reserve the right to verify your age at the time of pickup.
        </Text>
        <Text variant="display" className="text-base mb-2">Orders & Pricing</Text>
        <Text variant="body" className="text-text-muted leading-6 mb-4">
          All prices are subject to change without notice. Orders are subject to product availability. We reserve the right to cancel orders for any reason.
        </Text>
        <Text variant="display" className="text-base mb-2">Compliance</Text>
        <Text variant="body" className="text-text-muted leading-6 mb-8">
          Frost operates in compliance with Oregon state cannabis regulations. Cannabis products may only be purchased and consumed in accordance with applicable law.
        </Text>
      </ScrollView>
    </SafeScreen>
  );
}
