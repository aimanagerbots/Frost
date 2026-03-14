import { ScrollView, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Leaf, BookOpen, MapPin } from 'lucide-react-native';
import { SafeScreen, Text, Card, SectionHeader } from '@/components';
import { colors } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';

const SECTIONS = [
  {
    title: 'Strain Library',
    subtitle: 'Browse indica, sativa, hybrid & CBD strains',
    icon: Leaf,
    route: '/explore/strains',
    color: colors.category.flower,
  },
  {
    title: 'Blog',
    subtitle: 'Education, strain spotlights & culture',
    icon: BookOpen,
    route: '/explore/blog',
    color: colors.accent.primary,
  },
  {
    title: 'Store Finder',
    subtitle: 'Find a Frost location near you',
    icon: MapPin,
    route: '/explore/stores',
    color: colors.status.info,
  },
];

export default function ExploreIndex() {
  const router = useRouter();
  const haptics = useHaptics();

  return (
    <SafeScreen>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <SectionHeader title="Explore" subtitle="Discover strains, stories & stores" />
        <View className="px-5">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <Pressable
                key={section.title}
                onPress={() => {
                  haptics.selection();
                  router.push(section.route as any);
                }}
                className="mb-3"
              >
                <Card padding="lg" className="active:opacity-80">
                  <View className="flex-row items-center">
                    <View
                      className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                      style={{ backgroundColor: section.color + '20' }}
                    >
                      <Icon size={24} color={section.color} />
                    </View>
                    <View className="flex-1">
                      <Text variant="display" className="text-lg">{section.title}</Text>
                      <Text variant="caption" className="mt-0.5">{section.subtitle}</Text>
                    </View>
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
