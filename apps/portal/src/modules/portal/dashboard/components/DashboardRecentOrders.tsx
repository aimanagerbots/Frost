'use client';

import Link from 'next/link';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePortalAuth, usePortalOrders } from '@/modules/portal/shared/hooks';
import { PortalCard, PortalStatusBadge } from '@/modules/portal/shared/components';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function DashboardRecentOrders() {
  const { currentAccount } = usePortalAuth();
  const { data: orders } = usePortalOrders(currentAccount?.id ?? '');

  const recent = (orders ?? [])
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    .slice(0, 5);

  return (
    <PortalCard padding="sm" className="flex flex-col">
      <div className="flex items-center justify-between px-2 pb-3 pt-1">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-text-muted" />
          <h3 className="font-display text-sm font-semibold text-text-bright">
            Recent Orders
          </h3>
        </div>
        <Link
          href="/orders"
          className="text-xs font-medium text-accent-primary hover:text-accent-primary-hover"
        >
          View All
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="px-2 py-6 text-center text-sm text-text-muted">
          No orders yet
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-default text-xs text-text-muted">
                <th className="px-2 pb-2 font-medium">Order</th>
                <th className="px-2 pb-2 font-medium">Date</th>
                <th className="px-2 pb-2 font-medium text-right">Items</th>
                <th className="px-2 pb-2 font-medium text-right">Total</th>
                <th className="px-2 pb-2 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {recent.map((order) => (
                <tr key={order.id} className="group">
                  <td className="px-2 py-2.5 font-mono text-xs text-text-default">
                    {order.orderNumber}
                  </td>
                  <td className="px-2 py-2.5 text-xs text-text-muted">
                    {formatDate(order.orderDate)}
                  </td>
                  <td className="px-2 py-2.5 text-right text-xs text-text-muted">
                    {order.items.length}
                  </td>
                  <td className="px-2 py-2.5 text-right text-xs font-medium text-text-default">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-2 py-2.5 text-right">
                    <PortalStatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PortalCard>
  );
}
