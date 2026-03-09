'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  useOrderStore,
  useCartItemCount,
  useCartTotal,
  useStoreGroups,
  useIsMultiStore,
} from '@/stores/order-store';
import type { CartItem } from '@/types';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatPrice(cents: number): string {
  return `$${cents.toFixed(2)}`;
}

function groupSubtotal(items: readonly CartItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
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
  readonly onUpdate: (slug: string, storeId: string, qty: number) => void;
  readonly onRemove: (slug: string, storeId: string) => void;
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
  onUpdate,
  onRemove,
}: {
  readonly item: CartItem;
  readonly onUpdate: (slug: string, storeId: string, qty: number) => void;
  readonly onRemove: (slug: string, storeId: string) => void;
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
            {item.strainType ? ` · ${item.strainType}` : ''}
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

function StoreGroup({
  storeName,
  items,
  onUpdate,
  onRemove,
}: {
  readonly storeName: string;
  readonly items: readonly CartItem[];
  readonly onUpdate: (slug: string, storeId: string, qty: number) => void;
  readonly onRemove: (slug: string, storeId: string) => void;
}) {
  return (
    <div className="mb-4">
      {/* Store header */}
      <div className="flex items-center gap-2 mb-1 px-1">
        <span className="font-display text-xs font-semibold uppercase tracking-wider text-[#5BB8E6]">
          {storeName}
        </span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      {/* Items */}
      <div className="bg-card rounded-xl border border-white/[0.06] px-4 divide-y divide-white/[0.06]">
        {items.map((item) => (
          <CartItemRow
            key={`${item.productSlug}-${item.storeId}`}
            item={item}
            onUpdate={onUpdate}
            onRemove={onRemove}
          />
        ))}
      </div>

      {/* Subtotal */}
      <div className="flex justify-between items-center mt-2 px-1">
        <span className="font-sans text-xs text-text-muted">Subtotal</span>
        <span className="font-sans text-sm font-medium text-text-default">
          {formatPrice(groupSubtotal(items))}
        </span>
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
  const removeItem = useOrderStore((s) => s.removeItem);
  const updateQuantity = useOrderStore((s) => s.updateQuantity);
  const itemCount = useCartItemCount();
  const total = useCartTotal();
  const storeGroups = useStoreGroups();
  const isMultiStore = useIsMultiStore();

  const close = useCallback(() => setCartOpen(false), [setCartOpen]);

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

  const storeCount = storeGroups.size;
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
            {/* Scrollable items area */}
            <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-thin">
              {/* Multi-store warning */}
              {isMultiStore && (
                <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3">
                  <span className="text-base leading-none mt-0.5" aria-hidden="true">
                    &#9888;
                  </span>
                  <p className="font-sans text-xs text-amber-300/90 leading-relaxed">
                    <span className="font-semibold">{storeCount} pickup locations</span>
                    {' '}&mdash; your order will be split into separate pickups
                  </p>
                </div>
              )}

              {/* Store groups */}
              {Array.from(storeGroups.entries()).map(([storeId, groupItems]) => {
                const storeName = groupItems[0]?.storeName ?? storeId;
                return (
                  <StoreGroup
                    key={storeId}
                    storeName={storeName}
                    items={groupItems}
                    onUpdate={updateQuantity}
                    onRemove={removeItem}
                  />
                );
              })}
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
