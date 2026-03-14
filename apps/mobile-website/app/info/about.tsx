import { ScrollView, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { SafeScreen, Text } from '@/components';
import { colors } from '@/theme';

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeScreen>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={24} color={colors.text.default} />
        </Pressable>
        <Text variant="display" className="text-xl ml-3">About Frost</Text>
      </View>
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <Text variant="display" className="text-2xl mb-4">Our Story</Text>
        <Text variant="body" className="text-text-muted leading-6 mb-4">
          Frost was founded with a simple mission: to bring the highest quality cannabis products to our community through exceptional service, education, and transparency.
        </Text>
        <Text variant="body" className="text-text-muted leading-6 mb-4">
          We partner directly with local cultivators who share our commitment to sustainable growing practices and consistent quality. Every product in our stores is third-party tested and comes with a complete Certificate of Analysis.
        </Text>
        <Text variant="body" className="text-text-muted leading-6 mb-4">
          Our team of cannabis specialists is here to guide you through your experience, whether you are a first-time consumer or a seasoned connoisseur. We believe in responsible consumption and are committed to educating our community.
        </Text>
        <Text variant="display" className="text-xl mb-3 mt-4">Our Values</Text>
        {['Quality', 'Transparency', 'Community', 'Education', 'Sustainability'].map((v) => (
          <View key={v} className="flex-row items-center mb-3">
            <View className="w-2 h-2 rounded-full bg-accent-primary mr-3" />
            <Text variant="body">{v}</Text>
          </View>
        ))}
        <View className="h-8" />
      </ScrollView>
    </SafeScreen>
  );
}
