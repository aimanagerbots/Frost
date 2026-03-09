'use client';

import { useState, useCallback, useEffect } from 'react';
import { ShoppingCart, RefreshCw, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PortalOrder } from '@/modules/portal/shared/types';
import { usePortalCart } from '@/modules/portal/shared/hooks/use-portal-cart';
import { usePortalProducts } from '@/modules/portal/shared/hooks/use-portal-products';

interface OrderReorderButtonProps {
  order: PortalOrder;
  className?: string;
}

export function OrderReorderButton({
  order,
  className,
}: OrderReorderButtonProps) {
  const [confirmed, setConfirmed] = useState(false);
  const addItem = usePortalCart((s) => s.addItem);
  const { data: products } = usePortalProducts();

  useEffect(() => {
    if (!confirmed) return;
    const timer = setTimeout(() => setConfirmed(false), 2000);
    return () => clearTimeout(timer);
  }, [confirmed]);

  const handleReorder = useCallback(() => {
    if (!products || products.length === 0) return;

    for (const item of order.items) {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        addItem(product, item.quantity);
      }
    }

    setConfirmed(true);
  }, [order.items, products, addItem]);

  return (
    <button
      type="button"
      onClick={handleReorder}
      disabled={!products || confirmed}
      className={cn(
        'inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all',
        confirmed
          ? 'border border-green-500/20 bg-green-500/15 text-green-400'
          : 'border border-accent-primary/20 bg-accent-primary/15 text-accent-primary hover:bg-accent-primary/25 active:scale-[0.98]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    >
      {confirmed ? (
        <>
          <Check className="h-4 w-4" />
          Added to cart!
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          <RefreshCw className="h-3.5 w-3.5" />
          Order This Again
        </>
      )}
    </button>
  );
}
