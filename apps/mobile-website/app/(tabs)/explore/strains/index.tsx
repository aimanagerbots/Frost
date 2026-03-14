import { View, FlatList, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useCallback, useMemo } from 'react';
import { ArrowLeft, Leaf } from 'lucide-react-native';
import { SafeScreen, Text, Card, StrainBadge, SearchInput } from '@/components';
import { colors } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';

const STRAIN_TYPES = ['All', 'Indica', 'Sativa', 'Hybrid', 'CBD'] as const;

const MOCK_STRAINS = [
  { id: '1', name: 'Blue Dream', slug: 'blue-dream', type: 'hybrid' as const, thc: '22-26%', effects: ['Relaxed', 'Creative', 'Euphoric'] },
  { id: '2', name: 'OG Kush', slug: 'og-kush', type: 'indica' as const, thc: '20-25%', effects: ['Relaxed', 'Sleepy', 'Happy'] },
  { id: '3', name: 'Sour Diesel', slug: 'sour-diesel', type: 'sativa' as const, thc: '19-24%', effects: ['Energized', 'Focused', 'Uplifted'] },
  { id: '4', name: 'Girl Scout Cookies', slug: 'girl-scout-cookies', type: 'hybrid' as const, thc: '25-28%', effects: ['Euphoric', 'Relaxed', 'Happy'] },
  { id: '5', name: 'Northern Lights', slug: 'northern-lights', type: 'indica' as const, thc: '16-21%', effects: ['Sleepy', 'Relaxed', 'Happy'] },
  { id: '6', name: 'Jack Herer', slug: 'jack-herer', type: 'sativa' as const, thc: '18-23%', effects: ['Creative', 'Energized', 'Focused'] },
  { id: '7', name: 'Gelato', slug: 'gelato', type: 'hybrid' as const, thc: '20-25%', effects: ['Relaxed', 'Euphoric', 'Creative'] },
  { id: '8', name: 'Granddaddy Purple', slug: 'granddaddy-purple', type: 'indica' as const, thc: '17-23%', effects: ['Sleepy', 'Relaxed', 'Happy'] },
  { id: '9', name: 'Green Crack', slug: 'green-crack', type: 'sativa' as const, thc: '15-25%', effects: ['Energized', 'Focused', 'Happy'] },
  { id: '10', name: 'Harlequin', slug: 'harlequin', type: 'cbd' as const, thc: '4-7%', effects: ['Relaxed', 'Clear', 'Pain Relief'] },
];

export default function StrainsIndex() {
  const router = useRouter();
  const haptics = useHaptics();
  const [activeFilter, setActiveFilter] = useState<typeof STRAIN_TYPES[number]>('All');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    let result = MOCK_STRAINS;
    if (activeFilter !== 'All') {
      result = result.filter((s) => s.type === activeFilter.toLowerCase());
    }
    if (search) {
      result = result.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
    }
    return result;
  }, [activeFilter, search]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <SafeScreen>
      {/* Header */}
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={24} color={colors.text.default} />
        </Pressable>
        <Text variant="display" className="text-xl ml-3">Strain Library</Text>
      </View>

      {/* Search */}
      <View className="px-5 mb-3">
        <SearchInput
          placeholder="Search strains..."
          value={search}
          onChangeText={setSearch}
          onClear={() => setSearch('')}
        />
      </View>

      {/* Filter Chips */}
      <View className="flex-row px-5 mb-3">
        {STRAIN_TYPES.map((type) => (
          <Pressable
            key={type}
            onPress={() => { haptics.selection(); setActiveFilter(type); }}
            className={`mr-2 px-3 py-1.5 rounded-full ${
              activeFilter === type ? 'bg-accent-primary' : 'bg-elevated'
            }`}
          >
            <Text className={`text-xs font-semibold ${
              activeFilter === type ? 'text-base' : 'text-text-muted'
            }`}>
              {type}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              haptics.selection();
              router.push(`/explore/strains/${item.slug}` as any);
            }}
            className="mb-3"
          >
            <Card padding="md" className="flex-row items-center active:opacity-80">
              <View className="w-10 h-10 rounded-lg bg-elevated items-center justify-center mr-3">
                <Leaf size={20} color={colors.category.flower} />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text variant="display" className="text-base mr-2">{item.name}</Text>
                  <StrainBadge type={item.type} size="xs" />
                </View>
                <Text variant="caption" className="mt-0.5">THC {item.thc}</Text>
                <Text variant="caption" numberOfLines={1}>
                  {item.effects.join(' · ')}
                </Text>
              </View>
            </Card>
          </Pressable>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent.primary}
          />
        }
      />
    </SafeScreen>
  );
}
