import { View, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react-native';
import { SafeScreen, Text, Card, Button } from '@/components';
import { colors } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';
import { useOrderStore, useCartTotal } from '@/stores/order-store';

export default function CheckoutScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const items = useOrderStore((s) => s.items);
  const removeItem = useOrderStore((s) => s.removeItem);
  const updateQuantity = useOrderStore((s) => s.updateQuantity);
  const clearCart = useOrderStore((s) => s.clearCart);
  const setActiveOrder = useOrderStore((s) => s.setActiveOrder);
  const total = useCartTotal();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handlePlaceOrder = () => {
    haptics.success();
    setActiveOrder({
      id: `ORD-${Date.now()}`,
      storeGroups: [],
      customerName: name || 'Guest',
      customerPhone: phone || '(503) 555-0000',
      placedAt: new Date(),
    });
    clearCart();
    router.push(`/order/track/ORD-${Date.now()}` as any);
  };

  if (items.length === 0) {
    return (
      <SafeScreen>
        <View className="flex-row items-center px-5 py-3">
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ArrowLeft size={24} color={colors.text.default} />
          </Pressable>
          <Text variant="display" className="text-xl ml-3">Checkout</Text>
        </View>
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-4xl mb-4">🛒</Text>
          <Text variant="display" className="text-xl mb-2">Cart is empty</Text>
          <Text variant="caption" className="text-center">
            Add some items from the shop or a store menu
          </Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-row items-center px-5 py-3">
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ArrowLeft size={24} color={colors.text.default} />
          </Pressable>
          <Text variant="display" className="text-xl ml-3">Checkout</Text>
        </View>

        <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
          {/* Cart Items */}
          <Text variant="label" className="mb-2">Your Items</Text>
          {items.map((item) => (
            <Card key={`${item.productSlug}-${item.storeId ?? ''}`} padding="sm" className="mb-2">
              <View className="flex-row items-center">
                <View className="flex-1">
                  <Text variant="body" className="text-sm">{item.productName}</Text>
                  <Text variant="caption">${item.price} × {item.quantity}</Text>
                </View>
                <View className="flex-row items-center">
                  <Pressable
                    onPress={() => {
                      haptics.light();
                      updateQuantity(item.productSlug, item.storeId, item.quantity - 1);
                    }}
                    className="w-7 h-7 rounded-lg bg-elevated items-center justify-center"
                  >
                    <Text className="text-text-default">−</Text>
                  </Pressable>
                  <Text className="mx-2 text-text-default font-semibold">{item.quantity}</Text>
                  <Pressable
                    onPress={() => {
                      haptics.light();
                      updateQuantity(item.productSlug, item.storeId, item.quantity + 1);
                    }}
                    className="w-7 h-7 rounded-lg bg-elevated items-center justify-center"
                  >
                    <Text className="text-text-default">+</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      haptics.medium();
                      removeItem(item.productSlug, item.storeId);
                    }}
                    className="ml-3"
                  >
                    <Trash2 size={16} color={colors.status.danger} />
                  </Pressable>
                </View>
              </View>
            </Card>
          ))}

          {/* Total */}
          <View className="flex-row justify-between items-center mt-3 mb-6">
            <Text variant="display" className="text-lg">Total</Text>
            <Text variant="display" className="text-xl text-accent-primary">${total.toFixed(2)}</Text>
          </View>

          {/* Customer Info */}
          <Text variant="label" className="mb-2">Your Info</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={colors.text.muted}
            className="bg-elevated rounded-xl px-4 py-3 text-text-default font-sans mb-3"
          />
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone number"
            placeholderTextColor={colors.text.muted}
            keyboardType="phone-pad"
            className="bg-elevated rounded-xl px-4 py-3 text-text-default font-sans mb-6"
          />

          <Button label="Place Order" size="lg" onPress={handlePlaceOrder} className="mb-8" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}
