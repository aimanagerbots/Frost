import { View, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { ArrowLeft, ShoppingBag, MapPin } from 'lucide-react-native';
import { SafeScreen, Text, Card, Button, Badge, StrainBadge } from '@/components';
import { colors, categoryColors } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';
import { useOrderStore } from '@/stores/order-store';

export default function ProductDetail() {
  const { category, slug } = useLocalSearchParams<{ category: string; slug: string }>();
  const router = useRouter();
  const haptics = useHaptics();
  const addItem = useOrderStore((s) => s.addItem);
  const accentColor = categoryColors[category] ?? colors.accent.primary;

  // Mock product detail
  const product = {
    name: slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    brand: 'Frost Farms',
    strainType: 'hybrid' as const,
    thcRange: '22-26%',
    cbdRange: '0.1-0.3%',
    price: 38,
    description: 'A perfectly balanced hybrid offering a euphoric onset followed by full-body relaxation. Ideal for afternoon use, creative activities, and social gatherings.',
    terpenes: ['Myrcene', 'Limonene', 'Caryophyllene'],
    effects: ['Relaxed', 'Euphoric', 'Creative'],
    flavors: ['Citrus', 'Berry', 'Earthy'],
    imageUrl: 'https://images.unsplash.com/photo-1616690710400-a16d146927c5?w=800&q=80',
  };

  const handleAddToCart = () => {
    haptics.medium();
    addItem({
      productSlug: slug,
      productName: product.name,
      category,
      brand: product.brand,
      price: product.price,
      imageUrl: product.imageUrl,
      strainName: product.name,
      strainType: product.strainType,
      thcRange: product.thcRange,
    });
  };

  return (
    <SafeScreen edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Back button overlay */}
        <View className="absolute top-2 left-4 z-10">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-black/50 items-center justify-center"
          >
            <ArrowLeft size={20} color="white" />
          </Pressable>
        </View>

        {/* Hero image */}
        <Image
          source={{ uri: product.imageUrl }}
          style={{ width: '100%', height: 300 }}
          contentFit="cover"
        />

        <View className="px-5 pt-4 pb-8">
          {/* Strain badge + name */}
          <StrainBadge type={product.strainType} />
          <Text variant="display" className="text-2xl mt-2">{product.name}</Text>
          <Text variant="caption" className="mt-1">{product.brand}</Text>

          {/* Price */}
          <Text variant="display" className="text-3xl mt-3" style={{ color: accentColor }}>
            ${product.price}
          </Text>

          {/* THC / CBD */}
          <View className="flex-row mt-4 mb-4">
            <Card padding="sm" className="flex-1 mr-2 items-center">
              <Text variant="label">THC</Text>
              <Text variant="display" className="text-lg mt-1">{product.thcRange}</Text>
            </Card>
            <Card padding="sm" className="flex-1 ml-2 items-center">
              <Text variant="label">CBD</Text>
              <Text variant="display" className="text-lg mt-1">{product.cbdRange}</Text>
            </Card>
          </View>

          {/* Description */}
          <Text variant="body" className="text-text-muted mb-4">
            {product.description}
          </Text>

          {/* Terpenes */}
          <Text variant="label" className="mb-2">Terpene Profile</Text>
          <View className="flex-row flex-wrap mb-4">
            {product.terpenes.map((terp) => (
              <Badge key={terp} label={terp} variant="default" size="sm" />
            ))}
          </View>

          {/* Effects */}
          <Text variant="label" className="mb-2">Effects</Text>
          <View className="flex-row flex-wrap mb-4">
            {product.effects.map((effect) => (
              <View key={effect} className="mr-2 mb-1">
                <Badge label={effect} variant="success" size="sm" />
              </View>
            ))}
          </View>

          {/* Flavors */}
          <Text variant="label" className="mb-2">Flavor Notes</Text>
          <View className="flex-row flex-wrap mb-6">
            {product.flavors.map((flavor) => (
              <View key={flavor} className="mr-2 mb-1">
                <Badge label={flavor} variant="warning" size="sm" />
              </View>
            ))}
          </View>

          {/* Add to Cart */}
          <Button
            label="Add to Cart"
            size="lg"
            icon={<ShoppingBag size={20} color="#000" />}
            onPress={handleAddToCart}
            className="mb-3"
          />

          <Button
            label="Find Near Me"
            variant="secondary"
            size="lg"
            icon={<MapPin size={20} color={colors.accent.primary} />}
            onPress={() => router.push('/order' as any)}
          />
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
