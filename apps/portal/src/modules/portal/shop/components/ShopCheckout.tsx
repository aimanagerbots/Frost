'use client';

import { useState, useMemo } from 'react';
import {
  ShoppingCart,
  Truck,
  ClipboardCheck,
  CheckCircle2,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePortalAuth, usePortalCart } from '@/modules/portal/shared/hooks';

// ─── Constants ───────────────────────────────────────────────────

const STEPS = [
  { key: 'review', label: 'Review', icon: ShoppingCart },
  { key: 'delivery', label: 'Delivery', icon: Truck },
  { key: 'confirm', label: 'Confirm', icon: ClipboardCheck },
  { key: 'confirmation', label: 'Done', icon: CheckCircle2 },
] as const;

type StepKey = (typeof STEPS)[number]['key'];

const DELIVERY_WINDOWS = [
  'Monday 9am - 12pm',
  'Monday 1pm - 5pm',
  'Tuesday 9am - 12pm',
  'Tuesday 1pm - 5pm',
  'Wednesday 9am - 12pm',
  'Wednesday 1pm - 5pm',
  'Thursday 9am - 12pm',
  'Thursday 1pm - 5pm',
  'Friday 9am - 12pm',
  'Friday 1pm - 5pm',
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

function generateOrderNumber(): string {
  const prefix = 'FRO';
  const num = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${num}`;
}

// ─── Props ───────────────────────────────────────────────────────

interface ShopCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────

export function ShopCheckout({ isOpen, onClose, className }: ShopCheckoutProps) {
  const { currentAccount } = usePortalAuth();
  const {
    items,
    removeItem,
    updateQuantity,
    totalPrice,
    totalDiscount,
    clearCart,
  } = usePortalCart();

  const [currentStep, setCurrentStep] = useState<StepKey>('review');
  const [deliveryWindow, setDeliveryWindow] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  const stepIndex = STEPS.findIndex((s) => s.key === currentStep);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.product.unitPrice, 0),
    [items]
  );
  const discount = totalDiscount();
  const total = totalPrice();

  // Set default delivery window from account preferences
  const defaultWindow = useMemo(() => {
    if (!currentAccount) return '';
    const pref = currentAccount.preferredDeliveryWindow;
    const day = pref.days[0] ?? 'Monday';
    return `${day} ${pref.timeStart} - ${pref.timeEnd}`;
  }, [currentAccount]);

  function handleNext() {
    if (currentStep === 'review') {
      if (!deliveryWindow) setDeliveryWindow(defaultWindow);
      setCurrentStep('delivery');
    } else if (currentStep === 'delivery') {
      setCurrentStep('confirm');
    } else if (currentStep === 'confirm') {
      const num = generateOrderNumber();
      setOrderNumber(num);
      clearCart();
      setCurrentStep('confirmation');
    }
  }

  function handleBack() {
    if (currentStep === 'delivery') setCurrentStep('review');
    else if (currentStep === 'confirm') setCurrentStep('delivery');
  }

  function handleBackToShop() {
    setCurrentStep('review');
    setDeliveryWindow('');
    setSpecialInstructions('');
    setOrderNumber('');
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Progress bar */}
      <div className="mb-6 flex items-center gap-1">
        {STEPS.map((step, idx) => {
          const isActive = idx === stepIndex;
          const isCompleted = idx < stepIndex;
          const Icon = step.icon;
          return (
            <div key={step.key} className="flex flex-1 items-center gap-1">
              <div
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                  isActive && 'bg-accent-primary/15 text-accent-primary',
                  isCompleted && 'bg-green-500/10 text-green-400',
                  !isActive && !isCompleted && 'text-text-muted'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{step.label}</span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    'h-px flex-1',
                    isCompleted ? 'bg-green-500/30' : 'bg-border-default'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="flex-1">
        {/* ─── Step 1: Review ─── */}
        {currentStep === 'review' && (
          <div>
            <h3 className="text-lg font-semibold text-text-bright">
              Review Your Order
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              {items.length} {items.length === 1 ? 'product' : 'products'} in
              your cart
            </p>

            <div className="mt-4 divide-y divide-border-default rounded-xl border border-border-default bg-card">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-4 px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-default line-clamp-1">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {item.product.packageSize} &middot;{' '}
                      {formatCurrency(item.product.unitPrice)}/unit
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center rounded-lg border border-border-default">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="px-2 py-1 text-text-muted transition-colors hover:bg-white/[0.04]"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="min-w-[2rem] text-center text-sm text-text-default">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="px-2 py-1 text-text-muted transition-colors hover:bg-white/[0.04]"
                      aria-label="Increase"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Line total */}
                  <div className="w-20 text-right">
                    <p className="text-sm font-medium text-text-bright">
                      {formatCurrency(item.quantity * item.product.unitPrice)}
                    </p>
                    {item.appliedDiscount && (
                      <p className="text-[10px] text-green-400">
                        -{formatCurrency(item.appliedDiscount.savedAmount)}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.product.id)}
                    className="shrink-0 rounded-md p-1 text-text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-4 space-y-1.5 rounded-xl border border-border-default bg-card px-4 py-3">
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
          </div>
        )}

        {/* ─── Step 2: Delivery ─── */}
        {currentStep === 'delivery' && (
          <div>
            <h3 className="text-lg font-semibold text-text-bright">
              Delivery Details
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              Choose your preferred delivery window
            </p>

            {/* Delivery address */}
            {currentAccount?.deliveryAddress && (
              <div className="mt-4 rounded-xl border border-border-default bg-card px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                  Delivery Address
                </p>
                <p className="mt-1 text-sm text-text-default">
                  {currentAccount.deliveryAddress.street},{' '}
                  {currentAccount.deliveryAddress.city},{' '}
                  {currentAccount.deliveryAddress.state}{' '}
                  {currentAccount.deliveryAddress.zip}
                </p>
              </div>
            )}

            {/* Delivery window selector */}
            <div className="mt-4">
              <label className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Delivery Window
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {DELIVERY_WINDOWS.map((window) => (
                  <button
                    key={window}
                    type="button"
                    onClick={() => setDeliveryWindow(window)}
                    className={cn(
                      'rounded-lg border px-3 py-2 text-left text-sm transition-colors',
                      deliveryWindow === window
                        ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                        : 'border-border-default bg-card text-text-default hover:bg-card-hover'
                    )}
                  >
                    {window}
                  </button>
                ))}
              </div>
            </div>

            {/* Special instructions */}
            <div className="mt-4">
              <label className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Special Instructions (optional)
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Gate code, loading dock instructions, etc."
                rows={3}
                className="mt-2 w-full rounded-lg border border-border-default bg-elevated px-3 py-2 text-sm text-text-default placeholder:text-text-muted focus:border-accent-primary/50 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* ─── Step 3: Confirm ─── */}
        {currentStep === 'confirm' && (
          <div>
            <h3 className="text-lg font-semibold text-text-bright">
              Confirm Your Order
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              Review everything before placing your order
            </p>

            {/* Order summary */}
            <div className="mt-4 space-y-3">
              {/* Items summary */}
              <div className="rounded-xl border border-border-default bg-card px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                  Items ({items.length})
                </p>
                <div className="mt-2 space-y-1.5">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-text-default">
                        {item.product.name}{' '}
                        <span className="text-text-muted">x{item.quantity}</span>
                      </span>
                      <span className="text-text-default">
                        {formatCurrency(item.quantity * item.product.unitPrice)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery summary */}
              <div className="rounded-xl border border-border-default bg-card px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                  Delivery
                </p>
                <p className="mt-1 text-sm text-text-default">
                  {deliveryWindow || defaultWindow}
                </p>
                {specialInstructions && (
                  <p className="mt-1 text-xs text-text-muted">
                    Note: {specialInstructions}
                  </p>
                )}
              </div>

              {/* Payment summary */}
              <div className="rounded-xl border border-border-default bg-card px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                  Payment Summary
                </p>
                <div className="mt-2 space-y-1">
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
              </div>
            </div>
          </div>
        )}

        {/* ─── Step 4: Confirmation ─── */}
        {currentStep === 'confirmation' && (
          <div className="flex flex-col items-center py-12">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-text-bright">
              Order Placed!
            </h3>
            <p className="mt-2 text-sm text-text-muted">
              Your order has been submitted successfully
            </p>
            <div className="mt-4 rounded-lg bg-elevated px-4 py-2">
              <p className="text-xs text-text-muted">Order Number</p>
              <p className="text-lg font-bold tracking-wider text-accent-primary">
                {orderNumber}
              </p>
            </div>
            <p className="mt-4 max-w-xs text-center text-xs text-text-muted">
              You will receive a confirmation email shortly. Track your order
              status on the Orders page.
            </p>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="mt-6 flex items-center justify-between border-t border-border-default pt-4">
        {currentStep === 'confirmation' ? (
          <div className="flex w-full justify-center">
            <button
              type="button"
              onClick={handleBackToShop}
              className="flex items-center gap-2 rounded-lg bg-accent-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-primary-hover"
            >
              <Package className="h-4 w-4" />
              Back to Shop
            </button>
          </div>
        ) : (
          <>
            {currentStep !== 'review' ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 rounded-lg border border-border-default px-4 py-2 text-sm text-text-default transition-colors hover:bg-white/[0.04]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 rounded-lg border border-border-default px-4 py-2 text-sm text-text-default transition-colors hover:bg-white/[0.04]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Continue Shopping
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={
                items.length === 0 ||
                (currentStep === 'delivery' && !deliveryWindow && !defaultWindow)
              }
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors',
                items.length > 0
                  ? 'bg-accent-primary text-white hover:bg-accent-primary-hover'
                  : 'cursor-not-allowed bg-white/[0.06] text-text-muted'
              )}
            >
              {currentStep === 'confirm' ? (
                <>
                  <ClipboardCheck className="h-4 w-4" />
                  Place Order
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
