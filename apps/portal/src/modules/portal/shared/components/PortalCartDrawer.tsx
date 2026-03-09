'use client';

import { useEffect, useState } from 'react';
import {
  X,
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  Save,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePortalCart } from '../hooks';

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents);
}

const CATEGORY_CHIP_COLORS: Record<string, string> = {
  flower: 'bg-green-500/15 text-green-400',
  prerolls: 'bg-purple-500/15 text-purple-400',
  vaporizers: 'bg-blue-500/15 text-blue-400',
  concentrates: 'bg-orange-500/15 text-orange-400',
  edibles: 'bg-pink-500/15 text-pink-400',
  beverages: 'bg-cyan-500/15 text-cyan-400',
};

interface PortalCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PortalCartDrawer({ isOpen, onClose }: PortalCartDrawerProps) {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    totalDiscount,
    saveAsTemplate,
  } = usePortalCart();
  const [templateName, setTemplateName] = useState('');
  const [showSaved, setShowSaved] = useState(false);

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

  function handleSaveTemplate() {
    if (!templateName.trim()) return;
    saveAsTemplate(templateName.trim());
    setTemplateName('');
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.product.unitPrice,
    0
  );
  const discount = totalDiscount();
  const total = totalPrice();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 transition-opacity"
          onClick={onClose}
          aria-hidden
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-96 flex-col bg-card shadow-2xl transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-default px-5 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-text-bright">
              Your Cart
            </h2>
            {totalItems() > 0 && (
              <span className="rounded-full bg-accent-primary/15 px-2 py-0.5 text-xs font-medium text-accent-primary">
                {totalItems()}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-white/[0.06] hover:text-text-default"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-16">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.04]">
                <ShoppingCart className="h-7 w-7 text-text-muted" />
              </div>
              <p className="text-sm font-medium text-text-muted">
                Your cart is empty
              </p>
              <p className="mt-1 text-xs text-text-muted">
                Browse products to start an order
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border-default">
              {items.map((item) => {
                const chipColor =
                  CATEGORY_CHIP_COLORS[item.product.category] ??
                  'bg-white/[0.06] text-text-muted';
                const lineTotal = item.quantity * item.product.unitPrice;

                return (
                  <div key={item.product.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text-default">
                          {item.product.name}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span
                            className={cn(
                              'rounded-md px-1.5 py-0.5 text-[10px] font-medium capitalize',
                              chipColor
                            )}
                          >
                            {item.product.category}
                          </span>
                          <span className="text-xs text-text-muted">
                            {item.product.packageSize}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="rounded-md p-1 text-text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity controls */}
                      <div className="flex items-center rounded-lg border border-border-default">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                          className="px-2 py-1 text-text-muted transition-colors hover:bg-white/[0.04]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-[2rem] text-center text-sm text-text-default">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                          className="px-2 py-1 text-text-muted transition-colors hover:bg-white/[0.04]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Line total */}
                      <div className="text-right">
                        <p className="text-sm font-medium text-text-bright">
                          {formatCurrency(lineTotal)}
                        </p>
                        {item.appliedDiscount && (
                          <p className="text-[10px] text-green-400">
                            -{formatCurrency(item.appliedDiscount.savedAmount)}{' '}
                            {item.appliedDiscount.label}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border-default px-5 py-4">
            {/* Totals */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Subtotal</span>
                <span className="text-text-default">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Discounts</span>
                  <span className="text-green-400">
                    -{formatCurrency(discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-border-default pt-2 text-sm">
                <span className="font-bold text-text-bright">Total</span>
                <span className="font-bold text-text-bright">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            {/* Save as template */}
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Template name..."
                className="flex-1 rounded-lg border border-border-default bg-elevated px-3 py-2 text-sm text-text-default placeholder:text-text-muted focus:border-accent-primary/50 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSaveTemplate}
                disabled={!templateName.trim()}
                className="flex items-center gap-1.5 rounded-lg border border-border-default px-3 py-2 text-sm text-text-default transition-colors hover:bg-white/[0.04] disabled:opacity-40"
              >
                <Save className="h-3.5 w-3.5" />
                {showSaved ? 'Saved!' : 'Save'}
              </button>
            </div>

            {/* Checkout button */}
            <button
              type="button"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-accent-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-primary-hover"
            >
              <Package className="h-4 w-4" />
              Place Order
            </button>

            {/* Clear cart */}
            <button
              type="button"
              onClick={clearCart}
              className="mt-2 w-full text-center text-xs text-text-muted hover:text-red-400"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
