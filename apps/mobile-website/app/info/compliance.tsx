import { ScrollView, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, AlertTriangle } from 'lucide-react-native';
import { SafeScreen, Text, Card } from '@/components';
import { colors } from '@/theme';

export default function ComplianceScreen() {
  const router = useRouter();
  return (
    <SafeScreen>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={24} color={colors.text.default} />
        </Pressable>
        <Text variant="display" className="text-xl ml-3">Compliance</Text>
      </View>
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <Card padding="md" className="mb-6 border-warning/30">
          <View className="flex-row items-start">
            <AlertTriangle size={20} color={colors.status.warning} />
            <Text variant="body" className="text-text-muted ml-3 flex-1 text-sm">
              Cannabis products are intended for use by adults 21 and older. Keep out of reach of children. Cannabis can impair concentration, coordination, and judgment. Do not operate a vehicle or machinery while under the influence.
            </Text>
          </View>
        </Card>
        <Text variant="display" className="text-base mb-2">Licensing</Text>
        <Text variant="body" className="text-text-muted leading-6 mb-4">
          Frost Cannabis Company is a licensed retailer under the Oregon Liquor and Cannabis Commission (OLCC). All products are tested by accredited laboratories and comply with state regulations.
        </Text>
        <Text variant="display" className="text-base mb-2">Testing</Text>
        <Text variant="body" className="text-text-muted leading-6 mb-8">
          Every product in our stores comes with a Certificate of Analysis (COA) from a third-party lab. COAs verify potency, terpene profiles, and the absence of harmful contaminants.
        </Text>
      </ScrollView>
    </SafeScreen>
  );
}
