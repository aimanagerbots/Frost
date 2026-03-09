'use client';

import { X, Phone, Clock, User, MessageSquare, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StoreOrder } from '@/modules/portal/shared/types';
import { StoreOrderActions } from './StoreOrderActions';

interface StoreOrderDetailProps {
  order: StoreOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string, orderId: string) => void;
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
  'frost-website': 'Frost Website',
  weedmaps: 'Weedmaps',
  leafly: 'Leafly',
  treez: 'Treez',
  'walk-in': 'Walk-in',
  other: 'Other',
};

const STATUS_BADGES: Record<string, string> = {
  new: 'bg-amber-500/15 text-amber-400',
  accepted: 'bg-blue-500/15 text-blue-400',
  preparing: 'bg-blue-500/15 text-blue-400',
  ready: 'bg-emerald-500/15 text-emerald-400',
  'picked-up': 'bg-emerald-500/15 text-emerald-400',
  cancelled: 'bg-gray-500/15 text-gray-400',
  'no-show': 'bg-red-500/15 text-red-400',
  declined: 'bg-amber-500/15 text-amber-400',
};

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function computePrepTime(order: StoreOrder): string | null {
  if (!order.readyAt || !order.acceptedAt) return null;
  const diff = new Date(order.readyAt).getTime() - new Date(order.acceptedAt).getTime();
  const minutes = Math.round(diff / 60_000);
  return `${minutes}m`;
}

export function StoreOrderDetail({
  order,
  isOpen,
  onClose,
  onAction,
}: StoreOrderDetailProps) {
  if (!isOpen || !order) return null;

  const prepTime = computePrepTime(order);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
        }}
        role="button"
        tabIndex={-1}
        aria-label="Close drawer"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-base border-l border-border-default overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border-default bg-base px-6 py-4">
          <div>
            <p className="text-xs text-text-muted">{order.orderNumber}</p>
            <h2 className="text-lg font-semibold text-text-bright">Order Detail</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted hover:bg-elevated hover:text-text-default transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status + Source */}
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                STATUS_BADGES[order.status]
              )}
            >
              {order.status.replace('-', ' ')}
            </span>
            <span
              className={cn(
                'rounded-full border px-2 py-0.5 text-xs font-medium',
                SOURCE_COLORS[order.source]
              )}
            >
              {SOURCE_LABELS[order.source]}
            </span>
          </div>

          {/* Customer Info */}
          <div className="rounded-xl border border-border-default bg-card p-4 space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-text-muted" />
              <span className="text-sm font-medium text-text-bright">
                {order.customerName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-text-muted" />
              <span className="text-sm text-text-default">{order.customerPhone}</span>
            </div>
            {order.pickupPreference && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-text-muted" />
                <span className="text-sm text-text-default">
                  Pickup: {order.pickupPreference === 'asap' ? 'ASAP' : order.pickupPreference}
                </span>
              </div>
            )}
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-4 w-4 text-text-muted" />
              <h3 className="text-sm font-semibold text-text-bright">
                Items ({order.items.length})
              </h3>
            </div>
            <div className="rounded-xl border border-border-default bg-card divide-y divide-border-default">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm text-text-default">{item.productName}</p>
                    <p className="text-xs text-text-muted">
                      {item.strainName} &middot; {item.packageSize} &middot; {item.category}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-text-bright">x{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Notes */}
          {order.customerNotes && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-text-muted" />
                <h3 className="text-sm font-semibold text-text-bright">Customer Notes</h3>
              </div>
              <div className="rounded-xl border border-border-default bg-card px-4 py-3">
                <p className="text-sm text-text-muted italic">{order.customerNotes}</p>
              </div>
            </div>
          )}

          {/* Prep Time */}
          {prepTime && (
            <div className="rounded-xl border border-border-default bg-card px-4 py-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-text-default">
                Prep time: <span className="font-semibold text-text-bright">{prepTime}</span>
              </span>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h3 className="text-sm font-semibold text-text-bright mb-3">Timeline</h3>
            <div className="space-y-0">
              {order.statusHistory.map((entry, idx) => (
                <div key={`${entry.status}-${entry.timestamp}`} className="flex gap-3">
                  {/* Line + dot */}
                  <div className="flex flex-col items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-accent-primary mt-1.5" />
                    {idx < order.statusHistory.length - 1 && (
                      <div className="w-px flex-1 bg-border-default" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-4">
                    <p className="text-sm font-medium text-text-default capitalize">
                      {entry.status.replace('-', ' ')}
                    </p>
                    <p className="text-xs text-text-muted">{formatDateTime(entry.timestamp)}</p>
                    {entry.note && (
                      <p className="text-xs text-text-muted italic mt-0.5">{entry.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2">
            <StoreOrderActions order={order} onAction={onAction} size="md" />
          </div>
        </div>
      </div>
    </div>
  );
}
