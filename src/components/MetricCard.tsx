'use client';

import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

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
  flat: { icon: Minus, color: 'text-muted' },
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
    <div
      className={cn(
        'group relative rounded-xl border border-default bg-card p-4 transition-all duration-200',
        onClick && 'cursor-pointer hover:bg-card-hover hover:-translate-y-0.5',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ backgroundColor: accentColor }}
      />
      <div className="pl-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[28px] font-bold leading-tight text-bright">
              {value}
            </div>
            <div className="mt-1 text-xs text-muted">{label}</div>
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
    </div>
  );
}
