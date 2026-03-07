'use client';

import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type { EnvironmentStatus } from '../../types';

const STATUS_COLOR: Record<EnvironmentStatus, string> = {
  optimal: '#22C55E',
  warning: '#F59E0B',
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
  value: number;
  target: number;
  unit: string;
  status: EnvironmentStatus;
  icon: LucideIcon;
}

export function EnvironmentGauge({
  label,
  value,
  target,
  unit,
  status,
  icon: Icon,
}: EnvironmentGaugeProps) {
  // Bar fill: ratio of current to target, clamped 0-100
  const ratio = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 50;

  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-xl border p-4 text-center',
        STATUS_BG[status],
        STATUS_BORDER[status]
      )}
    >
      {/* Icon + Label */}
      <Icon
        className="h-5 w-5 mb-1"
        style={{ color: STATUS_COLOR[status] }}
      />
      <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
        {label}
      </span>

      {/* Current Value */}
      <span
        className="mt-2 text-2xl font-bold leading-none"
        style={{ color: STATUS_COLOR[status] }}
      >
        {value}
      </span>
      <span className="text-[11px] text-text-muted">{unit}</span>

      {/* Target */}
      <span className="mt-1.5 text-[10px] text-text-muted">
        Target: {target} {unit}
      </span>

      {/* Bar */}
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-elevated">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${ratio}%`,
            backgroundColor: STATUS_COLOR[status],
          }}
        />
      </div>
    </div>
  );
}
