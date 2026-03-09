'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PortalOrder } from '@/modules/portal/shared/types';
import type { PipelineExtension } from '@/modules/portal/shared/mock-data';
import { PortalStatusBadge } from '@/modules/portal/shared/components/PortalStatusBadge';
import { OrderPipelineTracker } from './OrderPipelineTracker';

interface OrdersListProps {
  orders: PortalOrder[];
  pipelineData: Record<string, PipelineExtension | null>;
  onSelectOrder: (orderId: string) => void;
  statusFilter: string;
  dateRange: string;
  paymentFilter: string;
}

const PAGE_SIZE = 10;

const ACTIVE_STATUSES = new Set([
  'confirmed',
  'in-production',
  'packaged',
  'fulfilled',
  'shipped',
]);

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function isWithinDateRange(orderDate: string, range: string): boolean {
  if (range === 'all') return true;

  const now = new Date();
  const date = new Date(orderDate);
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  switch (range) {
    case '7d':
      return diffDays <= 7;
    case '30d':
      return diffDays <= 30;
    case '90d':
      return diffDays <= 90;
    case '6m':
      return diffDays <= 180;
    case '1y':
      return diffDays <= 365;
    default:
      return true;
  }
}

export function OrdersList({
  orders,
  pipelineData,
  onSelectOrder,
  statusFilter,
  dateRange,
  paymentFilter,
}: OrdersListProps) {
  const [page, setPage] = useState(0);

  const filteredOrders = useMemo(() => {
    const filtered = orders.filter((order) => {
      if (statusFilter !== 'all' && order.status !== statusFilter) return false;
      if (paymentFilter !== 'all' && order.paymentStatus !== paymentFilter)
        return false;
      if (!isWithinDateRange(order.orderDate, dateRange)) return false;
      return true;
    });

    // Sort by date descending
    return [...filtered].sort(
      (a, b) =>
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );
  }, [orders, statusFilter, dateRange, paymentFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const pageOrders = filteredOrders.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  return (
    <div className="rounded-xl border border-border-default bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-default">
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">
                Order #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">
                Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-text-muted">
                Items
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-text-muted">
                Total
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">
                Payment
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium text-text-muted lg:table-cell">
                Pipeline
              </th>
            </tr>
          </thead>
          <tbody>
            {pageOrders.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-sm text-text-muted"
                >
                  No orders match the current filters.
                </td>
              </tr>
            )}
            {pageOrders.map((order) => {
              const pipeline = pipelineData[order.id];
              const itemCount = order.items.reduce(
                (sum, item) => sum + item.quantity,
                0
              );
              const isActive = ACTIVE_STATUSES.has(order.status);

              return (
                <tr
                  key={order.id}
                  onClick={() => onSelectOrder(order.id)}
                  className="cursor-pointer border-b border-border-default last:border-b-0 transition-colors hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3 font-medium text-accent-primary">
                    {order.orderNumber}
                  </td>
                  <td className="px-4 py-3 text-text-muted tabular-nums">
                    {formatDate(order.orderDate)}
                  </td>
                  <td className="px-4 py-3 text-right text-text-default tabular-nums">
                    {itemCount}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-text-default tabular-nums">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    <PortalStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3">
                    <PortalStatusBadge status={order.paymentStatus} />
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    {isActive && pipeline ? (
                      <OrderPipelineTracker
                        currentStep={pipeline.pipelineStep}
                        timestamps={pipeline.pipelineStepTimestamps}
                        compact
                        className="max-w-[200px]"
                      />
                    ) : (
                      <span className="text-xs text-text-muted">--</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredOrders.length > PAGE_SIZE && (
        <div className="flex items-center justify-between border-t border-border-default px-4 py-3">
          <p className="text-xs text-text-muted">
            Showing {currentPage * PAGE_SIZE + 1}–
            {Math.min((currentPage + 1) * PAGE_SIZE, filteredOrders.length)} of{' '}
            {filteredOrders.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className={cn(
                'inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                currentPage === 0
                  ? 'cursor-not-allowed text-text-muted opacity-50'
                  : 'text-text-default hover:bg-white/[0.06]'
              )}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
              className={cn(
                'inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                currentPage >= totalPages - 1
                  ? 'cursor-not-allowed text-text-muted opacity-50'
                  : 'text-text-default hover:bg-white/[0.06]'
              )}
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
