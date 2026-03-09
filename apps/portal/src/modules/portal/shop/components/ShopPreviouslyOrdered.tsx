'use client';

import { useMemo } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, History } from 'lucide-react';
import { useRef } from 'react';
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

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

// ─── Types ───────────────────────────────────────────────────────

interface PreviouslyOrderedProduct {
  product: PortalProduct;
  lastOrderedDate: string;
}

// ─── Props ───────────────────────────────────────────────────────

interface ShopPreviouslyOrderedProps {
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────

export function ShopPreviouslyOrdered({
  className,
}: ShopPreviouslyOrderedProps) {
  const { currentAccount } = usePortalAuth();
  const accountId = currentAccount?.id ?? '';
  const { data: orders = [] } = usePortalOrders(accountId);
  const { data: products = [] } = usePortalProducts(accountId);
  const { addItem } = usePortalCart();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Extract unique previously ordered products with last order date
  const previousProducts = useMemo<PreviouslyOrderedProduct[]>(() => {
    const productMap = new Map<string, string>();

    // Orders are assumed newest-first
    for (const order of orders) {
      for (const item of order.items) {
        if (!productMap.has(item.productId)) {
          productMap.set(item.productId, order.orderDate);
        }
      }
    }

    return [...productMap.entries()]
      .map(([productId, lastDate]) => {
        const product = products.find((p) => p.id === productId);
        if (!product) return null;
        return { product, lastOrderedDate: lastDate };
      })
      .filter(Boolean) as PreviouslyOrderedProduct[];
  }, [orders, products]);

  function scrollBy(direction: 'left' | 'right') {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -280 : 280;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  if (previousProducts.length === 0) return null;

  return (
    <div className={cn('', className)}>
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <History className="h-4 w-4 text-text-muted" />
          <h3 className="text-sm font-semibold text-text-bright">
            Previously Ordered
          </h3>
          <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-xs text-text-muted">
            {previousProducts.length}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => scrollBy('left')}
            className="rounded-md p-1 text-text-muted transition-colors hover:bg-white/[0.06] hover:text-text-default"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy('right')}
            className="rounded-md p-1 text-text-muted transition-colors hover:bg-white/[0.06] hover:text-text-default"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal scroll row */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
      >
        {previousProducts.map(({ product, lastOrderedDate }) => {
          const emoji =
            CATEGORY_EMOJIS[product.category] ?? '\uD83D\uDCE6';
          return (
            <div
              key={product.id}
              className="flex w-56 shrink-0 flex-col rounded-xl border border-border-default bg-card p-4 transition-shadow hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-default line-clamp-1">
                    {product.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    Last ordered {formatRelativeDate(lastOrderedDate)}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-text-bright">
                  {formatCurrency(product.unitPrice)}
                </span>
                <span className="text-xs text-text-muted">
                  {product.packageSize}
                </span>
              </div>

              <button
                type="button"
                disabled={!product.inStock}
                onClick={() => addItem(product, 1)}
                className={cn(
                  'mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                  product.inStock
                    ? 'bg-accent-primary/15 text-accent-primary hover:bg-accent-primary/25'
                    : 'cursor-not-allowed bg-white/[0.04] text-text-muted'
                )}
              >
                <RotateCcw className="h-3 w-3" />
                {product.inStock ? 'Reorder' : 'Out of Stock'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
