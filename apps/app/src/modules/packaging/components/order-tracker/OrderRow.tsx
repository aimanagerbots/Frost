'use client';

import { AccentCard, StatusBadge } from '@/components';
import type { PackagingOrder } from '../../types';

const ACCENT = '#84CC16';

const PACKAGING_STEPS = [
  'Receive Materials',
  'Fill/Load',
  'Seal/Close',
  'Label',
  'Shrink Wrap',
  'QC',
] as const;

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

function getCompletedStepCount(status: PackagingOrder['status']): number {
  switch (status) {
    case 'completed':
      return PACKAGING_STEPS.length;
    case 'in-progress':
      return 3;
    case 'queued':
      return 0;
    case 'blocked-material':
      return 0;
    default:
      return 0;
  }
}

export function OrderRow({ order }: { order: PackagingOrder }) {
  const statusColor = STATUS_ACCENT[order.status] ?? '#64748B';
  const completedCount = getCompletedStepCount(order.status);
  const isBlocked = order.status === 'blocked-material';
  const hasShortage =
    order.cannabisMaterials.some((m) => m.available < m.required) ||
    order.nonCannabisMaterials.some((m) => !m.inStock);

  return (
    <AccentCard
      accentColor={statusColor}
      className={`rounded-xl p-4 space-y-3 transition-all hover:bg-card-hover hover:-translate-y-0.5 ${
        isBlocked ? 'border-red-500/30 bg-red-950/10' : ''
      }`}
    >
      {/* Top row */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10px] text-text-muted">{order.id}</span>
          <span
            className="rounded-full px-1.5 py-0.5 text-[10px] font-medium"
            style={{ backgroundColor: `${CATEGORY_COLOR}20`, color: CATEGORY_COLOR }}
          >
            {order.category}
          </span>
          <StatusBadge
            variant={PRIORITY_VARIANT[order.priority] ?? 'muted'}
            label={order.priority}
            size="sm"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status badge */}
          {isBlocked ? (
            <StatusBadge variant="danger" label="Blocked" size="sm" dot />
          ) : order.status === 'completed' ? (
            <StatusBadge variant="success" label="Completed" size="sm" dot />
          ) : order.status === 'in-progress' ? (
            <StatusBadge variant="info" label="In Progress" size="sm" dot pulse />
          ) : (
            <StatusBadge variant="warning" label="Queued" size="sm" dot />
          )}

          {/* Material readiness */}
          {hasShortage ? (
            <StatusBadge variant="danger" label="Shortage" size="sm" />
          ) : (
            <StatusBadge variant="success" label="Materials Ready" size="sm" />
          )}
        </div>
      </div>

      {/* Product + SKU + Quantity */}
      <div className="flex items-center gap-3 flex-wrap">
        <p className="text-sm font-medium text-text-bright">{order.product}</p>
        <span className="font-mono text-[10px] text-text-muted">{order.sku}</span>
        <span className="text-xs text-text-muted">{order.quantity.toLocaleString()} units</span>
        <span className="text-xs text-text-muted">·</span>
        <span className="text-xs text-text-muted">{order.assignee}</span>
        <span className="text-xs text-text-muted">·</span>
        <span className="text-xs text-text-muted">{order.estimatedMinutes} min</span>
      </div>

      {/* Step progress pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
        {PACKAGING_STEPS.map((step, i) => {
          const isDone = i < completedCount;
          const isActive = order.status === 'in-progress' && i === completedCount;
          const isWarning = isBlocked && i === 0;

          let bgColor = '#1e293b'; // future
          let textColor = '#64748B';
          if (isWarning) { bgColor = '#FBBF2420'; textColor = '#FBBF24'; }
          else if (isDone) { bgColor = `${ACCENT}20`; textColor = ACCENT; }
          else if (isActive) { bgColor = `${ACCENT}15`; textColor = ACCENT; }

          return (
            <div key={step} className="flex items-center gap-1 shrink-0">
              <span
                className="whitespace-nowrap rounded-full px-1.5 py-0.5 text-[9px] font-medium transition-colors"
                style={{ backgroundColor: bgColor, color: textColor }}
              >
                {step}
              </span>
              {i < PACKAGING_STEPS.length - 1 && (
                <span className="text-[10px] text-text-muted/40">→</span>
              )}
            </div>
          );
        })}
      </div>
    </AccentCard>
  );
}
