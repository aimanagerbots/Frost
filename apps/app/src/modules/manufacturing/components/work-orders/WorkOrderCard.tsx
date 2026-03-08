'use client';

import { StatusBadge } from '@/components';
import type { WorkOrder } from '../../types';

const ACCENT = '#10B981';

const TYPE_COLORS: Record<string, string> = {
  flower: '#22C55E',
  preroll: '#84CC16',
  vaporizer: '#06B6D4',
  concentrate: '#F59E0B',
  edible: '#EC4899',
  beverage: '#8B5CF6',
};

const PRIORITY_VARIANT: Record<string, 'danger' | 'warning' | 'info' | 'muted'> = {
  critical: 'danger',
  high: 'warning',
  medium: 'info',
  low: 'muted',
};

const BOM_LABEL: Record<string, { text: string; color: string }> = {
  ready: { text: 'Materials Ready', color: '#22C55E' },
  partial: { text: 'Partial', color: '#FBBF24' },
  waiting: { text: 'Waiting', color: '#EF4444' },
};

export function WorkOrderCard({ order }: { order: WorkOrder }) {
  const typeColor = TYPE_COLORS[order.type] ?? '#666';
  const bom = BOM_LABEL[order.bomStatus] ?? BOM_LABEL.ready;
  const isBlocked = order.status === 'blocked';

  return (
    <div
      className={`rounded-lg border p-3 transition-shadow hover:shadow-md ${
        isBlocked ? 'border-red-500/40 bg-red-950/10' : 'border-default bg-card'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-mono text-text-muted">{order.id}</span>
        <StatusBadge variant={PRIORITY_VARIANT[order.priority] ?? 'muted'} label={order.priority} size="sm" />
      </div>

      {/* Title */}
      <p className="mt-1 text-sm font-medium leading-snug text-text-bright">{order.title}</p>

      {/* Type + Quantity */}
      <div className="mt-2 flex items-center gap-2">
        <span
          className="rounded-full px-1.5 py-0.5 text-[10px] font-medium"
          style={{ backgroundColor: `${typeColor}20`, color: typeColor }}
        >
          {order.pipelineType}
        </span>
        <span className="text-xs text-text-muted">
          {order.outputQuantity} {order.outputUnit}
        </span>
      </div>

      {/* Source order */}
      {order.sourceOrderId && (
        <p className="mt-1 text-[10px] text-text-muted">Source: {order.sourceOrderId}</p>
      )}

      {/* Workers */}
      <div className="mt-2 text-xs text-text-muted">
        {order.workers.join(', ')}
      </div>

      {/* Progress bar (only if in progress) */}
      {order.status === 'in-progress' && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-[10px] text-text-muted">
            <span>{order.progress}%</span>
            <span>
              Due {new Date(order.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-elevated">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${order.progress}%`, backgroundColor: ACCENT }}
            />
          </div>
        </div>
      )}

      {/* BOM Status */}
      <div className="mt-2 flex items-center gap-1">
        <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: bom.color }} />
        <span className="text-[10px] text-text-muted">{bom.text}</span>
      </div>
    </div>
  );
}
