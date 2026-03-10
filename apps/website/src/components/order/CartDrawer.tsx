'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  useOrderStore,
  useCartItemCount,
  useCartTotal,
} from '@/stores/order-store';
import type { CartItem } from '@/types';
import { findNearestStore } from '@/lib/store-matching';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatPrice(cents: number): string {
  return `$${cents.toFixed(2)}`;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function QuantityControls({
  item,
  onUpdate,
  onRemove,
}: {
  readonly item: CartItem;
  readonly onUpdate: (slug: string, storeId: string | undefined, qty: number) => void;
  readonly onRemove: (slug: string, storeId?: string) => void;
}) {
  const decrement = () => {
    if (item.quantity <= 1) {
      onRemove(item.productSlug, item.storeId);
    } else {
      onUpdate(item.productSlug, item.storeId, item.quantity - 1);
    }
  };

  const increment = () => {
    onUpdate(item.productSlug, item.storeId, item.quantity + 1);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={decrement}
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04] text-text-default transition-colors hover:bg-white/[0.08] hover:text-text-bright"
        aria-label={`Decrease quantity of ${item.productName}`}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <span className="min-w-[1.5rem] text-center font-sans text-sm text-text-bright">
        {item.quantity}
      </span>

      <button
        type="button"
        onClick={increment}
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04] text-text-default transition-colors hover:bg-white/[0.08] hover:text-text-bright"
        aria-label={`Increase quantity of ${item.productName}`}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 2.5v7M2.5 6h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

function CartItemRow({
  item,
  storeMatch,
  onUpdate,
  onRemove,
}: {
  readonly item: CartItem;
  readonly storeMatch: { storeName: string; distance?: number; stockStatus: string } | null;
  readonly onUpdate: (slug: string, storeId: string | undefined, qty: number) => void;
  readonly onRemove: (slug: string, storeId?: string) => void;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-sans text-sm font-medium text-text-bright truncate">
          {item.productName}
        </p>
        <p className="font-sans text-xs text-text-muted mt-0.5 truncate">
          {item.brand}
        </p>
        {item.strainName && (
          <p className="font-sans text-xs text-text-muted/70 mt-0.5 truncate">
            {item.strainName}
            {item.strainType ? ` \u00b7 ${item.strainType}` : ''}
          </p>
        )}
        {/* Store match info */}
        {storeMatch ? (
          <p className="font-sans text-[11px] mt-1 truncate">
            {storeMatch.stockStatus === 'low-stock' ? (
              <span className="text-amber-400">
                &#9888; Low stock at {storeMatch.storeName}
                {storeMatch.distance != null ? ` (${storeMatch.distance.toFixed(1)}mi)` : ''}
              </span>
            ) : (
              <span className="text-emerald-400">
                &#10003; {storeMatch.storeName}
                {storeMatch.distance != null ? ` (${storeMatch.distance.toFixed(1)}mi)` : ''}
              </span>
            )}
          </p>
        ) : (
          <p className="font-sans text-[11px] text-text-muted/50 mt-1">
            Set location to check availability
          </p>
        )}
      </div>

      {/* Price + Controls */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="font-sans text-sm font-medium text-text-bright">
          {formatPrice(item.price * item.quantity)}
        </span>

        <div className="flex items-center gap-2">
          <QuantityControls item={item} onUpdate={onUpdate} onRemove={onRemove} />

          <button
            type="button"
            onClick={() => onRemove(item.productSlug, item.storeId)}
            className="ml-1 flex h-7 w-7 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
            aria-label={`Remove ${item.productName} from cart`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5.5 2h3M2 3.5h10M3.5 3.5l.5 8a1 1 0 001 1h4a1 1 0 001-1l.5-8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyCart({ onClose }: { readonly onClose: () => void }) {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      {/* Empty bag icon */}
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/[0.06]">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-text-muted">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="font-display text-lg font-semibold text-text-bright mb-1">
        Your cart is empty
      </p>
      <p className="font-sans text-sm text-text-muted mb-6">
        Browse our menu to add items
      </p>
      <button
        type="button"
        onClick={() => {
          onClose();
          router.push('/order');
        }}
        className="rounded-xl bg-[#5BB8E6] px-6 py-2.5 font-sans text-sm font-semibold text-black transition-colors hover:bg-[#4DA8D6]"
      >
        Browse Menu
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function CartDrawer() {
  const router = useRouter();
  const isCartOpen = useOrderStore((s) => s.isCartOpen);
  const setCartOpen = useOrderStore((s) => s.setCartOpen);
  const items = useOrderStore((s) => s.items);
  const userLocation = useOrderStore((s) => s.userLocation);
  const removeItem = useOrderStore((s) => s.removeItem);
  const updateQuantity = useOrderStore((s) => s.updateQuantity);
  const itemCount = useCartItemCount();
  const total = useCartTotal();

  const close = useCallback(() => setCartOpen(false), [setCartOpen]);

  /* Compute store matches for each item */
  const storeMatches = useMemo(() => {
    return items.map((item) => {
      if (item.storeId && item.storeName) {
        return { storeName: item.storeName, distance: undefined, stockStatus: item.stockStatus ?? 'in-stock' };
      }
      const match = findNearestStore(item.productSlug, userLocation);
      if (!match) return null;
      return { storeName: match.storeName, distance: match.distance, stockStatus: match.stockStatus };
    });
  }, [items, userLocation]);

  /* Lock body scroll when open */
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isCartOpen]);

  /* Close on Escape */
  useEffect(() => {
    if (!isCartOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isCartOpen, close]);

  const handleCheckout = () => {
    close();
    router.push('/order/checkout');
  };

  const isEmpty = items.length === 0;

  return (
    <>
      {/* ── Backdrop overlay ── */}
      <div
        className={`fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={close}
        aria-hidden="true"
      />

      {/* ── Drawer panel ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={[
          'fixed z-[100] flex flex-col bg-[#000] border-l border-white/[0.06]',
          'transition-transform duration-300 ease-out',
          /* Desktop: right slide-in, 440px */
          'top-0 right-0 h-full w-full max-w-[440px]',
          /* Mobile: bottom sheet */
          'max-md:top-auto max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:h-[85vh] max-md:max-w-none max-md:rounded-t-2xl max-md:border-t max-md:border-l-0',
          /* Transform */
          isCartOpen
            ? 'translate-x-0 max-md:translate-x-0 max-md:translate-y-0'
            : 'translate-x-full max-md:translate-x-0 max-md:translate-y-full',
        ].join(' ')}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4 shrink-0">
          <h2 className="font-display text-lg font-semibold text-text-bright">
            Your Cart
            {itemCount > 0 && (
              <span className="ml-2 font-sans text-sm font-normal text-text-muted">
                ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </h2>

          <button
            type="button"
            onClick={close}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/[0.06] hover:text-text-bright"
            aria-label="Close cart"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4.5 4.5l9 9M13.5 4.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        {isEmpty ? (
          <EmptyCart onClose={close} />
        ) : (
          <>
            {/* Location bar */}
            {!userLocation && (
              <div className="shrink-0 border-b border-white/[0.06] px-5 py-3">
                <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-3 py-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400 shrink-0">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
                  </svg>
                  <p className="font-sans text-xs text-amber-300/90">
                    Set your location in the header to see store availability
                  </p>
                </div>
              </div>
            )}

            {userLocation && (
              <div className="shrink-0 border-b border-white/[0.06] px-5 py-3">
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#5BB8E6] shrink-0">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
                  </svg>
                  <span className="font-sans text-xs text-text-default">{userLocation.label}</span>
                </div>
              </div>
            )}

            {/* Scrollable items area — flat list, no store groups */}
            <div className="flex-1 overflow-y-auto px-5 py-2 scrollbar-thin">
              <div className="divide-y divide-white/[0.06]">
                {items.map((item, idx) => (
                  <CartItemRow
                    key={`${item.productSlug}-${item.storeId ?? idx}`}
                    item={item}
                    storeMatch={storeMatches[idx] ?? null}
                    onUpdate={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </div>

            {/* ── Footer / Total + CTA ── */}
            <div className="shrink-0 border-t border-white/[0.06] px-5 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-semibold text-text-default">
                  Total
                </span>
                <span className="font-display text-lg font-bold text-text-bright">
                  {formatPrice(total)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="w-full rounded-xl bg-[#5BB8E6] py-3 font-sans text-sm font-bold text-black transition-colors hover:bg-[#4DA8D6] active:bg-[#3F9BC4]"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
