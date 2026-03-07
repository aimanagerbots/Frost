'use client';

import { cn } from '@/lib/utils';
import { LoadingSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';
import { BarChart3 } from 'lucide-react';
import type { ReactNode } from 'react';

export const CHART_COLORS = {
  primary: '#667EEA',
  secondary: '#764BA2',
  tertiary: '#F093FB',
  success: '#00E5A0',
  warning: '#FBBF24',
  danger: '#FB7185',
  info: '#38BDF8',
  amber: '#F59E0B',
  purple: '#8B5CF6',
  cyan: '#06B6D4',
  // Product categories
  flower: '#22C55E',
  preroll: '#84CC16',
  vaporizer: '#06B6D4',
  concentrate: '#F59E0B',
  edible: '#EC4899',
  beverage: '#8B5CF6',
} as const;

export const CHART_THEME = {
  background: 'transparent',
  gridColor: '#1A1F2E',
  axisColor: '#E2E8F0',
  legendColor: '#E2E8F0',
  tooltipBg: '#1A1F2E',
  tooltipBorder: '#2A3040',
  tooltipText: '#C8D0E0',
} as const;

interface ChartWrapperProps {
  title?: string;
  subtitle?: string;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  height?: number;
  children: ReactNode;
  className?: string;
}

export function ChartWrapper({
  title,
  subtitle,
  loading = false,
  empty = false,
  emptyMessage = 'No data available',
  height = 300,
  children,
  className,
}: ChartWrapperProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-default bg-card p-4',
        className
      )}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-sm font-semibold text-bright">{title}</h3>
          )}
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted">{subtitle}</p>
          )}
        </div>
      )}
      <div style={{ height }}>
        {loading ? (
          <LoadingSkeleton variant="chart" />
        ) : empty ? (
          <EmptyState
            icon={BarChart3}
            title="No Data"
            description={emptyMessage}
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
}
