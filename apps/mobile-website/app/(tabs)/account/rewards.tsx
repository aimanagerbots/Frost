import { View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Gift, Star, Trophy } from 'lucide-react-native';
import { SafeScreen, Text, Card, Badge } from '@/components';
import { colors } from '@/theme';

export default function RewardsScreen() {
  const router = useRouter();

  return (
    <SafeScreen>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={24} color={colors.text.default} />
        </Pressable>
        <Text variant="display" className="text-xl ml-3">Rewards</Text>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Points Card */}
        <Card padding="lg" className="mb-6 border-accent-primary/30">
          <View className="flex-row items-center justify-between mb-3">
            <Text variant="label">Your Points</Text>
            <Badge label="Glacier Tier" variant="info" size="sm" dot />
          </View>
          <Text variant="display" className="text-4xl text-accent-primary">2,450</Text>
          <Text variant="caption" className="mt-1">550 points to Avalanche tier</Text>

          {/* Progress bar */}
          <View className="h-2 rounded-full bg-elevated mt-3">
            <View className="h-2 rounded-full bg-accent-primary" style={{ width: '82%' }} />
          </View>
        </Card>

        {/* Earn */}
        <Text variant="label" className="mb-2">How to Earn</Text>
        <Card padding="md" className="mb-2">
          <View className="flex-row items-center">
            <Star size={18} color={colors.accent.primary} />
            <Text variant="body" className="ml-3 flex-1 text-sm">1 point per $1 spent</Text>
          </View>
        </Card>
        <Card padding="md" className="mb-2">
          <View className="flex-row items-center">
            <Gift size={18} color={colors.status.success} />
            <Text variant="body" className="ml-3 flex-1 text-sm">250 bonus points on your birthday</Text>
          </View>
        </Card>
        <Card padding="md" className="mb-6">
          <View className="flex-row items-center">
            <Trophy size={18} color={colors.status.warning} />
            <Text variant="body" className="ml-3 flex-1 text-sm">Double points during promotions</Text>
          </View>
        </Card>

        {/* Recent Activity */}
        <Text variant="label" className="mb-2">Recent Activity</Text>
        {[
          { desc: 'Purchase — Frost Downtown', pts: '+35', date: 'Mar 10' },
          { desc: 'Redeemed — $10 off', pts: '-500', date: 'Mar 5' },
          { desc: 'Purchase — Frost Pearl', pts: '+72', date: 'Mar 1' },
        ].map((act, i) => (
          <Card key={i} padding="sm" className="mb-2">
            <View className="flex-row items-center justify-between">
              <View>
                <Text variant="body" className="text-sm">{act.desc}</Text>
                <Text variant="caption">{act.date}</Text>
              </View>
              <Text
                variant="display"
                className={`text-sm ${act.pts.startsWith('+') ? 'text-success' : 'text-danger'}`}
              >
                {act.pts} pts
              </Text>
            </View>
          </Card>
        ))}
        <View className="h-8" />
      </ScrollView>
    </SafeScreen>
  );
}
