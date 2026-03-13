'use client';

import { AccentCard, StatusBadge } from '@/components';
import type { PackagingOrder } from '../../types';

const ACCENT = '#84CC16';

const STATUS_ACCENT: Record<string, string> = {
  'in-progress': ACCENT,
  queued: '#FBBF24',
  completed: '#22C55E',
  'blocked-material': '#EF4444',
};

const PRIORITY_VARIANT: Record<string, 'danger' | 'warning' | 'info' | 'muted'> = {
  critical: 'danger',
  high: 'warning',
  medium: 'info',
  low: 'muted',
};

const CATEGORY_COLOR = '#84CC16';

function materialStatus(order: PackagingOrder): { label: string; color: string } {
  const hasShortage =
    order.cannabisMaterials.some((m) => m.available < m.required) ||
    order.nonCannabisMaterials.some((m) => !m.inStock);
  return hasShortage
    ? { label: 'Shortage', color: '#EF4444' }
    : { label: 'Ready', color: '#22C55E' };
}

export function PackagingWorkOrderCard({ order }: { order: PackagingOrder }) {
  const statusColor = STATUS_ACCENT[order.status] ?? '#64748B';
  const mat = materialStatus(order);
  const isBlocked = order.status === 'blocked-material';

  return (
    <AccentCard
      accentColor={statusColor}
      className={`rounded-lg p-3 space-y-2 ${isBlocked ? 'border-red-500/40 bg-red-950/10' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[10px] text-text-muted">{order.id}</span>
        <StatusBadge
          variant={PRIORITY_VARIANT[order.priority] ?? 'muted'}
          label={order.priority}
          size="sm"
        />
      </div>

      {/* Product name */}
      <p className="text-sm font-medium leading-snug text-text-bright">{order.product}</p>

      {/* SKU + Category */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-mono text-[10px] text-text-muted">{order.sku}</span>
        <span
          className="rounded-full px-1.5 py-0.5 text-[10px] font-medium"
          style={{ backgroundColor: `${CATEGORY_COLOR}20`, color: CATEGORY_COLOR }}
        >
          {order.category}
        </span>
      </div>

      {/* Quantity */}
      <div className="text-xs text-text-muted">
        <span className="font-medium text-text-default">{order.quantity.toLocaleString()}</span> units
      </div>

      {/* Material status */}
      <div className="flex items-center gap-1">
        <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: mat.color }} />
        <span className="text-[10px] text-text-muted">Materials: {mat.label}</span>
      </div>

      {/* Assignee + estimated minutes */}
      <div className="text-[10px] text-text-muted">
        {order.assignee} · {order.estimatedMinutes} min
      </div>

      {/* Progress bar — only in-progress */}
      {order.status === 'in-progress' && (
        <div>
          <div className="flex items-center justify-between text-[10px] text-text-muted mb-0.5">
            <span>In Progress</span>
            <span>50%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-elevated">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: '50%', backgroundColor: ACCENT }}
            />
          </div>
        </div>
      )}
    </AccentCard>
  );
}
