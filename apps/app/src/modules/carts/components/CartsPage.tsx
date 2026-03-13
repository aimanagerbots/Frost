'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Sparkles, ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components';
import { CartsTable } from './CartsTable';
import { CartDetail } from './CartDetail';
import type { Cart } from '@/modules/sales/types';
import { useCartStore } from '../store';

const ACCENT = '#F59E0B';

export function CartsPage() {
  const [selectedCartId, setSelectedCartId] = useState<string | null>(null);
  const pendingCart = useCartStore((s) => s.pendingCart);
  const clearPendingCart = useCartStore((s) => s.clearPendingCart);

  const handleSelectCart = (cart: Cart) => {
    setSelectedCartId(cart.id);
  };

  const handleBack = () => {
    setSelectedCartId(null);
  };

  const handleViewPendingCart = () => {
    if (pendingCart) {
      setSelectedCartId(pendingCart.id);
    }
  };

  // Clear pending cart when navigating away from the detail view
  useEffect(() => {
    if (!selectedCartId && pendingCart) {
      // User left the detail view — keep the banner until they explicitly navigate to it
    }
  }, [selectedCartId, pendingCart]);

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={ShoppingCart}
        title="Carts"
        subtitle="Manage open carts, allocate inventory, and submit orders"
        accentColor={ACCENT}
      />

      {/* AI-generated cart banner */}
      {pendingCart && !selectedCartId && (
        <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20">
              <Sparkles size={16} className="text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-300">AI-generated cart ready for review</p>
              <p className="text-xs text-text-muted">{pendingCart.name} &mdash; {pendingCart.itemCount} items, ${pendingCart.total.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleViewPendingCart}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-black transition-colors hover:opacity-90"
              style={{ backgroundColor: ACCENT }}
            >
              View Cart
              <ArrowRight size={14} />
            </button>
            <button
              onClick={clearPendingCart}
              className="rounded-lg px-3 py-1.5 text-xs text-text-muted hover:text-text-default transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {selectedCartId ? (
        <CartDetail cartId={selectedCartId} onBack={handleBack} />
      ) : (
        <CartsTable onSelectCart={handleSelectCart} />
      )}
    </div>
  );
}
