'use client';

import { cn } from '@/lib/utils';
import { ShoppingCart, Tag, TrendingUp, AlertCircle } from 'lucide-react';
import type { PortalProduct } from '../types';

interface PortalProductCardProps {
  product: PortalProduct;
  onAddToCart?: (product: PortalProduct) => void;
  className?: string;
}

const categoryIcons: Record<PortalProduct['category'], string> = {
  flower: '🌿',
  prerolls: '🚬',
  vaporizers: '💨',
  concentrates: '🧪',
  edibles: '🍪',
  beverages: '🥤',
};

const strainDotColor: Record<PortalProduct['strainType'], string> = {
  indica: 'bg-purple-500',
  sativa: 'bg-orange-500',
  hybrid: 'bg-green-500',
};

export function PortalProductCard({ product, onAddToCart, className }: PortalProductCardProps) {
  const hasDiscount = product.unitPrice < product.basePrice;
  const firstBreak = product.volumeBreaks[0];
  const outOfStock = !product.inStock;

  return (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md',
        outOfStock && 'opacity-60',
        className,
      )}
    >
      {/* Image placeholder */}
      <div className="relative flex h-40 items-center justify-center bg-gray-100">
        <span className="text-4xl">{categoryIcons[product.category]}</span>

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
              New
            </span>
          )}
          {product.isPopular && (
            <span className="inline-flex items-center gap-0.5 rounded-md bg-blue-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
              <TrendingUp className="h-3 w-3" />
              Popular
            </span>
          )}
          {product.promotionId && (
            <span className="inline-flex items-center gap-0.5 rounded-md bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
              <Tag className="h-3 w-3" />
              Promo
            </span>
          )}
        </div>

        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
              <AlertCircle className="h-3.5 w-3.5" />
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 text-sm font-semibold text-gray-900">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className={cn('h-2 w-2 rounded-full', strainDotColor[product.strainType])} />
          <span>{product.strainName}</span>
          <span className="capitalize text-gray-400">({product.strainType})</span>
        </div>

        <div className="text-xs text-gray-400">
          {product.packageSize} &middot; THC {product.thcMin}&ndash;{product.thcMax}%
        </div>

        {/* Price row */}
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-lg font-bold text-gray-900">
            ${product.unitPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              ${product.basePrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Volume break teaser */}
        {firstBreak && (
          <p className="text-[11px] text-amber-600">
            Buy {firstBreak.minQuantity}+ save {firstBreak.discountPercent}%
          </p>
        )}
      </div>

      {/* Add to cart */}
      <div className="border-t border-gray-100 p-3">
        <button
          type="button"
          disabled={outOfStock}
          onClick={() => onAddToCart?.(product)}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            outOfStock
              ? 'cursor-not-allowed bg-gray-100 text-gray-400'
              : 'bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700',
          )}
        >
          <ShoppingCart className="h-4 w-4" />
          {outOfStock ? 'Unavailable' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
