import { View, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Check, Clock, Package, Store, ShoppingBag } from 'lucide-react-native';
import { SafeScreen, Text, Card } from '@/components';
import { colors } from '@/theme';

const STEPS = [
  { label: 'Order Placed', icon: ShoppingBag, complete: true },
  { label: 'Confirmed', icon: Check, complete: true },
  { label: 'Preparing', icon: Package, complete: false, active: true },
  { label: 'Ready for Pickup', icon: Store, complete: false },
];

export default function OrderTracking() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <SafeScreen>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={24} color={colors.text.default} />
        </Pressable>
        <Text variant="display" className="text-xl ml-3">Order #{id?.slice(-6)}</Text>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Status Steps */}
        <Card padding="lg" className="mb-6">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isLast = i === STEPS.length - 1;
            return (
              <View key={step.label} className="flex-row">
                <View className="items-center mr-4">
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center ${
                      step.complete ? 'bg-success/20' : step.active ? 'bg-accent-primary/20' : 'bg-elevated'
                    }`}
                  >
                    <Icon
                      size={20}
                      color={step.complete ? colors.status.success : step.active ? colors.accent.primary : colors.text.muted}
                    />
                  </View>
                  {!isLast && (
                    <View
                      className={`w-0.5 h-8 ${step.complete ? 'bg-success/40' : 'bg-border-default'}`}
                    />
                  )}
                </View>
                <View className="flex-1 pt-2.5">
                  <Text
                    variant="body"
                    className={`text-sm ${
                      step.complete ? 'text-success' : step.active ? 'text-accent-primary' : 'text-text-muted'
                    }`}
                  >
                    {step.label}
                  </Text>
                  {step.active && (
                    <Text variant="caption" className="mt-0.5">Estimated: 15-20 minutes</Text>
                  )}
                </View>
              </View>
            );
          })}
        </Card>

        {/* Store Info */}
        <Text variant="label" className="mb-2">Pickup Location</Text>
        <Card padding="md" className="mb-6">
          <Text variant="display" className="text-base">Frost Downtown</Text>
          <Text variant="caption" className="mt-1">420 Main St, Portland, OR 97201</Text>
          <View className="flex-row items-center mt-1.5">
            <Clock size={12} color={colors.status.success} />
            <Text variant="caption" className="ml-1 text-success">Open until 9pm</Text>
          </View>
        </Card>

        <Text variant="label" className="mb-2">Need Help?</Text>
        <Text variant="caption" className="mb-8">
          Call (503) 555-0420 or use the Concierge chat for assistance.
        </Text>
      </ScrollView>
    </SafeScreen>
  );
}
