'use client';

import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type { EnvironmentStatus } from '../../types';

const STATUS_COLOR: Record<EnvironmentStatus, string> = {
  optimal: '#22C55E',
  warning: '#FBBF24',
  critical: '#EF4444',
};

const STATUS_BG: Record<EnvironmentStatus, string> = {
  optimal: 'bg-success/10',
  warning: 'bg-warning/10',
  critical: 'bg-danger/10',
};

const STATUS_BORDER: Record<EnvironmentStatus, string> = {
  optimal: 'border-success/30',
  warning: 'border-warning/30',
  critical: 'border-danger/30',
};

interface EnvironmentGaugeProps {
  label: string;
  value: number | string;
  unit: string;
  status: EnvironmentStatus;
  icon: LucideIcon;
  targetRange?: string;
  subtitle?: string;
}

export function EnvironmentGauge({
  label,
  value,
  unit,
  status,
  icon: Icon,
  targetRange,
  subtitle,
}: EnvironmentGaugeProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-xl border p-4 text-center',
        STATUS_BG[status],
        STATUS_BORDER[status]
      )}
    >
      <Icon
        className="h-5 w-5 mb-1"
        style={{ color: STATUS_COLOR[status] }}
      />
      <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
        {label}
      </span>

      <span
        className="mt-2 text-2xl font-bold leading-none"
        style={{ color: STATUS_COLOR[status] }}
      >
        {value}
      </span>
      <span className="text-[11px] text-text-muted">{unit}</span>

      {targetRange && (
        <span className="mt-1.5 text-[10px] text-text-muted">
          {targetRange}
        </span>
      )}
      {subtitle && (
        <span className="mt-1 text-[10px] text-text-muted">
          {subtitle}
        </span>
      )}
    </div>
  );
}
