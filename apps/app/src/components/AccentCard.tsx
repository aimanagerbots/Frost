'use client';

import { cn } from '@/lib/utils';
import { useUIPreferences } from '@/stores/ui-preferences';

const PADDING_CLASSES = { sm: 'p-3', md: 'p-5', lg: 'p-6' } as const;

interface AccentCardProps {
  accentColor: string;
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AccentCard({
  accentColor,
  children,
  onClick,
  selected,
  padding,
  className,
}: AccentCardProps) {
  const cardAccent = useUIPreferences((s) => s.cardAccent);

  return (
    <div
      className={cn(
        'group relative rounded-xl border border-default bg-card transition-all duration-200',
        padding && PADDING_CLASSES[padding],
        onClick && 'cursor-pointer hover:bg-accent-hover hover:-translate-y-0.5',
        selected && 'ring-1',
        className
      )}
      style={selected ? { borderColor: accentColor, '--tw-ring-color': accentColor } as React.CSSProperties : undefined}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {/* Top accent bar */}
      {cardAccent === 'top' && (
        <div
          className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
          style={{ backgroundColor: accentColor }}
        />
      )}

      {/* Left accent bar */}
      {cardAccent === 'left' && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
          style={{ backgroundColor: accentColor }}
        />
      )}

      {children}
    </div>
  );
}
