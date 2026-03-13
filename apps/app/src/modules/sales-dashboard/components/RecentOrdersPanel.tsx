'use client';

import { ClipboardList } from 'lucide-react';
import { AccentCard, StatusBadge, LoadingSkeleton, EmptyState } from '@/components';
import type { BadgeVariant } from '@/components';
import type { SalesOrderStatus } from '@/modules/sales/types';
import { useRecentOrders } from '../hooks';

const STATUS_VARIANT: Record<SalesOrderStatus, BadgeVariant> = {
  submitted: 'info',
  sublotted: 'info',
  manifested: 'info',
  quarantined: 'warning',
  invoiced: 'warning',
  paid: 'success',
  'partially-sublotted': 'warning',
};

const ACCENT = '#F59E0B';

interface RecentOrdersPanelProps {
  myAccountsOnly: boolean;
  currentRep: string;
}

export function RecentOrdersPanel({ myAccountsOnly, currentRep }: RecentOrdersPanelProps) {
  const { data, isLoading } = useRecentOrders(myAccountsOnly, currentRep);

  if (isLoading) return <LoadingSkeleton variant="list" />;

  return (
    <AccentCard accentColor={ACCENT} padding="md">
      <h3 className="mb-4 text-center text-sm font-semibold text-text-bright">
        Recent Orders
      </h3>

      {!data || data.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No Recent Orders"
          description="No orders to display."
          accentColor={ACCENT}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-default text-left text-text-muted">
                <th className="pb-2 font-medium">Order #</th>
                <th className="pb-2 font-medium">Client</th>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.map((order) => (
                <tr key={order.id} className="group">
                  <td className="py-2.5 font-medium text-text-bright">
                    {order.orderNumber}
                  </td>
                  <td className="py-2.5 text-text-default">{order.clientName}</td>
                  <td className="py-2.5 text-text-muted">{order.submittedDate}</td>
                  <td className="py-2.5">
                    <StatusBadge variant={STATUS_VARIANT[order.status]} label={order.status} size="xs" />
                  </td>
                  <td className="py-2.5 text-right font-medium text-text-bright">
                    ${order.orderTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AccentCard>
  );
}
