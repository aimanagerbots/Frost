'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import type { MerchItem } from '@/types/merch';

interface MerchDetailClientProps {
  item: MerchItem;
}

export function MerchDetailClient({ item }: MerchDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(
    item.sizes?.[0] ?? null
  );
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Size selector */}
      {item.sizes && item.sizes.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
            Size
          </p>
          <div className="flex flex-wrap gap-2">
            {item.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-150 ${
                  selectedSize === size
                    ? 'border-[#5BB8E6] bg-[#5BB8E6]/15 text-[#5BB8E6]'
                    : 'border-white/[0.08] text-white/50 hover:border-white/20 hover:text-white/70'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity note */}
      <p className="text-xs text-white/30">
        Free shipping on orders over $50
      </p>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!item.inStock || (item.sizes && !selectedSize)}
          className={`flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold uppercase tracking-wider transition-all duration-200 ${
            added
              ? 'bg-green-500/20 text-green-400'
              : 'bg-[#5BB8E6]/15 text-[#5BB8E6] hover:bg-[#5BB8E6]/25'
          } disabled:cursor-not-allowed disabled:opacity-40`}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" />
              Added
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </>
          )}
        </button>

        <button
          type="button"
          disabled={!item.inStock}
          className="rounded-full border border-white/[0.08] px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white/60 transition-colors hover:border-white/20 hover:text-white/80 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Redeem {item.pointsCost.toLocaleString()} pts
        </button>
      </div>
    </div>
  );
}
