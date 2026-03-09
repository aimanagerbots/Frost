'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePortalAuth, usePortalStoreOrders } from '@/modules/portal/shared/hooks';
import { PortalCard } from '@/modules/portal/shared/components';
import type { StoreOrder } from '@/modules/portal/shared/types';

const SOURCE_BADGE: Record<string, { label: string; color: string }> = {
  'frost-website': { label: 'Frost', color: 'bg-amber-500/15 text-amber-400' },
  dutchie: { label: 'Dutchie', color: 'bg-teal-500/15 text-teal-400' },
  jane: { label: 'Jane', color: 'bg-pink-500/15 text-pink-400' },
  weedmaps: { label: 'Weedmaps', color: 'bg-green-500/15 text-green-400' },
  leafly: { label: 'Leafly', color: 'bg-emerald-500/15 text-emerald-400' },
  treez: { label: 'Treez', color: 'bg-violet-500/15 text-violet-400' },
  'walk-in': { label: 'Walk-in', color: 'bg-slate-500/15 text-slate-400' },
  other: { label: 'Other', color: 'bg-slate-500/15 text-slate-400' },
};

const STATUS_COLOR: Record<string, string> = {
  new: 'text-accent-primary',
  accepted: 'text-blue-400',
  preparing: 'text-amber-400',
  ready: 'text-success',
};

function formatTimeSince(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return `${Math.floor(hours / 24)}d ago`;
}

function formatStatus(status: StoreOrder['status']): string {
  return status
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function DashboardStoreOrders() {
  const { currentAccount } = usePortalAuth();
  const { storeOrders, activeOrders } = usePortalStoreOrders();

  if (!currentAccount) return null;

  if (!currentAccount.storeOrdersEnabled) {
    return (
      <PortalCard padding="sm" className="flex flex-col">
        <div className="flex items-center gap-2 px-2 pb-3 pt-1">
          <ShoppingBag className="h-4 w-4 text-text-muted" />
          <h3 className="font-display text-sm font-semibold text-text-bright">
            Store Orders
          </h3>
        </div>
        <div className="px-2 py-6 text-center text-sm text-text-muted">
          Store Orders not enabled for this account.
        </div>
      </PortalCard>
    );
  }

  const active = activeOrders();
  const feed = active.slice(0, 3);

  return (
    <PortalCard padding="sm" className="flex flex-col">
      <div className="flex items-center justify-between px-2 pb-3 pt-1">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-text-muted" />
          <h3 className="font-display text-sm font-semibold text-text-bright">
            Store Orders
          </h3>
        </div>
        <Link
          href="/store-orders"
          className="text-xs font-medium text-accent-primary hover:text-accent-primary-hover"
        >
          View All
        </Link>
      </div>

      {/* Active count */}
      <div className="mx-2 mb-3 rounded-lg bg-accent-primary/10 px-3 py-2">
        <span className="font-display text-2xl font-bold text-accent-primary">
          {active.length}
        </span>
        <span className="ml-2 text-xs text-text-muted">
          active order{active.length !== 1 ? 's' : ''}
        </span>
      </div>

      {feed.length === 0 ? (
        <div className="px-2 py-4 text-center text-sm text-text-muted">
          No active store orders
        </div>
      ) : (
        <ul className="divide-y divide-border-default">
          {feed.map((order) => {
            const source = SOURCE_BADGE[order.source] ?? SOURCE_BADGE.other;

            return (
              <li key={order.id} className="flex items-start justify-between gap-3 px-2 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-medium text-text-default">
                      {order.orderNumber}
                    </span>
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.5 text-[10px] font-semibold',
                        source.color
                      )}
                    >
                      {source.label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-text-muted">
                    {order.customerName}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span
                    className={cn(
                      'text-xs font-medium',
                      STATUS_COLOR[order.status] ?? 'text-text-muted'
                    )}
                  >
                    {formatStatus(order.status)}
                  </span>
                  <span className="text-[11px] text-text-muted">
                    {formatTimeSince(order.placedAt)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </PortalCard>
  );
}
