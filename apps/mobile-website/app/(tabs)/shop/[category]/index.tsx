import { View, FlatList, Pressable, RefreshControl, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import { Image } from 'expo-image';
import { ArrowLeft, ShoppingBag } from 'lucide-react-native';
import { SafeScreen, Text, Badge, StrainBadge } from '@/components';
import { colors, categoryColors } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';
import { useOrderStore } from '@/stores/order-store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

const CATEGORY_LABELS: Record<string, string> = {
  flower: 'Flower',
  preroll: 'Pre-Rolls',
  vaporizer: 'Vaporizers',
  concentrate: 'Concentrates',
  edible: 'Edibles',
  beverage: 'Drinks',
};

// Mock products per category
function getMockProducts(category: string) {
  const base = [
    { id: '1', name: 'Blue Dream', slug: 'blue-dream', strainType: 'hybrid', thc: '22-26%', price: 35, brand: 'Frost Farms' },
    { id: '2', name: 'OG Kush', slug: 'og-kush', strainType: 'indica', thc: '20-25%', price: 40, brand: 'Frost Farms' },
    { id: '3', name: 'Sour Diesel', slug: 'sour-diesel', strainType: 'sativa', thc: '19-24%', price: 38, brand: 'Green Peak' },
    { id: '4', name: 'Girl Scout Cookies', slug: 'girl-scout-cookies', strainType: 'hybrid', thc: '25-28%', price: 45, brand: 'Frost Farms' },
    { id: '5', name: 'Northern Lights', slug: 'northern-lights', strainType: 'indica', thc: '16-21%', price: 32, brand: 'Green Peak' },
    { id: '6', name: 'Jack Herer', slug: 'jack-herer', strainType: 'sativa', thc: '18-23%', price: 36, brand: 'Frost Farms' },
    { id: '7', name: 'Gelato', slug: 'gelato', strainType: 'hybrid', thc: '20-25%', price: 42, brand: 'Artisan Cannabis Co' },
    { id: '8', name: 'Purple Punch', slug: 'purple-punch', strainType: 'indica', thc: '18-22%', price: 38, brand: 'Green Peak' },
  ];
  return base.map((p) => ({ ...p, category, imageUrl: `https://images.unsplash.com/photo-1616690710400-a16d146927c5?w=400&q=80` }));
}

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  strainType: string;
  thc: string;
  price: number;
  brand: string;
  imageUrl: string;
}

function ProductCard({ product, onPress }: { product: ProductItem; onPress: () => void }) {
  const haptics = useHaptics();
  const addItem = useOrderStore((s) => s.addItem);

  const handleAddToCart = () => {
    haptics.medium();
    addItem({
      productSlug: product.slug,
      productName: product.name,
      category: product.category,
      brand: product.brand,
      price: product.price,
      imageUrl: product.imageUrl,
      strainName: product.name,
      strainType: product.strainType,
      thcRange: product.thc,
    });
  };

  return (
    <Pressable
      onPress={onPress}
      className="rounded-xl border border-border-default bg-card overflow-hidden active:opacity-80 m-1.5"
      style={{ width: CARD_WIDTH }}
    >
      <Image
        source={{ uri: product.imageUrl }}
        style={{ width: '100%', height: 140 }}
        contentFit="cover"
      />
      <View className="p-3">
        <StrainBadge type={product.strainType as any} size="xs" />
        <Text variant="display" className="text-sm mt-1.5" numberOfLines={1}>
          {product.name}
        </Text>
        <Text variant="caption" className="mt-0.5">{product.brand}</Text>
        <Text variant="caption" className="mt-0.5">THC {product.thc}</Text>
        <View className="flex-row items-center justify-between mt-2">
          <Text variant="display" className="text-base text-accent-primary">
            ${product.price}
          </Text>
          <Pressable
            onPress={handleAddToCart}
            className="w-8 h-8 rounded-lg bg-accent-primary/15 items-center justify-center active:bg-accent-primary/30"
          >
            <ShoppingBag size={16} color={colors.accent.primary} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

export default function CategoryProducts() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const products = getMockProducts(category);
  const accentColor = categoryColors[category] ?? colors.accent.primary;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <SafeScreen>
      {/* Header */}
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={24} color={colors.text.default} />
        </Pressable>
        <Text variant="display" className="text-xl ml-3" style={{ color: accentColor }}>
          {CATEGORY_LABELS[category] ?? category}
        </Text>
      </View>

      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => router.push(`/shop/${category}/${item.slug}` as any)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent.primary}
          />
        }
      />
    </SafeScreen>
  );
}
