'use client';

import { useEffect, useMemo, useState } from 'react';
import { X, Minus, Plus, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
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

const STRAIN_DOT_COLORS: Record<string, string> = {
  indica: 'bg-purple-400',
  sativa: 'bg-amber-400',
  hybrid: 'bg-green-400',
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

// ─── Props ───────────────────────────────────────────────────────

interface ShopProductDetailProps {
  product: PortalProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: PortalProduct, quantity: number) => void;
  allProducts?: PortalProduct[];
}

// ─── Component ───────────────────────────────────────────────────

export function ShopProductDetail({
  product,
  isOpen,
  onClose,
  onAddToCart,
  allProducts = [],
}: ShopProductDetailProps) {
  const productId = product?.id;
  const [quantity, setQuantity] = useState(1);
  const [prevProductId, setPrevProductId] = useState(productId);

  // Reset quantity when product changes (no effect needed)
  if (productId !== prevProductId) {
    setPrevProductId(productId);
    setQuantity(1);
  }

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Related products: same category, exclude current, max 3
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p.category === product.category && p.id !== product.id && p.inStock)
      .slice(0, 3);
  }, [product, allProducts]);

  // Current effective price based on quantity
  const effectivePrice = useMemo(() => {
    if (!product) return 0;
    const applicableBreak = [...product.volumeBreaks]
      .sort((a, b) => b.minQuantity - a.minQuantity)
      .find((vb) => quantity >= vb.minQuantity);
    return applicableBreak ? applicableBreak.pricePerUnit : product.unitPrice;
  }, [product, quantity]);

  if (!product) return null;

  const emoji = CATEGORY_EMOJIS[product.category] ?? '\uD83D\uDCE6';
  const dotColor = STRAIN_DOT_COLORS[product.strainType] ?? 'bg-white/20';
  const hasDiscount = effectivePrice < product.unitPrice;

  function handleAdd() {
    if (!product) return;
    onAddToCart(product, quantity);
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={onClose}
          aria-hidden
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-[28rem] max-w-full flex-col bg-card shadow-2xl transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-default px-5 py-4">
          <h2 className="text-lg font-semibold text-text-bright">
            Product Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-white/[0.06] hover:text-text-default"
            aria-label="Close product details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Product hero */}
          <div className="border-b border-border-default px-5 py-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-elevated text-2xl">
                {emoji}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-bold text-text-bright">
                  {product.name}
                </h3>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className={cn('h-2.5 w-2.5 rounded-full', dotColor)} />
                  <span className="text-sm capitalize text-text-muted">
                    {product.strainName} &middot; {product.strainType}
                  </span>
                </div>
              </div>
            </div>

            {/* THC / CBD */}
            <div className="mt-4 flex gap-4">
              <div className="rounded-lg bg-elevated px-3 py-2">
                <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                  THC
                </p>
                <p className="text-sm font-semibold text-text-bright">
                  {product.thcMin}%&ndash;{product.thcMax}%
                </p>
              </div>
              <div className="rounded-lg bg-elevated px-3 py-2">
                <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                  CBD
                </p>
                <p className="text-sm font-semibold text-text-bright">
                  {product.cbdMin}%&ndash;{product.cbdMax}%
                </p>
              </div>
              <div className="rounded-lg bg-elevated px-3 py-2">
                <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                  Size
                </p>
                <p className="text-sm font-semibold text-text-bright">
                  {product.packageSize}
                </p>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="border-b border-border-default px-5 py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Unit Price
            </p>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-2xl font-bold text-text-bright">
                {formatCurrency(effectivePrice)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-text-muted line-through">
                  {formatCurrency(product.unitPrice)}
                </span>
              )}
            </div>
            {hasDiscount && (
              <p className="mt-1 text-xs font-medium text-green-400">
                Volume discount applied at {quantity} units
              </p>
            )}
          </div>

          {/* Volume pricing table */}
          {product.volumeBreaks.length > 0 && (
            <div className="border-b border-border-default px-5 py-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
                Volume Pricing
              </p>
              <div className="overflow-hidden rounded-lg border border-border-default">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-elevated text-left">
                      <th className="px-3 py-2 text-xs font-medium text-text-muted">
                        Quantity
                      </th>
                      <th className="px-3 py-2 text-xs font-medium text-text-muted">
                        Price/Unit
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-text-muted">
                        Savings
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-default">
                    {product.volumeBreaks.map((vb) => {
                      const isActive = quantity >= vb.minQuantity;
                      return (
                        <tr
                          key={vb.minQuantity}
                          className={cn(
                            isActive && 'bg-accent-primary/[0.06]'
                          )}
                        >
                          <td className="px-3 py-2 text-text-default">
                            {vb.minQuantity}+ units
                          </td>
                          <td className="px-3 py-2 font-medium text-text-bright">
                            {formatCurrency(vb.pricePerUnit)}
                          </td>
                          <td className="px-3 py-2 text-right text-green-400">
                            {vb.discountPercent}% off
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="border-b border-border-default px-5 py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Description
            </p>
            <p className="mt-2 text-sm leading-relaxed text-text-default">
              {product.description}
            </p>
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <div className="px-5 py-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
                Related Products
              </p>
              <div className="space-y-2">
                {relatedProducts.map((rp) => (
                  <div
                    key={rp.id}
                    className="flex items-center gap-3 rounded-lg border border-border-default bg-elevated p-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-card text-lg">
                      {CATEGORY_EMOJIS[rp.category] ?? '\uD83D\uDCE6'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text-default line-clamp-1">
                        {rp.name}
                      </p>
                      <p className="text-xs text-text-muted">
                        {rp.packageSize} &middot;{' '}
                        {formatCurrency(rp.unitPrice)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onAddToCart(rp, 1)}
                      className="shrink-0 rounded-md bg-accent-primary/15 px-2.5 py-1 text-xs font-medium text-accent-primary transition-colors hover:bg-accent-primary/25"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer: quantity + add to cart */}
        <div className="border-t border-border-default px-5 py-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-text-muted">
              Quantity
            </span>
            <div className="flex items-center rounded-lg border border-border-default">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1.5 text-text-muted transition-colors hover:bg-white/[0.04]"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="min-w-[2.5rem] text-center text-sm font-medium text-text-default">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1.5 text-text-muted transition-colors hover:bg-white/[0.04]"
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-text-muted">Line Total</span>
            <span className="font-bold text-text-bright">
              {formatCurrency(effectivePrice * quantity)}
            </span>
          </div>

          <button
            type="button"
            disabled={!product.inStock}
            onClick={handleAdd}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors',
              product.inStock
                ? 'bg-accent-primary text-white hover:bg-accent-primary-hover'
                : 'cursor-not-allowed bg-white/[0.06] text-text-muted'
            )}
          >
            <ShoppingCart className="h-4 w-4" />
            {product.inStock
              ? `Add ${quantity} to Cart`
              : 'Out of Stock'}
          </button>
        </div>
      </div>
    </>
  );
}
