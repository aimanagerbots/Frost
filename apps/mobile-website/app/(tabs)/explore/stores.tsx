import { View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Clock, Phone } from 'lucide-react-native';
import { SafeScreen, Text, Card } from '@/components';
import { colors } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';

const STORES = [
  { id: '1', name: 'Frost Downtown', address: '420 Main St, Portland, OR 97201', phone: '(503) 555-0420', hours: '9am - 9pm', distance: '0.8 mi' },
  { id: '2', name: 'Frost Pearl District', address: '1050 NW Glisan St, Portland, OR 97209', phone: '(503) 555-0421', hours: '10am - 8pm', distance: '1.2 mi' },
  { id: '3', name: 'Frost Alberta', address: '2715 NE Alberta St, Portland, OR 97211', phone: '(503) 555-0422', hours: '9am - 10pm', distance: '2.4 mi' },
  { id: '4', name: 'Frost Hawthorne', address: '3440 SE Hawthorne Blvd, Portland, OR 97214', phone: '(503) 555-0423', hours: '10am - 9pm', distance: '3.1 mi' },
];

export default function StoresScreen() {
  const router = useRouter();
  const haptics = useHaptics();

  return (
    <SafeScreen>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={24} color={colors.text.default} />
        </Pressable>
        <Text variant="display" className="text-xl ml-3">Store Finder</Text>
      </View>

      {/* Map placeholder */}
      <View className="mx-5 h-48 rounded-xl bg-elevated border border-border-default items-center justify-center mb-4">
        <MapPin size={32} color={colors.text.muted} />
        <Text variant="caption" className="mt-2">Map view coming soon</Text>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {STORES.map((store) => (
          <Pressable
            key={store.id}
            onPress={() => {
              haptics.selection();
              router.push(`/order/store/${store.name.toLowerCase().replace(/\s+/g, '-')}` as any);
            }}
            className="mb-3"
          >
            <Card padding="md" className="active:opacity-80">
              <View className="flex-row items-start">
                <View className="w-10 h-10 rounded-full bg-info/15 items-center justify-center mr-3">
                  <MapPin size={20} color={colors.status.info} />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text variant="display" className="text-base">{store.name}</Text>
                    <Text variant="caption" className="text-accent-primary">{store.distance}</Text>
                  </View>
                  <Text variant="caption" className="mt-1">{store.address}</Text>
                  <View className="flex-row items-center mt-1.5">
                    <Clock size={12} color={colors.status.success} />
                    <Text variant="caption" className="ml-1 text-success">{store.hours}</Text>
                    <Text variant="caption" className="mx-2">·</Text>
                    <Phone size={12} color={colors.text.muted} />
                    <Text variant="caption" className="ml-1">{store.phone}</Text>
                  </View>
                </View>
              </View>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </SafeScreen>
  );
}
