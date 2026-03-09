'use client';

import { Sparkles, ShoppingCart } from 'lucide-react';
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

export function DashboardRecommendations() {
  const { currentAccount } = usePortalAuth();
  const { data: products } = usePortalProducts(currentAccount?.id);
  const { addItem } = usePortalCart();

  const recommended = (products ?? [])
    .filter((p) => p.isNew || p.isPopular)
    .slice(0, 3);

  if (recommended.length === 0) return null;

  return (
    <PortalCard padding="sm" className="flex flex-col">
      <div className="flex items-center gap-2 px-2 pb-3 pt-1">
        <Sparkles className="h-4 w-4 text-text-muted" />
        <h3 className="font-display text-sm font-semibold text-text-bright">
          Recommended for You
        </h3>
      </div>

      <div className="flex flex-col gap-2">
        {recommended.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-3 rounded-lg border border-border-default bg-elevated px-3 py-2.5"
          >
            <span className="text-lg">
              {CATEGORY_EMOJI[product.category] ?? '\uD83C\uDF3F'}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-default">
                {product.name}
              </p>
              <p className="text-xs text-text-muted">
                {formatCurrency(product.unitPrice)}/unit
              </p>
            </div>

            <button
              type="button"
              onClick={() => addItem(product)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5',
                'bg-accent-primary/15 text-xs font-medium text-accent-primary',
                'transition-colors hover:bg-accent-primary/25'
              )}
            >
              <ShoppingCart className="h-3 w-3" />
              Add
            </button>
          </div>
        ))}
      </div>
    </PortalCard>
  );
}
