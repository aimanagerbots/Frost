'use client';

import { Package, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PortalProduct } from '../types';

const STRAIN_DOT_COLORS: Record<string, string> = {
  indica: 'bg-purple-400',
  sativa: 'bg-amber-400',
  hybrid: 'bg-green-400',
};

interface PortalProductCardProps {
  product: PortalProduct;
  onAddToCart?: (product: PortalProduct) => void;
  className?: string;
}

export function PortalProductCard({
  product,
  onAddToCart,
  className,
}: PortalProductCardProps) {
  const hasBadge = product.isNew || product.isPopular || product.promotionId;
  const nextBreak = product.volumeBreaks[0];

  return (
    <div
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl border border-border-default bg-card transition-shadow hover:shadow-lg',
        className
      )}
    >
      {/* Image area */}
      <div className="relative aspect-square bg-elevated">
        {/* Placeholder icon */}
        <div className="flex h-full items-center justify-center">
          <Package className="h-12 w-12 text-text-muted/30" />
        </div>

        {/* Badges */}
        {hasBadge && (
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {product.isNew && (
              <span className="rounded-md bg-accent-primary px-2 py-0.5 text-[10px] font-semibold text-white">
                New
              </span>
            )}
            {product.isPopular && (
              <span className="rounded-md bg-blue-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                Popular
              </span>
            )}
            {product.promotionId && (
              <span className="rounded-md bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                Promo
              </span>
            )}
          </div>
        )}

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-lg bg-black/80 px-3 py-1.5 text-sm font-semibold text-white">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Product name */}
        <h3 className="text-sm font-semibold text-text-bright line-clamp-1">
          {product.name}
        </h3>

        {/* Strain info */}
        <div className="mt-1 flex items-center gap-1.5">
          <span
            className={cn(
              'h-2 w-2 rounded-full',
              STRAIN_DOT_COLORS[product.strainType] ?? 'bg-white/20'
            )}
          />
          <span className="text-xs capitalize text-text-muted">
            {product.strainName} &middot; {product.strainType}
          </span>
        </div>

        {/* Package & THC */}
        <div className="mt-1.5 flex items-center gap-2 text-xs text-text-muted">
          <span>{product.packageSize}</span>
          <span className="text-white/10">|</span>
          <span>
            THC {product.thcMin}–{product.thcMax}%
          </span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-base font-bold text-text-bright">
            ${product.unitPrice.toFixed(2)}
          </span>
          {product.basePrice > product.unitPrice && (
            <span className="text-xs text-text-muted line-through">
              ${product.basePrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Volume break teaser */}
        {nextBreak && (
          <p className="mt-1 text-[10px] font-medium text-accent-primary">
            Buy {nextBreak.minQuantity}+ for {nextBreak.discountPercent}% off
          </p>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Add to cart */}
        <div className="mt-3 border-t border-border-default pt-3">
          <button
            type="button"
            disabled={!product.inStock}
            onClick={() => onAddToCart?.(product)}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
              product.inStock
                ? 'bg-accent-primary text-white hover:bg-accent-primary-hover'
                : 'cursor-not-allowed bg-white/[0.06] text-text-muted'
            )}
          >
            <ShoppingCart className="h-4 w-4" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}
