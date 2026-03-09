'use client';

import { ClipboardList, Clock, CheckCircle, AlertTriangle, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StoreOrderStats } from '@/modules/portal/shared/types';

interface StoreOrdersHeaderProps {
  stats: StoreOrderStats | null;
  viewMode: 'board' | 'list';
  onViewModeChange: (mode: 'board' | 'list') => void;
}

const STAT_ITEMS = [
  {
    key: 'ordersToday',
    label: 'Orders Today',
    icon: ClipboardList,
    format: (v: number) => String(v),
    color: 'text-accent-primary',
  },
  {
    key: 'avgPrepTime',
    label: 'Avg Prep Time',
    icon: Clock,
    format: (v: number) => `${v}m`,
    color: 'text-blue-400',
  },
  {
    key: 'fillRate',
    label: 'Fill Rate',
    icon: CheckCircle,
    format: (v: number) => `${v}%`,
    color: 'text-emerald-400',
  },
  {
    key: 'noShowRate',
    label: 'No-Show Rate',
    icon: AlertTriangle,
    format: (v: number) => `${v}%`,
    color: 'text-amber-400',
  },
] as const;

function getStatValue(stats: StoreOrderStats, key: string): number {
  switch (key) {
    case 'ordersToday':
      return stats.ordersToday;
    case 'avgPrepTime':
      return stats.avgPrepTimeMinutes;
    case 'fillRate':
      return stats.fillRate;
    case 'noShowRate':
      return stats.noShowRate;
    default:
      return 0;
  }
}

export function StoreOrdersHeader({
  stats,
  viewMode,
  onViewModeChange,
}: StoreOrdersHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {STAT_ITEMS.map((item) => {
          const Icon = item.icon;
          const value = stats ? getStatValue(stats, item.key) : 0;
          return (
            <div
              key={item.key}
              className="rounded-xl border border-border-default bg-card px-4 py-3"
            >
              <div className="flex items-center gap-2 text-text-muted text-xs">
                <Icon className={cn('h-3.5 w-3.5', item.color)} />
                {item.label}
              </div>
              <p className={cn('mt-1 text-xl font-semibold text-text-bright', item.color)}>
                {item.format(value)}
              </p>
            </div>
          );
        })}
      </div>

      {/* View Toggle */}
      <div className="flex items-center rounded-lg border border-border-default bg-elevated p-0.5">
        <button
          type="button"
          onClick={() => onViewModeChange('board')}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors',
            viewMode === 'board'
              ? 'bg-accent-primary/20 text-accent-primary'
              : 'text-text-muted hover:text-text-default'
          )}
        >
          <LayoutGrid className="h-4 w-4" />
          Board
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange('list')}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors',
            viewMode === 'list'
              ? 'bg-accent-primary/20 text-accent-primary'
              : 'text-text-muted hover:text-text-default'
          )}
        >
          <List className="h-4 w-4" />
          List
        </button>
      </div>
    </div>
  );
}
