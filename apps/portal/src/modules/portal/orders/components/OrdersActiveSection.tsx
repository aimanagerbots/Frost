'use client';

import { Package, AlertTriangle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PortalOrder } from '@/modules/portal/shared/types';
import type { PipelineExtension } from '@/modules/portal/shared/mock-data';
import { OrderPipelineTracker } from './OrderPipelineTracker';

interface OrdersActiveSectionProps {
  orders: PortalOrder[];
  pipelineData: Record<string, PipelineExtension | null>;
  onSelectOrder: (orderId: string) => void;
}

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
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function OrdersActiveSection({
  orders,
  pipelineData,
  onSelectOrder,
}: OrdersActiveSectionProps) {
  const activeOrders = orders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'paid'
  );

  if (activeOrders.length === 0) return null;

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Package className="h-4 w-4 text-accent-primary" />
        <h2 className="text-sm font-semibold text-text-bright">
          Active Orders
        </h2>
        <span className="rounded-full bg-accent-primary/15 px-2 py-0.5 text-xs font-medium text-accent-primary">
          {activeOrders.length}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {activeOrders.map((order) => {
          const pipeline = pipelineData[order.id];
          const itemCount = order.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          );

          return (
            <button
              key={order.id}
              type="button"
              onClick={() => onSelectOrder(order.id)}
              className={cn(
                'group w-full rounded-xl border border-border-default bg-card p-4 text-left transition-all',
                'hover:border-accent-primary/40 hover:shadow-[0_0_16px_rgba(91,184,230,0.1)]'
              )}
            >
              {/* Header */}
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-text-bright">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-text-muted">
                    {formatDate(order.orderDate)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="text-right">
                    <p className="text-sm font-medium text-text-default tabular-nums">
                      {formatCurrency(order.total)}
                    </p>
                    <p className="text-xs text-text-muted">
                      {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-text-muted transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>

              {/* Mini pipeline tracker */}
              {pipeline && (
                <OrderPipelineTracker
                  currentStep={pipeline.pipelineStep}
                  timestamps={pipeline.pipelineStepTimestamps}
                  compact
                  className="mb-3"
                />
              )}

              {/* Bottleneck alert inline */}
              {pipeline?.bottleneckItem && (
                <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-3 py-2">
                  <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 text-amber-400" />
                  <p className="truncate text-xs text-amber-300">
                    Waiting on: {pipeline.bottleneckItem.productName}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
