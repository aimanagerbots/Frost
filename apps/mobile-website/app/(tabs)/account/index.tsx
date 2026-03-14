import { View, ScrollView, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { User, Package, Gift, Users, LogOut } from 'lucide-react-native';
import { SafeScreen, Text, Card, Button, SectionHeader } from '@/components';
import { colors } from '@/theme';
import { useAuthStore } from '@/stores/auth-store';
import { useHaptics } from '@/hooks/useHaptics';

function LoginForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const login = useAuthStore((s) => s.login);
  const haptics = useHaptics();

  const handleLogin = () => {
    if (name.trim() && email.trim()) {
      haptics.success();
      login(name.trim(), email.trim());
    }
  };

  return (
    <View className="px-5 pt-12">
      <View className="items-center mb-8">
        <View className="w-20 h-20 rounded-full bg-accent-primary/15 items-center justify-center mb-4">
          <User size={36} color={colors.accent.primary} />
        </View>
        <Text variant="display" className="text-2xl">Welcome to Frost</Text>
        <Text variant="caption" className="mt-2 text-center">
          Sign in to track orders, earn rewards,{'\n'}and manage your account
        </Text>
      </View>

      <View className="mb-4">
        <Text variant="label" className="mb-2">Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={colors.text.muted}
          className="bg-elevated rounded-xl px-4 py-3 text-text-default font-sans"
        />
      </View>

      <View className="mb-6">
        <Text variant="label" className="mb-2">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="your@email.com"
          placeholderTextColor={colors.text.muted}
          keyboardType="email-address"
          autoCapitalize="none"
          className="bg-elevated rounded-xl px-4 py-3 text-text-default font-sans"
        />
      </View>

      <Button label="Sign In" size="lg" onPress={handleLogin} />
    </View>
  );
}

function AccountDashboard() {
  const router = useRouter();
  const haptics = useHaptics();
  const customerName = useAuthStore((s) => s.customerName);
  const customerEmail = useAuthStore((s) => s.customerEmail);
  const logout = useAuthStore((s) => s.logout);

  const menuItems = [
    { title: 'Order History', icon: Package, route: '/account/orders' },
    { title: 'Rewards & Loyalty', icon: Gift, route: '/account/rewards' },
    { title: 'Referrals', icon: Users, route: '/account/referrals' },
  ];

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <SectionHeader title="Account" />

      {/* Profile Card */}
      <Card padding="lg" className="mx-5 mb-6">
        <View className="flex-row items-center">
          <View className="w-14 h-14 rounded-full bg-accent-primary/20 items-center justify-center mr-4">
            <Text className="text-xl font-semibold text-accent-primary">
              {customerName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text variant="display" className="text-lg">{customerName}</Text>
            <Text variant="caption">{customerEmail}</Text>
          </View>
        </View>
      </Card>

      {/* Menu Items */}
      <View className="px-5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Pressable
              key={item.title}
              onPress={() => {
                haptics.selection();
                router.push(item.route as any);
              }}
              className="mb-2"
            >
              <Card padding="md" className="flex-row items-center active:opacity-80">
                <Icon size={20} color={colors.accent.primary} />
                <Text variant="body" className="ml-3 flex-1">{item.title}</Text>
              </Card>
            </Pressable>
          );
        })}

        <Pressable
          onPress={() => {
            haptics.warning();
            logout();
          }}
          className="mt-4 mb-8"
        >
          <Card padding="md" className="flex-row items-center active:opacity-80">
            <LogOut size={20} color={colors.status.danger} />
            <Text variant="body" className="ml-3 text-danger">Sign Out</Text>
          </Card>
        </Pressable>
      </View>
    </ScrollView>
  );
}

export default function AccountIndex() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  return (
    <SafeScreen>
      {isLoggedIn ? <AccountDashboard /> : <LoginForm />}
    </SafeScreen>
  );
}
