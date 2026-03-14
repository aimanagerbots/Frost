import { FlatList, View, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import { Image } from 'expo-image';
import { ArrowLeft, Clock } from 'lucide-react-native';
import { SafeScreen, Text, Card, Badge } from '@/components';
import { colors } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';

const MOCK_POSTS = [
  { id: '1', slug: 'understanding-terpenes', title: 'Understanding Terpenes: Your Guide to Cannabis Aromas', excerpt: 'Learn how terpenes shape the flavor, aroma, and effects of your favorite strains.', category: 'Education', readTime: 5, imageUrl: 'https://images.unsplash.com/photo-1616690710400-a16d146927c5?w=600&q=80' },
  { id: '2', slug: 'strain-spotlight-gelato', title: 'Strain Spotlight: Gelato', excerpt: 'A deep dive into one of the most popular hybrid strains on the market.', category: 'Strain Spotlights', readTime: 4, imageUrl: 'https://images.unsplash.com/photo-1616690710400-a16d146927c5?w=600&q=80' },
  { id: '3', slug: 'cannabis-and-creativity', title: 'Cannabis & Creativity: The Science Behind the Connection', excerpt: 'Exploring how different strains can enhance creative thinking.', category: 'Culture', readTime: 7, imageUrl: 'https://images.unsplash.com/photo-1616690710400-a16d146927c5?w=600&q=80' },
  { id: '4', slug: 'beginner-guide-edibles', title: "A Beginner's Guide to Edibles", excerpt: 'Everything you need to know about dosing, timing, and effects.', category: 'Education', readTime: 6, imageUrl: 'https://images.unsplash.com/photo-1616690710400-a16d146927c5?w=600&q=80' },
];

export default function BlogIndex() {
  const router = useRouter();
  const haptics = useHaptics();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <SafeScreen>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={24} color={colors.text.default} />
        </Pressable>
        <Text variant="display" className="text-xl ml-3">Blog</Text>
      </View>

      <FlatList
        data={MOCK_POSTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              haptics.selection();
              router.push(`/explore/blog/${item.slug}` as any);
            }}
            className="mb-4"
          >
            <Card padding="sm" className="overflow-hidden active:opacity-80">
              <Image
                source={{ uri: item.imageUrl }}
                style={{ width: '100%', height: 160, borderRadius: 8 }}
                contentFit="cover"
              />
              <View className="p-3">
                <Badge label={item.category} variant="default" size="xs" />
                <Text variant="display" className="text-base mt-2" numberOfLines={2}>
                  {item.title}
                </Text>
                <Text variant="caption" className="mt-1" numberOfLines={2}>
                  {item.excerpt}
                </Text>
                <View className="flex-row items-center mt-2">
                  <Clock size={12} color={colors.text.muted} />
                  <Text variant="caption" className="ml-1">{item.readTime} min read</Text>
                </View>
              </View>
            </Card>
          </Pressable>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent.primary} />
        }
      />
    </SafeScreen>
  );
}
