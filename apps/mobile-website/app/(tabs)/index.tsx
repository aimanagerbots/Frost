import { ScrollView, View, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ChevronRight, Star } from 'lucide-react-native';
import { SafeScreen, Text, Card, SectionHeader } from '@/components';
import { colors, categoryColors } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORIES = [
  { key: 'flower', label: 'Flower', emoji: '🌿', route: '/shop/flower' },
  { key: 'preroll', label: 'Pre-Rolls', emoji: '🚬', route: '/shop/preroll' },
  { key: 'vaporizer', label: 'Vaporizers', emoji: '💨', route: '/shop/vaporizer' },
  { key: 'concentrate', label: 'Concentrates', emoji: '💎', route: '/shop/concentrate' },
  { key: 'edible', label: 'Edibles', emoji: '🍫', route: '/shop/edible' },
  { key: 'beverage', label: 'Drinks', emoji: '🥤', route: '/shop/beverage' },
];

const REVIEWS = [
  { name: 'Sarah M.', rating: 5, text: 'Best dispensary experience in the state. Staff is incredibly knowledgeable.' },
  { name: 'Jake T.', rating: 5, text: 'Love the rewards program. The quality is consistently top-tier.' },
  { name: 'Maria L.', rating: 4, text: 'Great selection and the delivery is always on time. Highly recommend!' },
  { name: 'Chris R.', rating: 5, text: 'The concierge feature helped me find exactly what I needed.' },
];

function CategoryCard({ category, onPress }: { category: typeof CATEGORIES[0]; onPress: () => void }) {
  const color = categoryColors[category.key] ?? colors.accent.primary;

  return (
    <Pressable
      onPress={onPress}
      className="flex-1 m-1.5 rounded-xl border border-border-default bg-card p-4 active:opacity-80"
      style={{ minWidth: (SCREEN_WIDTH - 48) / 2 }}
    >
      <Text className="text-3xl mb-2">{category.emoji}</Text>
      <Text variant="display" className="text-base" style={{ color }}>
        {category.label}
      </Text>
      <View className="flex-row items-center mt-1">
        <Text variant="caption">Browse</Text>
        <ChevronRight size={12} color={colors.text.muted} />
      </View>
    </Pressable>
  );
}

function ReviewCard({ review }: { review: typeof REVIEWS[0] }) {
  return (
    <Card padding="md" className="mr-3" style={{ width: SCREEN_WIDTH * 0.7 }}>
      <View className="flex-row mb-2">
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star key={i} size={14} color={colors.accent.primary} fill={colors.accent.primary} />
        ))}
      </View>
      <Text variant="body" className="text-sm mb-2" numberOfLines={3}>
        &ldquo;{review.text}&rdquo;
      </Text>
      <Text variant="caption">{review.name}</Text>
    </Card>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const haptics = useHaptics();

  return (
    <SafeScreen>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View className="px-5 pt-4 pb-6">
          <Text variant="display" className="text-3xl mb-1">
            Frost
          </Text>
          <Text variant="body" className="text-text-muted">
            Premium cannabis, delivered with care
          </Text>
        </View>

        {/* Hero Image */}
        <View className="mx-5 rounded-2xl overflow-hidden mb-8" style={{ height: 200 }}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1616690710400-a16d146927c5?w=800&q=80' }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
          <View className="absolute inset-0 bg-black/40 justify-end p-5">
            <Text variant="display" className="text-2xl text-text-bright">
              Shop Our Menu
            </Text>
            <Text variant="body" className="text-text-default text-sm mt-1">
              Curated strains, concentrates & more
            </Text>
          </View>
        </View>

        {/* Categories */}
        <SectionHeader title="Shop by Category" />
        <View className="flex-row flex-wrap px-3 mb-6">
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.key}
              category={cat}
              onPress={() => {
                haptics.selection();
                router.push(cat.route as any);
              }}
            />
          ))}
        </View>

        {/* Reviews */}
        <SectionHeader title="What People Say" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          className="mb-8"
        >
          {REVIEWS.map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </ScrollView>

        {/* How It Works */}
        <SectionHeader title="How It Works" />
        <View className="px-5 mb-12">
          {[
            { step: '1', title: 'Browse', desc: 'Explore our curated selection of premium products' },
            { step: '2', title: 'Order', desc: 'Add items to your cart and checkout in seconds' },
            { step: '3', title: 'Pickup', desc: 'Pick up at your nearest Frost location' },
          ].map((item, i) => (
            <View key={i} className="flex-row items-start mb-4">
              <View className="w-8 h-8 rounded-full bg-accent-primary/20 items-center justify-center mr-3">
                <Text className="text-accent-primary font-semibold text-sm">{item.step}</Text>
              </View>
              <View className="flex-1">
                <Text variant="display" className="text-base">{item.title}</Text>
                <Text variant="caption" className="mt-0.5">{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
