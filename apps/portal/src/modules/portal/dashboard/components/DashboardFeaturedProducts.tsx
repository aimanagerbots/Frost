'use client';

import { Star, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePortalAuth, usePortalProducts, usePortalCart } from '@/modules/portal/shared/hooks';
import { PortalCard } from '@/modules/portal/shared/components';

const CATEGORY_EMOJI: Record<string, string> = {
  flower: '\uD83C\uDF3F',
  prerolls: '\uD83D\uDEAC',
  vaporizers: '\uD83D\uDCA8',
  concentrates: '\uD83D\uDCA7',
  edibles: '\uD83C\uDF6C',
  beverages: '\uD83E\uDD64',
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function DashboardFeaturedProducts() {
  const { currentAccount } = usePortalAuth();
  const { data: products } = usePortalProducts(currentAccount?.id);
  const { addItem } = usePortalCart();

  const featured = (products ?? [])
    .filter((p) => p.isNew || p.isPopular)
    .slice(0, 8);

  if (featured.length === 0) return null;

  return (
    <PortalCard padding="sm" className="flex flex-col">
      <div className="flex items-center gap-2 px-2 pb-3 pt-1">
        <Star className="h-4 w-4 text-text-muted" />
        <h3 className="font-display text-sm font-semibold text-text-bright">
          Featured Products
        </h3>
      </div>

      <div className="flex gap-3 overflow-x-auto scroll-smooth px-2 pb-2 snap-x snap-mandatory">
        {featured.map((product) => (
          <div
            key={product.id}
            className={cn(
              'flex w-44 shrink-0 snap-start flex-col rounded-lg border border-border-default bg-elevated p-3',
              'transition-colors hover:border-accent-primary/30'
            )}
          >
            <span className="text-2xl">
              {CATEGORY_EMOJI[product.category] ?? '\uD83C\uDF3F'}
            </span>

            <p className="mt-2 truncate text-sm font-medium text-text-default">
              {product.name}
            </p>
            <p className="mt-0.5 truncate text-xs text-text-muted">
              {product.strainName}
            </p>
            <p className="mt-1 text-sm font-semibold text-text-bright">
              {formatCurrency(product.unitPrice)}
              <span className="text-xs font-normal text-text-muted">/unit</span>
            </p>

            <button
              type="button"
              onClick={() => addItem(product)}
              className={cn(
                'mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-1.5',
                'bg-accent-primary/15 text-xs font-medium text-accent-primary',
                'transition-colors hover:bg-accent-primary/25'
              )}
            >
              <ShoppingCart className="h-3 w-3" />
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </PortalCard>
  );
}
