'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StoreOrder } from '@/modules/portal/shared/types';

interface StoreOrdersCompletedProps {
  orders: StoreOrder[];
}

const STATUS_BADGES: Record<string, string> = {
  'picked-up': 'bg-emerald-500/15 text-emerald-400',
  cancelled: 'bg-gray-500/15 text-gray-400',
  'no-show': 'bg-red-500/15 text-red-400',
  declined: 'bg-amber-500/15 text-amber-400',
};

const COMPLETED_STATUSES: StoreOrder['status'][] = [
  'picked-up',
  'cancelled',
  'no-show',
  'declined',
];

const PAGE_SIZE = 8;

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function StoreOrdersCompleted({ orders }: StoreOrdersCompletedProps) {
  const [page, setPage] = useState(0);

  const completedOrders = orders
    .filter((o) => COMPLETED_STATUSES.includes(o.status))
    .sort(
      (a, b) =>
        new Date(b.completedAt ?? b.placedAt).getTime() -
        new Date(a.completedAt ?? a.placedAt).getTime()
    );

  const totalPages = Math.max(1, Math.ceil(completedOrders.length / PAGE_SIZE));
  const pageOrders = completedOrders.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  );

  return (
    <div className="rounded-xl border border-border-default bg-card">
      <div className="px-5 py-4 border-b border-border-default">
        <h3 className="text-sm font-semibold text-text-bright">
          Completed Orders ({completedOrders.length})
        </h3>
      </div>

      {completedOrders.length === 0 ? (
        <div className="py-12 text-center text-sm text-text-muted">
          No completed orders yet
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-default text-text-muted text-xs">
                  <th className="px-5 py-3 text-left font-medium">Order #</th>
                  <th className="px-5 py-3 text-left font-medium">Customer</th>
                  <th className="px-5 py-3 text-left font-medium">Items</th>
                  <th className="px-5 py-3 text-left font-medium">Source</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-left font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {pageOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-elevated/50 transition-colors">
                    <td className="px-5 py-3 text-text-default font-medium">
                      {order.orderNumber}
                    </td>
                    <td className="px-5 py-3 text-text-default">
                      {order.customerName}
                    </td>
                    <td className="px-5 py-3 text-text-muted">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-5 py-3 text-text-muted capitalize">
                      {order.source.replace('-', ' ')}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          'inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                          STATUS_BADGES[order.status] ?? 'bg-gray-500/15 text-gray-400'
                        )}
                      >
                        {order.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-text-muted text-xs">
                      {formatTime(order.completedAt ?? order.placedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-border-default">
              <p className="text-xs text-text-muted">
                Page {page + 1} of {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className={cn(
                    'rounded-lg p-1.5 transition-colors',
                    page === 0
                      ? 'text-text-muted/30 cursor-not-allowed'
                      : 'text-text-muted hover:bg-elevated hover:text-text-default'
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className={cn(
                    'rounded-lg p-1.5 transition-colors',
                    page >= totalPages - 1
                      ? 'text-text-muted/30 cursor-not-allowed'
                      : 'text-text-muted hover:bg-elevated hover:text-text-default'
                  )}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
