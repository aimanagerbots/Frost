import { View, type ViewProps, Pressable, type PressableProps } from 'react-native';

type CardPadding = 'sm' | 'md' | 'lg';

interface CardProps extends ViewProps {
  padding?: CardPadding;
  glow?: boolean;
}

interface PressableCardProps extends PressableProps {
  padding?: CardPadding;
  glow?: boolean;
}

const paddingMap: Record<CardPadding, string> = {
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
};

const baseClasses = 'rounded-xl border border-border-default bg-card';

export function Card({ padding = 'md', glow, className = '', ...props }: CardProps) {
  const glowClass = glow ? 'border-accent-primary/40' : '';

  return (
    <View
      className={`${baseClasses} ${paddingMap[padding]} ${glowClass} ${className}`}
      {...props}
    />
  );
}

export function PressableCard({ padding = 'md', glow, className = '', ...props }: PressableCardProps) {
  const glowClass = glow ? 'border-accent-primary/40' : '';

  return (
    <Pressable
      className={`${baseClasses} ${paddingMap[padding]} ${glowClass} active:opacity-80 ${className}`}
      {...props}
    />
  );
}
