import { ScrollView, View, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { ArrowLeft, Clock } from 'lucide-react-native';
import { SafeScreen, Text, Badge } from '@/components';
import { colors } from '@/theme';

export default function BlogPost() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  const title = slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <SafeScreen edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="absolute top-2 left-4 z-10">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-black/50 items-center justify-center"
          >
            <ArrowLeft size={20} color="white" />
          </Pressable>
        </View>

        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1616690710400-a16d146927c5?w=800&q=80' }}
          style={{ width: '100%', height: 240 }}
          contentFit="cover"
        />

        <View className="px-5 pt-4 pb-8">
          <Badge label="Education" variant="default" size="sm" />
          <Text variant="display" className="text-2xl mt-3">{title}</Text>

          <View className="flex-row items-center mt-2 mb-6">
            <Clock size={14} color={colors.text.muted} />
            <Text variant="caption" className="ml-1">5 min read</Text>
            <Text variant="caption" className="mx-2">·</Text>
            <Text variant="caption">Mar 10, 2026</Text>
          </View>

          <Text variant="body" className="text-text-muted leading-6 mb-4">
            Cannabis terpenes are aromatic compounds found in many plants, but they are especially abundant in cannabis. They are responsible for the distinctive aromas and flavors of different strains, from the citrusy scent of Limonene to the earthy tones of Myrcene.
          </Text>

          <Text variant="body" className="text-text-muted leading-6 mb-4">
            Beyond their sensory qualities, terpenes are believed to contribute to the "entourage effect" — the theory that cannabis compounds work together synergistically to produce enhanced therapeutic benefits compared to isolated compounds alone.
          </Text>

          <Text variant="body" className="text-text-muted leading-6 mb-4">
            Understanding terpenes can help you choose strains that better match your desired experience. For example, strains high in Linalool (also found in lavender) tend to promote relaxation, while strains rich in Pinene may help with alertness and memory retention.
          </Text>

          <Text variant="body" className="text-text-muted leading-6">
            At Frost, we test and label the terpene profiles of all our products, so you can make more informed choices about your cannabis experience.
          </Text>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
