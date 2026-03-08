'use client';

import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { AccentCard } from './AccentCard';

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
  className?: string;
}

const TREND_CONFIG = {
  up: { icon: TrendingUp, color: 'text-success' },
  down: { icon: TrendingDown, color: 'text-danger' },
  flat: { icon: Minus, color: 'text-text-muted' },
} as const;

export function MetricCard({
  label,
  value,
  trend,
  accentColor,
  sparklineData,
  onClick,
  className,
}: MetricCardProps) {
  const TrendIcon = trend ? TREND_CONFIG[trend.direction].icon : null;
  const trendColor = trend ? TREND_CONFIG[trend.direction].color : '';

  return (
    <AccentCard
      accentColor={accentColor}
      onClick={onClick}
      className={cn('p-4', className)}
    >
      <div className="pl-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[28px] font-bold leading-tight text-text-bright">
              {value}
            </div>
            <div className="mt-1 text-xs text-text-muted">{label}</div>
          </div>
          {sparklineData && sparklineData.length > 1 && (
            <div className="h-10 w-20">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData.map((v) => ({ v }))}>
                  <Line
                    type="monotone"
                    dataKey="v"
                    stroke={accentColor}
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        {trend && TrendIcon && (
          <div className={cn('mt-2 flex items-center gap-1 text-xs', trendColor)}>
            <TrendIcon className="h-3.5 w-3.5" />
            <span className="font-medium">
              {trend.direction === 'flat' ? '0%' : `${trend.value > 0 ? '+' : ''}${trend.value}%`}
            </span>
          </div>
        )}
      </div>
    </AccentCard>
  );
}
