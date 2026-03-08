'use client';

import { AccentCard, StatusBadge } from '@/components';
import type { WorkOrder } from '../../types';
import { ACCENT } from '@/design/colors';


const TYPE_COLORS: Record<string, string> = {
  flower: '#5BB8E6',
  preroll: '#5BB8E6',
  vaporizer: '#5BB8E6',
  concentrate: '#5BB8E6',
  edible: '#5BB8E6',
  beverage: '#5BB8E6',
};

const PRIORITY_VARIANT: Record<string, 'danger' | 'warning' | 'info' | 'muted'> = {
  critical: 'danger',
  high: 'warning',
  medium: 'info',
  low: 'muted',
};

const STATUS_ACCENT: Record<string, string> = {
  'in-progress': '#5BB8E6',
  active: '#5BB8E6',
  completed: '#00E5A0',
  pending: '#FBBF24',
  queued: '#FBBF24',
  cancelled: '#FB7185',
  'on-hold': '#FB7185',
  blocked: '#FB7185',
};

const BOM_LABEL: Record<string, { text: string; color: string }> = {
  ready: { text: 'Materials Ready', color: '#5BB8E6' },
  partial: { text: 'Partial', color: '#5BB8E6' },
  waiting: { text: 'Waiting', color: '#EF4444' },
};

export function WorkOrderCard({ order }: { order: WorkOrder }) {
  const typeColor = TYPE_COLORS[order.type] ?? '#666';
  const bom = BOM_LABEL[order.bomStatus] ?? BOM_LABEL.ready;
  const isBlocked = order.status === 'blocked';
  const statusColor = STATUS_ACCENT[order.status] ?? '#5BB8E6';

  return (
    <AccentCard
      accentColor={statusColor}
      className={`rounded-lg p-3 ${isBlocked ? 'border-red-500/40 bg-red-950/10' : ''}`}
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
    </AccentCard>
  );
}
