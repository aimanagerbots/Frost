'use client';

import { cn } from '@/lib/utils';
import { LoadingSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';
import { BarChart3 } from 'lucide-react';
import type { ReactNode } from 'react';

export const CHART_COLORS = {
  primary: '#5BB8E6',
  secondary: '#4A8DB8',
  tertiary: '#3D7A9E',
  success: '#00E5A0',
  warning: '#FBBF24',
  danger: '#FB7185',
  info: '#38BDF8',
  amber: '#5BB8E6',
  purple: '#4A8DB8',
  cyan: '#3D7A9E',
  // Product categories — blue shades for visual distinction
  flower: '#5BB8E6',
  preroll: '#4A8DB8',
  vaporizer: '#3D7A9E',
  concentrate: '#7ECBF0',
  edible: '#A3DCF5',
  beverage: '#2E8BAE',
} as const;

export const CHART_THEME = {
  background: 'transparent',
  gridColor: '#1E293B',
  axisColor: '#E2E8F0',
  legendColor: '#E2E8F0',
  tooltipBg: '#1E293B',
  tooltipBorder: '#334155',
  tooltipText: '#E2E8F0',
} as const;

/** Forces light legend text regardless of series fill color */
export const legendFormatter = (value: string) => (
  <span style={{ color: '#E2E8F0' }}>{value}</span>
);

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
            <h3 className="text-sm font-semibold text-text-bright">{title}</h3>
          )}
          {subtitle && (
            <p className="mt-0.5 text-xs text-text-muted">{subtitle}</p>
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
