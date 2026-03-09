'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, FileCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PortalDelivery } from '@/modules/portal/shared/types';
import { PortalStatusBadge } from '@/modules/portal/shared/components/PortalStatusBadge';

interface DeliveriesHistoryProps {
  deliveries: PortalDelivery[];
}

const PAGE_SIZE = 8;

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function DeliveriesHistory({ deliveries }: DeliveriesHistoryProps) {
  const [page, setPage] = useState(0);

  const delivered = useMemo(
    () => deliveries.filter((d) => d.status === 'delivered'),
    [deliveries]
  );

  const totalPages = Math.max(1, Math.ceil(delivered.length / PAGE_SIZE));
  const pageItems = delivered.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  );

  if (delivered.length === 0) {
    return (
      <div className="rounded-xl border border-border-default bg-card p-8 text-center">
        <FileCheck className="mx-auto mb-3 h-8 w-8 text-text-muted" />
        <p className="text-sm text-text-muted">No delivery history yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-text-bright">
        Delivery History
      </h2>

      <div className="overflow-x-auto rounded-xl border border-border-default bg-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-default text-xs text-text-muted">
              <th className="px-4 py-3 font-medium">Order #</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Window</th>
              <th className="px-4 py-3 font-medium">Driver</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Signature</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((delivery) => (
              <tr
                key={delivery.id}
                className="border-b border-border-default last:border-0 transition-colors hover:bg-elevated/50"
              >
                <td className="px-4 py-3 font-medium text-text-bright">
                  {delivery.orderNumber}
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {formatDate(delivery.deliveredAt ?? delivery.scheduledDate)}
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {delivery.scheduledWindow.start} &ndash;{' '}
                  {delivery.scheduledWindow.end}
                </td>
                <td className="px-4 py-3 text-text-default">
                  {delivery.driver.name}
                </td>
                <td className="px-4 py-3">
                  <PortalStatusBadge status={delivery.status} />
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {delivery.signature ? (
                    <span className="inline-flex items-center gap-1 text-green-400">
                      <FileCheck className="h-3.5 w-3.5" />
                      Signed
                    </span>
                  ) : (
                    <span className="text-text-muted">&mdash;</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-text-muted">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
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
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
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
    </div>
  );
}
