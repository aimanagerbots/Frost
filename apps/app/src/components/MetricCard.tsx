'use client';

import { cn } from '@/lib/utils';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Trend {
  value: number;
  direction: 'up' | 'down' | 'flat';
}

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: Trend;
  accentColor: string;
  sparklineData?: number[];
  onClick?: () => void;
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
}

const TREND_CONFIG = {
  up: { icon: TrendingUp, color: 'text-success' },
  down: { icon: TrendingDown, color: 'text-danger' },
  flat: { icon: Minus, color: 'text-text-muted' },
} as const;

const PADDING_CLASSES = { sm: 'p-3', md: 'p-5', lg: 'p-6' } as const;

export function MetricCard({
  label,
  value,
  trend,
  accentColor,
  sparklineData: _sparklineData,
  onClick,
  padding = 'md',
  className,
}: MetricCardProps) {
  const TrendIcon = trend ? TREND_CONFIG[trend.direction].icon : null;
  const trendColor = trend ? TREND_CONFIG[trend.direction].color : '';

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
      className={cn(
        'rounded-xl bg-card',
        PADDING_CLASSES[padding],
        onClick && 'cursor-pointer transition-colors hover:bg-card-hover',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accentColor}1A` }}
        >
          <Activity className="h-4 w-4" style={{ color: accentColor }} />
        </div>
        <div className="min-w-0">
          <p className="font-display text-lg font-bold text-text-bright">{value}</p>
          <p className="text-xs text-text-muted">{label}</p>
        </div>
      </div>
      {trend && TrendIcon && (
        <div className={cn('mt-2 flex items-center gap-1 text-[11px]', trendColor)}>
          <TrendIcon className="h-3 w-3" />
          <span className="font-medium">
            {trend.direction === 'flat' ? '0%' : `${trend.value > 0 ? '+' : ''}${trend.value}%`}
          </span>
        </div>
      )}
    </div>
  );
}
