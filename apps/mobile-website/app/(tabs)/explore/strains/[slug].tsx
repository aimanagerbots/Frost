import { View, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { SafeScreen, Text, Card, Badge, StrainBadge } from '@/components';
import { colors } from '@/theme';

export default function StrainDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  const name = slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <SafeScreen>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={24} color={colors.text.default} />
        </Pressable>
        <Text variant="display" className="text-xl ml-3">{name}</Text>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <StrainBadge type="hybrid" />

        <Text variant="body" className="mt-4 text-text-muted">
          A beautifully balanced strain known for its cerebral invigoration and full-body relaxation.
          Perfect for creative endeavors and social situations.
        </Text>

        <View className="flex-row mt-4 mb-4">
          <Card padding="sm" className="flex-1 mr-2 items-center">
            <Text variant="label">THC</Text>
            <Text variant="display" className="text-lg mt-1">22-26%</Text>
          </Card>
          <Card padding="sm" className="flex-1 ml-2 items-center">
            <Text variant="label">CBD</Text>
            <Text variant="display" className="text-lg mt-1">0.1%</Text>
          </Card>
        </View>

        <Text variant="label" className="mb-2">Effects</Text>
        <View className="flex-row flex-wrap mb-4">
          {['Relaxed', 'Creative', 'Euphoric'].map((e) => (
            <View key={e} className="mr-2 mb-1">
              <Badge label={e} variant="success" size="sm" />
            </View>
          ))}
        </View>

        <Text variant="label" className="mb-2">Terpenes</Text>
        <View className="flex-row flex-wrap mb-4">
          {['Myrcene', 'Limonene', 'Caryophyllene'].map((t) => (
            <View key={t} className="mr-2 mb-1">
              <Badge label={t} variant="default" size="sm" />
            </View>
          ))}
        </View>

        <Text variant="label" className="mb-2">Lineage</Text>
        <Text variant="body" className="text-text-muted mb-4">
          Blueberry × Haze
        </Text>

        <Text variant="label" className="mb-2">Available Products</Text>
        <Card padding="md" className="mb-3">
          <Text variant="display" className="text-sm">Flower — $35/eighth</Text>
        </Card>
        <Card padding="md" className="mb-3">
          <Text variant="display" className="text-sm">Pre-Roll — $12/each</Text>
        </Card>
        <Card padding="md" className="mb-8">
          <Text variant="display" className="text-sm">Concentrate — $45/gram</Text>
        </Card>
      </ScrollView>
    </SafeScreen>
  );
}
