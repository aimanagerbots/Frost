import { Pressable, type PressableProps } from 'react-native';
import { Text } from './Text';
import { useHaptics } from '@/hooks/useHaptics';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  haptic?: boolean;
  icon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent-primary active:bg-accent-primary-hover',
  secondary: 'bg-elevated border border-border-default active:bg-card-hover',
  ghost: 'bg-transparent active:bg-elevated',
  danger: 'bg-danger/20 active:bg-danger/30',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 rounded-lg',
  md: 'px-5 py-2.5 rounded-xl',
  lg: 'px-6 py-3.5 rounded-xl',
};

const textSizes: Record<ButtonSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  haptic = true,
  icon,
  onPress,
  className = '',
  ...props
}: ButtonProps) {
  const haptics = useHaptics();

  const handlePress = (e: any) => {
    if (haptic) haptics.medium();
    onPress?.(e);
  };

  const textColor = variant === 'primary' ? 'text-base' : 'text-text-default';

  return (
    <Pressable
      className={`flex-row items-center justify-center ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onPress={handlePress}
      {...props}
    >
      {icon}
      <Text
        className={`font-semibold ${textSizes[size]} ${textColor} ${icon ? 'ml-2' : ''}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
