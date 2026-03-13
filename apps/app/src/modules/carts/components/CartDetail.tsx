'use client';

import { ArrowLeft } from 'lucide-react';
import { StatusBadge, LoadingSkeleton, AccentCard } from '@/components';
import { useCart } from '../hooks';
import { CartLineItems } from './CartLineItems';
import { CartActions } from './CartActions';

const ACCENT = '#F59E0B';

interface CartDetailProps {
  cartId: string;
  onBack: () => void;
}

export function CartDetail({ cartId, onBack }: CartDetailProps) {
  const { data: cart, isLoading } = useCart(cartId);

  if (isLoading) return <LoadingSkeleton variant="card" />;
  if (!cart) return null;

  const discount = 0;
  const samples = 0;
  const grandTotal = cart.total - discount - samples;

  return (
    <div className="space-y-4">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-text-muted hover:text-text-default transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Carts
      </button>

      {/* Cart header */}
      <AccentCard accentColor={ACCENT} padding="md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-text-default">
              {cart.clientName}
            </h2>
            <p className="text-sm text-text-muted">{cart.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge status={cart.status} />
            <span className="text-lg font-semibold tabular-nums" style={{ color: ACCENT }}>
              Ref# {cart.id.toUpperCase()}
            </span>
          </div>
        </div>
      </AccentCard>

      {/* Action buttons */}
      <CartActions cartId={cartId} lineItems={cart.lineItems} />

      {/* Line items */}
      <CartLineItems lineItems={cart.lineItems} />

      {/* Totals */}
      <AccentCard accentColor={ACCENT} padding="md">
        <div className="flex flex-col items-end gap-2 text-sm">
          <div className="flex items-center gap-8">
            <span className="text-text-muted">Total</span>
            <span className="tabular-nums font-medium text-text-default">
              ${cart.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex items-center gap-8">
            <span className="text-text-muted">Discount</span>
            <span className="tabular-nums text-green-400">
              ${discount.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-8">
            <span className="text-text-muted">Samples</span>
            <span className="tabular-nums text-text-default">
              ${samples.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-8 border-t border-default pt-2">
            <span className="font-semibold text-text-default">Grand Total</span>
            <span className="tabular-nums font-bold text-text-default">
              ${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </AccentCard>
    </div>
  );
}
