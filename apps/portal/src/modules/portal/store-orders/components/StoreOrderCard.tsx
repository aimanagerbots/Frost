'use client';

import { Clock, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StoreOrder } from '@/modules/portal/shared/types';
import { StoreOrderActions } from './StoreOrderActions';

interface StoreOrderCardProps {
  order: StoreOrder;
  onAction: (action: string, orderId: string) => void;
  onViewDetail: (orderId: string) => void;
}

const SOURCE_COLORS: Record<StoreOrder['source'], string> = {
  dutchie: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  jane: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'frost-website': 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  weedmaps: 'bg-green-500/20 text-green-400 border-green-500/30',
  leafly: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  treez: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'walk-in': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  other: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const SOURCE_LABELS: Record<StoreOrder['source'], string> = {
  dutchie: 'Dutchie',
  jane: 'Jane',
  'frost-website': 'Frost',
  weedmaps: 'Weedmaps',
  leafly: 'Leafly',
  treez: 'Treez',
  'walk-in': 'Walk-in',
  other: 'Other',
};

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function StoreOrderCard({
  order,
  onAction,
  onViewDetail,
}: StoreOrderCardProps) {
  const visibleItems = order.items.slice(0, 3);
  const remainingCount = order.items.length - 3;

  return (
    <div
      onClick={() => onViewDetail(order.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onViewDetail(order.id);
      }}
      role="button"
      tabIndex={0}
      className="rounded-xl border border-border-default bg-card p-4 hover:border-accent-primary/30 transition-colors cursor-pointer"
    >
      {/* Top row: Source badge + Time */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={cn(
            'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
            SOURCE_COLORS[order.source]
          )}
        >
          {SOURCE_LABELS[order.source]}
        </span>
        <span className="flex items-center gap-1 text-xs text-text-muted">
          <Clock className="h-3 w-3" />
          {formatTimeAgo(order.placedAt)}
        </span>
      </div>

      {/* Order number */}
      <p className="text-xs text-text-muted mb-1">{order.orderNumber}</p>

      {/* Customer */}
      <p className="text-sm font-medium text-text-bright">{order.customerName}</p>
      <p className="text-xs text-text-muted mb-3">{order.customerPhone}</p>

      {/* Items */}
      <div className="mb-3 space-y-1">
        {visibleItems.map((item) => (
          <div
            key={item.productId}
            className="flex items-center justify-between text-xs"
          >
            <span className="text-text-default truncate mr-2">
              {item.productName}
            </span>
            <span className="text-text-muted shrink-0">x{item.quantity}</span>
          </div>
        ))}
        {remainingCount > 0 && (
          <p className="text-xs text-text-muted">+{remainingCount} more</p>
        )}
      </div>

      {/* Customer notes */}
      {order.customerNotes && (
        <div className="flex items-start gap-1.5 mb-3 rounded-lg bg-elevated px-2.5 py-1.5">
          <MessageSquare className="h-3 w-3 text-text-muted mt-0.5 shrink-0" />
          <p className="text-xs text-text-muted italic line-clamp-2">
            {order.customerNotes}
          </p>
        </div>
      )}

      {/* Actions */}
      <StoreOrderActions order={order} onAction={onAction} size="sm" />
    </div>
  );
}
