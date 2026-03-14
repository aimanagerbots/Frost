import { View, SectionList, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ShoppingBag, MapPin } from 'lucide-react-native';
import { SafeScreen, Text, Badge } from '@/components';
import { colors, categoryColors } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';
import { useOrderStore } from '@/stores/order-store';

const STORE_MENU = [
  {
    title: 'Flower',
    data: [
      { id: '1', name: 'Blue Dream', price: 35, thc: '22-26%', type: 'hybrid' },
      { id: '2', name: 'OG Kush', price: 40, thc: '20-25%', type: 'indica' },
      { id: '3', name: 'Sour Diesel', price: 38, thc: '19-24%', type: 'sativa' },
    ],
  },
  {
    title: 'Pre-Rolls',
    data: [
      { id: '4', name: 'Blue Dream Joint', price: 12, thc: '22-26%', type: 'hybrid' },
      { id: '5', name: 'OG Kush 3-Pack', price: 30, thc: '20-25%', type: 'indica' },
    ],
  },
  {
    title: 'Edibles',
    data: [
      { id: '6', name: 'Frost Gummies 10pk', price: 25, thc: '100mg', type: 'hybrid' },
      { id: '7', name: 'Chocolate Bar', price: 20, thc: '50mg', type: 'indica' },
    ],
  },
];

export default function StoreMenu() {
  const { storeSlug } = useLocalSearchParams<{ storeSlug: string }>();
  const router = useRouter();
  const haptics = useHaptics();
  const addItem = useOrderStore((s) => s.addItem);

  const storeName = storeSlug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <SafeScreen>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={24} color={colors.text.default} />
        </Pressable>
        <View className="ml-3">
          <Text variant="display" className="text-lg">{storeName}</Text>
          <View className="flex-row items-center">
            <MapPin size={12} color={colors.status.success} />
            <Text variant="caption" className="ml-1 text-success">Open now</Text>
          </View>
        </View>
      </View>

      <SectionList
        sections={STORE_MENU}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderSectionHeader={({ section }) => (
          <View className="px-5 py-2 bg-base">
            <Text variant="label" style={{ color: categoryColors[section.title.toLowerCase()] ?? colors.accent.primary }}>
              {section.title}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <Pressable
            className="flex-row items-center px-5 py-3 border-b border-border-default active:bg-card-hover"
            onPress={() => {
              haptics.medium();
              addItem({
                productSlug: item.name.toLowerCase().replace(/\s+/g, '-'),
                productName: item.name,
                category: 'flower',
                brand: 'Frost Farms',
                price: item.price,
                storeId: storeSlug,
                storeName,
                storeSlug,
              });
            }}
          >
            <View className="flex-1">
              <Text variant="body" className="text-sm">{item.name}</Text>
              <Text variant="caption">THC {item.thc}</Text>
            </View>
            <Text variant="display" className="text-accent-primary mr-3">${item.price}</Text>
            <View className="w-8 h-8 rounded-lg bg-accent-primary/15 items-center justify-center">
              <ShoppingBag size={16} color={colors.accent.primary} />
            </View>
          </Pressable>
        )}
      />

      {/* Checkout Button */}
      <View className="px-5 py-3 border-t border-border-default bg-card">
        <Pressable
          onPress={() => {
            haptics.medium();
            router.push('/order/checkout' as any);
          }}
          className="bg-accent-primary rounded-xl py-3.5 items-center active:bg-accent-primary-hover"
        >
          <Text className="text-base font-semibold text-text-bright">View Cart & Checkout</Text>
        </Pressable>
      </View>
    </SafeScreen>
  );
}
