'use client';

import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PortalProductCard } from '@/modules/portal/shared/components';
import type { PortalProduct } from '@/modules/portal/shared/types';

interface ShopProductListProps {
  products: PortalProduct[];
  onAddToCart: (product: PortalProduct) => void;
  isLoading?: boolean;
  className?: string;
}

function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border-default bg-card animate-pulse">
      <div className="aspect-square bg-card-hover" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-4 w-3/4 rounded bg-card-hover" />
        <div className="h-3 w-1/2 rounded bg-card-hover" />
        <div className="h-3 w-2/3 rounded bg-card-hover" />
        <div className="mt-2 h-5 w-1/3 rounded bg-card-hover" />
        <div className="mt-3 h-9 w-full rounded-lg bg-card-hover" />
      </div>
    </div>
  );
}

export function ShopProductList({
  products,
  onAddToCart,
  isLoading = false,
  className,
}: ShopProductListProps) {
  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="h-5 w-40 animate-pulse rounded bg-card-hover" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-xl border border-border-default bg-card px-6 py-16',
          className
        )}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-elevated">
          <Package className="h-7 w-7 text-text-muted" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-text-bright">
          No products match your filters
        </h3>
        <p className="mt-1 text-xs text-text-muted">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <p className="text-sm text-text-muted">
        Showing{' '}
        <span className="font-medium text-text-default">
          {products.length}
        </span>{' '}
        {products.length === 1 ? 'product' : 'products'}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <PortalProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}
