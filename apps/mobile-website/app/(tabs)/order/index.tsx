import { View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, ShoppingBag } from 'lucide-react-native';
import { SafeScreen, Text, Card, SectionHeader } from '@/components';
import { colors } from '@/theme';
import { useOrderStore } from '@/stores/order-store';
import { useHaptics } from '@/hooks/useHaptics';

const STORES = [
  { id: '1', name: 'Frost Downtown', address: '420 Main St, Portland, OR', hours: '9am - 9pm', slug: 'frost-downtown' },
  { id: '2', name: 'Frost Pearl District', address: '1050 NW Glisan St, Portland, OR', hours: '10am - 8pm', slug: 'frost-pearl' },
  { id: '3', name: 'Frost Alberta', address: '2715 NE Alberta St, Portland, OR', hours: '9am - 10pm', slug: 'frost-alberta' },
];

export default function OrderIndex() {
  const router = useRouter();
  const haptics = useHaptics();
  const browseMode = useOrderStore((s) => s.browseMode);
  const setBrowseMode = useOrderStore((s) => s.setBrowseMode);

  return (
    <SafeScreen>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <SectionHeader title="Order" subtitle="Find a store near you" />

        {/* Browse Mode Toggle */}
        <View className="flex-row mx-5 mb-6 rounded-xl bg-elevated p-1">
          <Pressable
            onPress={() => { haptics.selection(); setBrowseMode('by-store'); }}
            className={`flex-1 py-2.5 rounded-lg items-center ${browseMode === 'by-store' ? 'bg-accent-primary' : ''}`}
          >
            <Text className={`text-sm font-semibold ${browseMode === 'by-store' ? 'text-base' : 'text-text-muted'}`}>
              By Store
            </Text>
          </Pressable>
          <Pressable
            onPress={() => { haptics.selection(); setBrowseMode('all-products'); }}
            className={`flex-1 py-2.5 rounded-lg items-center ${browseMode === 'all-products' ? 'bg-accent-primary' : ''}`}
          >
            <Text className={`text-sm font-semibold ${browseMode === 'all-products' ? 'text-base' : 'text-text-muted'}`}>
              All Products
            </Text>
          </Pressable>
        </View>

        {/* Store List */}
        <View className="px-5">
          {STORES.map((store) => (
            <Pressable
              key={store.id}
              onPress={() => {
                haptics.selection();
                router.push(`/order/store/${store.slug}` as any);
              }}
              className="mb-3"
            >
              <Card padding="md" className="active:opacity-80">
                <View className="flex-row items-start">
                  <View className="w-10 h-10 rounded-full bg-accent-primary/15 items-center justify-center mr-3">
                    <MapPin size={20} color={colors.accent.primary} />
                  </View>
                  <View className="flex-1">
                    <Text variant="display" className="text-base">{store.name}</Text>
                    <Text variant="caption" className="mt-0.5">{store.address}</Text>
                    <Text variant="caption" className="mt-0.5 text-success">{store.hours}</Text>
                  </View>
                </View>
              </Card>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
