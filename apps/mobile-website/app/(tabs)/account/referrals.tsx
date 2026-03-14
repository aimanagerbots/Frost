import { View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Share2, Users, Gift } from 'lucide-react-native';
import { SafeScreen, Text, Card, Button } from '@/components';
import { colors } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';

export default function ReferralsScreen() {
  const router = useRouter();
  const haptics = useHaptics();

  return (
    <SafeScreen>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={24} color={colors.text.default} />
        </Pressable>
        <Text variant="display" className="text-xl ml-3">Referrals</Text>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <Card padding="lg" className="mb-6 items-center">
          <Users size={36} color={colors.accent.primary} />
          <Text variant="display" className="text-2xl mt-3">Refer Friends, Get Rewards</Text>
          <Text variant="caption" className="text-center mt-2">
            Share your referral code and both you{'\n'}and your friend earn 500 points
          </Text>

          <View className="bg-elevated rounded-xl px-6 py-3 mt-4 mb-4">
            <Text variant="mono" className="text-accent-primary text-lg">FROST-2X4K9</Text>
          </View>

          <Button
            label="Share Code"
            icon={<Share2 size={18} color="#000" />}
            onPress={() => haptics.medium()}
          />
        </Card>

        <Text variant="label" className="mb-2">Your Referrals</Text>
        {[
          { name: 'Alex M.', status: 'Signed up', pts: 500 },
          { name: 'Jordan K.', status: 'First purchase', pts: 500 },
        ].map((ref, i) => (
          <Card key={i} padding="md" className="mb-2">
            <View className="flex-row items-center justify-between">
              <View>
                <Text variant="body" className="text-sm">{ref.name}</Text>
                <Text variant="caption">{ref.status}</Text>
              </View>
              <Text variant="display" className="text-sm text-success">+{ref.pts} pts</Text>
            </View>
          </Card>
        ))}
        <View className="h-8" />
      </ScrollView>
    </SafeScreen>
  );
}
