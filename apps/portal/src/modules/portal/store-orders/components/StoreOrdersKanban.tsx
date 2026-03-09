'use client';

import { cn } from '@/lib/utils';
import type { StoreOrder } from '@/modules/portal/shared/types';
import { StoreOrderCard } from './StoreOrderCard';

interface StoreOrdersKanbanProps {
  orders: StoreOrder[];
  onAction: (action: string, orderId: string) => void;
  onViewDetail: (orderId: string) => void;
}

interface ColumnDef {
  label: string;
  statuses: StoreOrder['status'][];
  accentColor: string;
  emptyLabel: string;
}

const COLUMNS: ColumnDef[] = [
  {
    label: 'New',
    statuses: ['new'],
    accentColor: 'bg-amber-400',
    emptyLabel: 'No new orders',
  },
  {
    label: 'Preparing',
    statuses: ['accepted', 'preparing'],
    accentColor: 'bg-blue-400',
    emptyLabel: 'No orders in prep',
  },
  {
    label: 'Ready',
    statuses: ['ready'],
    accentColor: 'bg-emerald-400',
    emptyLabel: 'No orders ready',
  },
];

export function StoreOrdersKanban({
  orders,
  onAction,
  onViewDetail,
}: StoreOrdersKanbanProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {COLUMNS.map((column) => {
        const columnOrders = orders.filter((o) =>
          column.statuses.includes(o.status)
        );
        return (
          <div
            key={column.label}
            className="rounded-xl border border-border-default bg-elevated/50"
          >
            {/* Column header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border-default">
              <div className={cn('h-2.5 w-2.5 rounded-full', column.accentColor)} />
              <h3 className="text-sm font-semibold text-text-bright">
                {column.label}
              </h3>
              <span className="ml-auto rounded-full bg-elevated px-2 py-0.5 text-xs font-medium text-text-muted">
                {columnOrders.length}
              </span>
            </div>

            {/* Cards */}
            <div className="p-3 space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto">
              {columnOrders.length === 0 ? (
                <div className="py-8 text-center text-sm text-text-muted">
                  {column.emptyLabel}
                </div>
              ) : (
                columnOrders.map((order) => (
                  <StoreOrderCard
                    key={order.id}
                    order={order}
                    onAction={onAction}
                    onViewDetail={onViewDetail}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
