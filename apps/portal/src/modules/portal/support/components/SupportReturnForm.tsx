'use client';

import { useState, useMemo } from 'react';
import { RotateCcw, CheckCircle, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePortalAuth, usePortalOrders } from '@/modules/portal/shared/hooks';
import type { PortalOrder, PortalOrderItem } from '@/modules/portal/shared/types';

interface SupportReturnFormProps {
  className?: string;
}

interface ReturnLineItem {
  productId: string;
  productName: string;
  orderedQty: number;
  returnQty: number;
  selected: boolean;
}

const RETURN_REASONS = [
  'Damaged',
  'Wrong Product',
  'Quality Issue',
  'Overstock',
  'Other',
] as const;

export function SupportReturnForm({ className }: SupportReturnFormProps) {
  const { currentAccount } = usePortalAuth();
  const { data: orders } = usePortalOrders(currentAccount?.id ?? '');

  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [lineItems, setLineItems] = useState<ReturnLineItem[]>([]);
  const [reason, setReason] = useState<string>(RETURN_REASONS[0]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const recentOrders = useMemo(() => {
    if (!orders) return [];
    return orders
      .filter((o) => o.status === 'delivered' || o.status === 'paid')
      .slice(0, 10);
  }, [orders]);

  function handleOrderSelect(orderId: string) {
    setSelectedOrderId(orderId);
    const order = recentOrders.find((o) => o.id === orderId);
    if (order) {
      setLineItems(
        order.items.map((item: PortalOrderItem) => ({
          productId: item.productId,
          productName: item.productName,
          orderedQty: item.quantity,
          returnQty: 0,
          selected: false,
        }))
      );
    } else {
      setLineItems([]);
    }
  }

  function handleToggleItem(productId: string) {
    setLineItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, selected: !item.selected, returnQty: item.selected ? 0 : 1 }
          : item
      )
    );
  }

  function handleQtyChange(productId: string, qty: number) {
    setLineItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, returnQty: Math.max(0, Math.min(qty, item.orderedQty)) }
          : item
      )
    );
  }

  const hasSelectedItems = lineItems.some((i) => i.selected && i.returnQty > 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasSelectedItems) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setSelectedOrderId('');
      setLineItems([]);
      setReason(RETURN_REASONS[0]);
      setNotes('');
    }, 1000);
  }

  function handleReset() {
    setIsSubmitted(false);
  }

  if (isSubmitted) {
    return (
      <div className={cn('space-y-4', className)}>
        <h2 className="font-display text-sm font-semibold text-text-bright">
          Request a Return
        </h2>
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border-default bg-card p-8">
          <CheckCircle className="h-10 w-10 text-green-500" />
          <p className="text-sm font-medium text-text-bright">
            Return request submitted!
          </p>
          <p className="text-xs text-text-muted">
            Your sales rep will review and confirm the return within 24 hours.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-2 rounded-lg bg-accent-primary/15 px-4 py-2 text-xs font-medium text-accent-primary transition-colors hover:bg-accent-primary/25"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <h2 className="font-display text-sm font-semibold text-text-bright">
        Request a Return
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-border-default bg-card p-5"
      >
        {/* Order selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-muted">
            Select Order
          </label>
          <select
            value={selectedOrderId}
            onChange={(e) => handleOrderSelect(e.target.value)}
            className={cn(
              'w-full rounded-lg border border-border-default bg-elevated px-3 py-2',
              'text-sm text-text-default',
              'outline-none transition-colors focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/30'
            )}
          >
            <option value="">Choose a recent order...</option>
            {recentOrders.map((order: PortalOrder) => (
              <option key={order.id} value={order.id}>
                {order.orderNumber} — ${order.total.toLocaleString()} (
                {new Date(order.orderDate).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        {/* Line items */}
        {lineItems.length > 0 && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">
              Select Items to Return
            </label>
            <div className="space-y-2">
              {lineItems.map((item) => (
                <div
                  key={item.productId}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors',
                    item.selected
                      ? 'border-accent-primary/40 bg-accent-primary/5'
                      : 'border-border-default bg-elevated'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => handleToggleItem(item.productId)}
                    className="accent-accent-primary"
                  />
                  <Package className="h-4 w-4 shrink-0 text-text-muted" />
                  <span className="flex-1 text-sm text-text-default">
                    {item.productName}
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={item.orderedQty}
                      value={item.returnQty}
                      onChange={(e) =>
                        handleQtyChange(item.productId, parseInt(e.target.value) || 0)
                      }
                      disabled={!item.selected}
                      className={cn(
                        'w-16 rounded-lg border border-border-default bg-base px-2 py-1 text-center text-sm text-text-default',
                        'outline-none focus:border-accent-primary/50',
                        !item.selected && 'opacity-40'
                      )}
                    />
                    <span className="text-xs text-text-muted">
                      / {item.orderedQty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reason */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-muted">
            Reason for Return
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={cn(
              'w-full rounded-lg border border-border-default bg-elevated px-3 py-2',
              'text-sm text-text-default',
              'outline-none transition-colors focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/30'
            )}
          >
            {RETURN_REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-muted">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional details about the return..."
            rows={3}
            className={cn(
              'w-full resize-none rounded-lg border border-border-default bg-elevated px-3 py-2',
              'text-sm text-text-default placeholder:text-text-muted',
              'outline-none transition-colors focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/30'
            )}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || !hasSelectedItems}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5',
            'text-sm font-medium transition-colors',
            isSubmitting || !hasSelectedItems
              ? 'bg-elevated text-text-muted cursor-not-allowed'
              : 'bg-accent-primary text-white hover:bg-accent-primary/90'
          )}
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Submitting...
            </>
          ) : (
            <>
              <RotateCcw className="h-4 w-4" />
              Submit Return Request
            </>
          )}
        </button>
      </form>
    </div>
  );
}
