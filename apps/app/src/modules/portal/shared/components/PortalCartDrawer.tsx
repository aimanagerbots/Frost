'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  Save,
  ArrowRight,
} from 'lucide-react';
import { usePortalCart } from '../hooks';

// ─── Category Colors ───────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  flower: 'bg-green-100 text-green-700',
  prerolls: 'bg-purple-100 text-purple-700',
  vaporizers: 'bg-blue-100 text-blue-700',
  concentrates: 'bg-orange-100 text-orange-700',
  edibles: 'bg-pink-100 text-pink-700',
  beverages: 'bg-cyan-100 text-cyan-700',
};

// ─── Helpers ───────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// ─── Component ─────────────────────────────────────────────────

export function PortalCartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, totalDiscount, saveAsTemplate } =
    usePortalCart();
  const [templateName, setTemplateName] = useState('');
  const [showTemplateSave, setShowTemplateSave] = useState(false);

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.product.unitPrice,
    0
  );
  const discount = totalDiscount();
  const total = totalPrice();
  const itemCount = totalItems();

  function handleSaveTemplate() {
    if (!templateName.trim()) return;
    saveAsTemplate(templateName.trim());
    setTemplateName('');
    setShowTemplateSave(false);
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/20 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-96 max-w-full flex-col bg-white shadow-2xl transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-800">
              Your Cart
            </h2>
            {itemCount > 0 && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <ShoppingCart size={28} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-600">
                Your cart is empty
              </p>
              <p className="text-xs text-gray-400">
                Browse the shop to add products
              </p>
            </div>
          ) : (
            /* Cart items */
            <ul className="divide-y divide-gray-100">
              {items.map((item) => {
                const lineTotal = item.quantity * item.product.unitPrice;
                const categoryColor =
                  CATEGORY_COLORS[item.product.category] ??
                  'bg-gray-100 text-gray-700';

                return (
                  <li key={item.product.id} className="px-5 py-4">
                    {/* Top row: name + remove */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-800">
                          {item.product.name}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span
                            className={cn(
                              'rounded-md px-1.5 py-0.5 text-[10px] font-medium capitalize',
                              categoryColor
                            )}
                          >
                            {item.product.category}
                          </span>
                          <span className="text-xs text-gray-400">
                            {item.product.packageSize}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="shrink-0 rounded-md p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Bottom row: quantity + price */}
                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Line total */}
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-800">
                          {formatCurrency(lineTotal - (item.appliedDiscount?.savedAmount ?? 0))}
                        </p>
                        {item.appliedDiscount && (
                          <p className="text-[10px] font-medium text-green-600">
                            -{formatCurrency(item.appliedDiscount.savedAmount)}{' '}
                            {item.appliedDiscount.label}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-4">
            {/* Totals */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm font-medium text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold text-gray-900">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Template save */}
            {showTemplateSave ? (
              <div className="mt-3 flex items-center gap-2">
                <input
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Template name..."
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveTemplate()}
                />
                <button
                  onClick={handleSaveTemplate}
                  className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowTemplateSave(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowTemplateSave(true)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Save size={14} />
                Save as Template
              </button>
            )}

            {/* Checkout */}
            <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 active:bg-amber-700">
              Proceed to Checkout
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
