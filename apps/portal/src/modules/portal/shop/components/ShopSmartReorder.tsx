'use client';

import { useMemo } from 'react';
import { Clock, Plus, ShoppingCart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  usePortalAuth,
  usePortalOrders,
  usePortalProducts,
  usePortalCart,
} from '@/modules/portal/shared/hooks';
import type { PortalProduct } from '@/modules/portal/shared/types';

// ─── Constants ───────────────────────────────────────────────────

const CATEGORY_EMOJIS: Record<string, string> = {
  flower: '\uD83C\uDF3F',
  prerolls: '\uD83D\uDEAC',
  vaporizers: '\uD83D\uDCA8',
  concentrates: '\uD83D\uDCA7',
  edibles: '\uD83C\uDF6A',
  beverages: '\uD83E\uDDCB',
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

// ─── Types ───────────────────────────────────────────────────────

interface SuggestedReorderItem {
  product: PortalProduct;
  orderCount: number;
  avgQuantity: number;
}

// ─── Props ───────────────────────────────────────────────────────

interface ShopSmartReorderProps {
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────

export function ShopSmartReorder({ className }: ShopSmartReorderProps) {
  const { currentAccount } = usePortalAuth();
  const accountId = currentAccount?.id ?? '';
  const { data: orders = [] } = usePortalOrders(accountId);
  const { data: products = [] } = usePortalProducts(accountId);
  const { addItem } = usePortalCart();

  // Analyze last 3 orders for most common products
  const suggestions = useMemo<SuggestedReorderItem[]>(() => {
    const recentOrders = orders.slice(0, 3);
    if (recentOrders.length === 0) return [];

    // Count product frequency and average quantity
    const productStats = new Map<
      string,
      { count: number; totalQty: number }
    >();

    for (const order of recentOrders) {
      for (const item of order.items) {
        const existing = productStats.get(item.productId) ?? {
          count: 0,
          totalQty: 0,
        };
        productStats.set(item.productId, {
          count: existing.count + 1,
          totalQty: existing.totalQty + item.quantity,
        });
      }
    }

    // Sort by frequency, then map to products
    const sorted = [...productStats.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 6);

    return sorted
      .map(([productId, stats]) => {
        const product = products.find((p) => p.id === productId);
        if (!product || !product.inStock) return null;
        return {
          product,
          orderCount: stats.count,
          avgQuantity: Math.round(stats.totalQty / stats.count),
        };
      })
      .filter(Boolean) as SuggestedReorderItem[];
  }, [orders, products]);

  function handleAddAll() {
    for (const item of suggestions) {
      addItem(item.product, item.avgQuantity);
    }
  }

  if (suggestions.length === 0) return null;

  return (
    <div
      className={cn(
        'rounded-xl border border-border-default bg-card p-5',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-primary/15">
            <Clock className="h-4 w-4 text-accent-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-bright">
              Quick Reorder
            </h3>
            <p className="text-xs text-text-muted">
              Based on your last {Math.min(orders.length, 3)} orders
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddAll}
          className="flex items-center gap-1.5 rounded-lg bg-accent-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-accent-primary-hover"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          Add All
        </button>
      </div>

      {/* Suggested items */}
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {suggestions.map((item) => {
          const emoji =
            CATEGORY_EMOJIS[item.product.category] ?? '\uD83D\uDCE6';
          return (
            <div
              key={item.product.id}
              className="flex items-center gap-3 rounded-lg border border-border-default bg-elevated p-3 transition-colors hover:bg-card-hover"
            >
              <span className="text-lg">{emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-default line-clamp-1">
                  {item.product.name}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                  <span>Qty: {item.avgQuantity}</span>
                  <span className="text-white/10">&middot;</span>
                  <span>{formatCurrency(item.product.unitPrice)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => addItem(item.product, item.avgQuantity)}
                className="shrink-0 rounded-md bg-accent-primary/15 p-1.5 text-accent-primary transition-colors hover:bg-accent-primary/25"
                title={`Add ${item.avgQuantity} to cart`}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
