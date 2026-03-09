'use client';

import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  OrderLineItemStatus,
  OrderItemReadinessState,
} from '@/modules/portal/shared/types';

interface OrderLineItemStatusesProps {
  lineItems: OrderLineItemStatus[];
}

const STATE_BADGE_STYLES: Record<OrderItemReadinessState, string> = {
  'ready-to-ship': 'bg-green-500/15 text-green-400 border-green-500/20',
  'packaging': 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  'in-production': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  'in-cultivation': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  'awaiting-materials': 'bg-white/[0.06] text-text-muted border-white/[0.06]',
  'lab-testing': 'bg-purple-500/15 text-purple-400 border-purple-500/20',
};

const STATE_LABELS: Record<OrderItemReadinessState, string> = {
  'ready-to-ship': 'Ready to Ship',
  'packaging': 'Packaging',
  'in-production': 'In Production',
  'in-cultivation': 'In Cultivation',
  'awaiting-materials': 'Awaiting Materials',
  'lab-testing': 'Lab Testing',
};

function getProgressColor(percent: number): string {
  if (percent >= 80) return 'bg-green-500';
  if (percent >= 40) return 'bg-accent-primary';
  return 'bg-amber-500';
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '--';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function OrderLineItemStatuses({
  lineItems,
}: OrderLineItemStatusesProps) {
  const sorted = [...lineItems].sort((a, b) => {
    if (a.isBottleneck && !b.isBottleneck) return -1;
    if (!a.isBottleneck && b.isBottleneck) return 1;
    return 0;
  });

  return (
    <div className="rounded-xl border border-border-default bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-default">
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">
                Qty
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">
                Detail
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">
                Progress
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">
                ETA
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item) => {
              const percent =
                item.quantityOrdered > 0
                  ? Math.round(
                      (item.quantityReady / item.quantityOrdered) * 100
                    )
                  : 0;

              return (
                <tr
                  key={item.productId}
                  className={cn(
                    'border-b border-border-default last:border-b-0 transition-colors',
                    item.isBottleneck &&
                      'border-l-4 border-l-amber-500 bg-amber-500/[0.04]'
                  )}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {item.isBottleneck && (
                        <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 text-amber-400" />
                      )}
                      <div>
                        <p className="font-medium text-text-default">
                          {item.productName}
                        </p>
                        <p className="text-xs text-text-muted">
                          {item.strainName} &middot; {item.packageSize}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-default">
                    <span className="text-text-bright">
                      {item.quantityReady}
                    </span>
                    <span className="text-text-muted">
                      /{item.quantityOrdered}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                        STATE_BADGE_STYLES[item.currentState]
                      )}
                    >
                      {STATE_LABELS[item.currentState]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-muted max-w-[200px] truncate">
                    {item.stateDetail}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            getProgressColor(percent)
                          )}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-xs text-text-muted">
                        {percent}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-muted">
                    {formatDate(item.estimatedReadyDate)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
