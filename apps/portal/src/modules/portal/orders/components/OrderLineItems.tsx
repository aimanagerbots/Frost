'use client';

import { cn } from '@/lib/utils';
import type { PortalOrderItem } from '@/modules/portal/shared/types';

interface OrderLineItemsProps {
  items: PortalOrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

const CATEGORY_CHIP_STYLES: Record<string, string> = {
  flower: 'bg-green-500/15 text-green-400',
  prerolls: 'bg-blue-500/15 text-blue-400',
  vaporizers: 'bg-purple-500/15 text-purple-400',
  concentrates: 'bg-amber-500/15 text-amber-400',
  edibles: 'bg-pink-500/15 text-pink-400',
  beverages: 'bg-cyan-500/15 text-cyan-400',
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatCategoryLabel(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export function OrderLineItems({
  items,
  subtotal,
  discount,
  tax,
  total,
}: OrderLineItemsProps) {
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
                Category
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-text-muted">
                Qty
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-text-muted">
                Unit Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-text-muted">
                Line Total
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const chipStyle =
                CATEGORY_CHIP_STYLES[item.category] ??
                'bg-white/[0.06] text-text-muted';

              return (
                <tr
                  key={item.productId}
                  className="border-b border-border-default last:border-b-0 transition-colors hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3 font-medium text-text-default">
                    {item.productName}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        chipStyle
                      )}
                    >
                      {formatCategoryLabel(item.category)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-text-default tabular-nums">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-right text-text-muted tabular-nums">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-4 py-3 text-right text-text-default tabular-nums">
                    {formatCurrency(item.lineTotal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Financial summary footer */}
      <div className="border-t border-border-default px-4 py-4">
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex w-56 items-center justify-between text-sm">
            <span className="text-text-muted">Subtotal</span>
            <span className="text-text-default tabular-nums">
              {formatCurrency(subtotal)}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex w-56 items-center justify-between text-sm">
              <span className="text-text-muted">Discount</span>
              <span className="text-green-400 tabular-nums">
                -{formatCurrency(discount)}
              </span>
            </div>
          )}
          <div className="flex w-56 items-center justify-between text-sm">
            <span className="text-text-muted">Tax</span>
            <span className="text-text-default tabular-nums">
              {formatCurrency(tax)}
            </span>
          </div>
          <div className="mt-1 flex w-56 items-center justify-between border-t border-border-default pt-2">
            <span className="text-sm font-semibold text-text-bright">
              Total
            </span>
            <span className="text-lg font-semibold text-text-bright tabular-nums">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
