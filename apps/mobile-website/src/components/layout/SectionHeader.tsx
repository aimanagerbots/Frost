import { View } from 'react-native';
import { Text } from '../ui/Text';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  accentColor?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-5 py-3">
      <View>
        <Text variant="display" className="text-xl">
          {title}
        </Text>
        {subtitle && (
          <Text variant="caption" className="mt-0.5">
            {subtitle}
          </Text>
        )}
      </View>
      {action}
    </View>
  );
}
