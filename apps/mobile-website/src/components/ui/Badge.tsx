import { View } from 'react-native';
import { Text } from './Text';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'muted' | 'default';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  success: { bg: 'bg-success/15', text: 'text-success', dot: 'bg-success' },
  warning: { bg: 'bg-warning/15', text: 'text-warning', dot: 'bg-warning' },
  danger: { bg: 'bg-danger/15', text: 'text-danger', dot: 'bg-danger' },
  info: { bg: 'bg-info/15', text: 'text-info', dot: 'bg-info' },
  muted: { bg: 'bg-white/5', text: 'text-text-muted', dot: 'bg-text-muted' },
  default: { bg: 'bg-accent-primary/15', text: 'text-accent-primary', dot: 'bg-accent-primary' },
};

const sizeClasses: Record<string, string> = {
  xs: 'px-1.5 py-0.5',
  sm: 'px-2 py-0.5',
  md: 'px-2.5 py-1',
};

const textSizes: Record<string, string> = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-xs',
};

export function Badge({ label, variant = 'default', size = 'sm', dot }: BadgeProps) {
  const styles = variantClasses[variant];

  return (
    <View className={`flex-row items-center rounded-full ${styles.bg} ${sizeClasses[size]}`}>
      {dot && (
        <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${styles.dot}`} />
      )}
      <Text className={`font-semibold ${textSizes[size]} ${styles.text}`}>
        {label}
      </Text>
    </View>
  );
}

// Strain type badge with auto-coloring
type StrainType = 'indica' | 'sativa' | 'hybrid' | 'cbd';

const strainVariants: Record<StrainType, BadgeVariant> = {
  indica: 'default',
  sativa: 'warning',
  hybrid: 'success',
  cbd: 'info',
};

interface StrainBadgeProps {
  type: StrainType;
  size?: 'xs' | 'sm' | 'md';
}

export function StrainBadge({ type, size = 'sm' }: StrainBadgeProps) {
  return (
    <Badge
      label={type.charAt(0).toUpperCase() + type.slice(1)}
      variant={strainVariants[type]}
      size={size}
      dot
    />
  );
}
