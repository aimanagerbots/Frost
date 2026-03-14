import { View, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { ArrowLeft } from 'lucide-react-native';
import { SafeScreen, Text, Button } from '@/components';
import { colors } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';

export default function MerchDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const haptics = useHaptics();

  const name = slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

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
          source={{ uri: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80' }}
          style={{ width: '100%', height: 340 }}
          contentFit="cover"
        />

        <View className="px-5 pt-4 pb-8">
          <Text variant="display" className="text-2xl">{name}</Text>
          <Text variant="display" className="text-3xl text-accent-primary mt-2">$35</Text>

          <Text variant="body" className="text-text-muted mt-4">
            Premium cotton blend tee featuring the iconic Frost snowflake logo.
            Soft, breathable, and built to last. Available in sizes S-XXL.
          </Text>

          <Text variant="label" className="mt-6 mb-2">Sizes</Text>
          <View className="flex-row">
            {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
              <Pressable
                key={size}
                className="w-10 h-10 rounded-lg bg-elevated items-center justify-center mr-2 active:bg-card-hover"
              >
                <Text variant="body" className="text-sm">{size}</Text>
              </Pressable>
            ))}
          </View>

          <Button
            label="Add to Cart"
            size="lg"
            onPress={() => haptics.medium()}
            className="mt-6"
          />
          <Button
            label="Redeem with Points (1,750 pts)"
            variant="secondary"
            size="lg"
            onPress={() => haptics.selection()}
            className="mt-3"
          />
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
