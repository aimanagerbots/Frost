import { View, FlatList, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { ArrowLeft } from 'lucide-react-native';
import { SafeScreen, Text, Badge } from '@/components';
import { colors } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

const MOCK_MERCH = [
  { id: '1', name: 'Frost Logo Tee', slug: 'frost-logo-tee', price: 35, imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80', isNew: true },
  { id: '2', name: 'Frost Hoodie', slug: 'frost-hoodie', price: 65, imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80', isNew: false },
  { id: '3', name: 'Frost Snapback', slug: 'frost-snapback', price: 28, imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=400&q=80', isNew: true },
  { id: '4', name: 'Frost Grinder', slug: 'frost-grinder', price: 45, imageUrl: 'https://images.unsplash.com/photo-1616690710400-a16d146927c5?w=400&q=80', isNew: false },
];

export default function MerchIndex() {
  const router = useRouter();
  const haptics = useHaptics();

  return (
    <SafeScreen>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={24} color={colors.text.default} />
        </Pressable>
        <Text variant="display" className="text-xl ml-3">Merch</Text>
      </View>

      <FlatList
        data={MOCK_MERCH}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              haptics.selection();
              router.push(`/merch/${item.slug}` as any);
            }}
            className="rounded-xl border border-border-default bg-card overflow-hidden active:opacity-80 m-1.5"
            style={{ width: CARD_WIDTH }}
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={{ width: '100%', height: 160 }}
              contentFit="cover"
            />
            <View className="p-3">
              {item.isNew && <Badge label="New" variant="success" size="xs" />}
              <Text variant="display" className="text-sm mt-1">{item.name}</Text>
              <Text variant="display" className="text-base text-accent-primary mt-1">${item.price}</Text>
            </View>
          </Pressable>
        )}
      />
    </SafeScreen>
  );
}
