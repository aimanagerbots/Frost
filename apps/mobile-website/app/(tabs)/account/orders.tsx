import { View, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Package } from 'lucide-react-native';
import { SafeScreen, Text, Card, Badge } from '@/components';
import { colors } from '@/theme';

const MOCK_ORDERS = [
  { id: 'ORD-001', date: 'Mar 10, 2026', items: 3, total: 95, status: 'delivered' as const },
  { id: 'ORD-002', date: 'Mar 5, 2026', items: 2, total: 72, status: 'delivered' as const },
  { id: 'ORD-003', date: 'Feb 28, 2026', items: 5, total: 148, status: 'delivered' as const },
  { id: 'ORD-004', date: 'Feb 20, 2026', items: 1, total: 40, status: 'delivered' as const },
];

const statusVariant = { delivered: 'success' as const, preparing: 'warning' as const, cancelled: 'danger' as const };

export default function OrderHistory() {
  const router = useRouter();

  return (
    <SafeScreen>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={24} color={colors.text.default} />
        </Pressable>
        <Text variant="display" className="text-xl ml-3">Order History</Text>
      </View>

      <FlatList
        data={MOCK_ORDERS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Card padding="md" className="mb-3">
            <View className="flex-row items-center justify-between mb-2">
              <Text variant="display" className="text-sm">{item.id}</Text>
              <Badge label={item.status} variant={statusVariant[item.status]} size="xs" dot />
            </View>
            <Text variant="caption">{item.date} · {item.items} items</Text>
            <Text variant="display" className="text-accent-primary mt-1">${item.total.toFixed(2)}</Text>
          </Card>
        )}
      />
    </SafeScreen>
  );
}
