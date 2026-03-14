import { View, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeScreen, Text, SectionHeader } from '@/components';
import { categoryColors } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORIES = [
  { key: 'flower', label: 'Flower', emoji: '🌿', count: 24 },
  { key: 'preroll', label: 'Pre-Rolls', emoji: '🚬', count: 18 },
  { key: 'vaporizer', label: 'Vaporizers', emoji: '💨', count: 12 },
  { key: 'concentrate', label: 'Concentrates', emoji: '💎', count: 15 },
  { key: 'edible', label: 'Edibles', emoji: '🍫', count: 20 },
  { key: 'beverage', label: 'Drinks', emoji: '🥤', count: 8 },
];

export default function ShopIndex() {
  const router = useRouter();
  const haptics = useHaptics();

  return (
    <SafeScreen>
      <SectionHeader title="Shop" subtitle="Browse by category" />
      <View className="flex-row flex-wrap px-3 pt-2">
        {CATEGORIES.map((cat) => {
          const color = categoryColors[cat.key] ?? '#5BB8E6';
          return (
            <Pressable
              key={cat.key}
              onPress={() => {
                haptics.selection();
                router.push(`/shop/${cat.key}` as any);
              }}
              className="m-1.5 rounded-xl border border-border-default bg-card p-5 active:opacity-80"
              style={{ width: (SCREEN_WIDTH - 36) / 2 }}
            >
              <Text className="text-4xl mb-3">{cat.emoji}</Text>
              <Text variant="display" className="text-lg" style={{ color }}>
                {cat.label}
              </Text>
              <Text variant="caption" className="mt-1">{cat.count} products</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeScreen>
  );
}
