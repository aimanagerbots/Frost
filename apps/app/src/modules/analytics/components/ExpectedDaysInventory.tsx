'use client';

import { StatusBadge, LoadingSkeleton } from '@/components';
import { useExpectedDaysOfInventory } from '../hooks';
import type { InventoryStatus } from '../hooks';
import { Package } from 'lucide-react';

const STATUS_VARIANT: Record<InventoryStatus, 'danger' | 'warning' | 'info' | 'success'> = {
  critical: 'danger',
  low: 'warning',
  adequate: 'info',
  surplus: 'success',
};

const STATUS_LABEL: Record<InventoryStatus, string> = {
  critical: 'Critical',
  low: 'Low',
  adequate: 'Adequate',
  surplus: 'Surplus',
};

const DAYS_COLOR: Record<InventoryStatus, string> = {
  critical: 'text-red-400',
  low: 'text-amber-400',
  adequate: 'text-blue-400',
  surplus: 'text-green-400',
};

export function ExpectedDaysInventory() {
  const { data, isLoading } = useExpectedDaysOfInventory();

  if (isLoading || !data) {
    return <LoadingSkeleton variant="card" />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((item) => {
        const progressMax = item.reorderPoint * 2;
        const progressPct = Math.min((item.currentStock / progressMax) * 100, 100);

        return (
          <div
            key={item.category}
            className="rounded-xl border border-default bg-card p-5 space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
                  <Package className="h-4 w-4 text-cyan-400" />
                </div>
                <span className="text-sm font-semibold text-text-bright">{item.category}</span>
              </div>
              <StatusBadge variant={STATUS_VARIANT[item.status]} label={STATUS_LABEL[item.status]} />
            </div>

            {/* Days of inventory - hero number */}
            <div className="text-center">
              <p className={`font-display text-4xl font-bold ${DAYS_COLOR[item.status]}`}>
                {item.daysOfInventory}
              </p>
              <p className="text-xs text-text-muted mt-1">days of inventory</p>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                <span>Stock: {item.currentStock.toLocaleString()}</span>
                <span>Reorder: {item.reorderPoint.toLocaleString()}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/[0.06]">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${progressPct}%`,
                    backgroundColor:
                      item.status === 'critical'
                        ? '#EF4444'
                        : item.status === 'low'
                          ? '#F59E0B'
                          : item.status === 'adequate'
                            ? '#3B82F6'
                            : '#22C55E',
                  }}
                />
              </div>
            </div>

            {/* Daily usage */}
            <div className="flex items-center justify-between rounded-lg bg-elevated px-3 py-2">
              <span className="text-xs text-text-muted">Daily Usage</span>
              <span className="text-sm font-mono text-text-bright">{item.dailyUsage} units/day</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
