import { Tabs } from 'expo-router';
import { Home, ShoppingBag, MapPin, Compass, User } from 'lucide-react-native';
import { View } from 'react-native';
import { useHaptics } from '@/hooks/useHaptics';
import { useCartItemCount } from '@/stores/order-store';
import { colors } from '@/theme';

function CartBadge() {
  const count = useCartItemCount();
  if (count === 0) return null;

  return (
    <View className="absolute -top-1 -right-2 bg-accent-primary rounded-full w-4 h-4 items-center justify-center">
      <View>
        <View className="w-4 h-4 items-center justify-center">
          <View>
            {/* Text inside tiny badge */}
          </View>
        </View>
      </View>
    </View>
  );
}

export default function TabLayout() {
  const haptics = useHaptics();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent.primary,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarStyle: {
          backgroundColor: '#0A0A0F',
          borderTopColor: 'rgba(255,255,255,0.1)',
          borderTopWidth: 1,
          paddingTop: 8,
          height: 88,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-SemiBold',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginTop: 4,
        },
      }}
      screenListeners={{
        tabPress: () => haptics.selection(),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: 'Order',
          tabBarIcon: ({ color, size }) => (
            <View>
              <MapPin size={size} color={color} />
              <CartBadge />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => <Compass size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
