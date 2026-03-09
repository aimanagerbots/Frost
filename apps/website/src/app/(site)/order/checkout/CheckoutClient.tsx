'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  useOrderStore,
  useCartTotal,
  useStoreGroups,
  useIsMultiStore,
} from '@/stores/order-store';
import type { CustomerInfo, MockOrder, StoreOrderGroup } from '@/types';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const PICKUP_OPTIONS = [
  'ASAP (~15 min)',
  '30 minutes',
  '1 hour',
  'Schedule for later',
] as const;

const STEPS = ['Your Info', 'Review', 'Confirm'] as const;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function generateConfirmation(): string {
  return 'FROST-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function generateOrderId(): string {
  return 'ord_' + Math.random().toString(36).slice(2, 10);
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10;
}

function formatCurrency(cents: number): string {
  return '$' + cents.toFixed(2);
}

/* ------------------------------------------------------------------ */
/*  Shared Input Styles                                                */
/* ------------------------------------------------------------------ */

const inputClass =
  'w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white/90 placeholder-white/30 outline-none transition-colors focus:border-[#5BB8E6]/60 focus:ring-1 focus:ring-[#5BB8E6]/30 font-sans text-sm';

const selectClass =
  'w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white/90 outline-none transition-colors focus:border-[#5BB8E6]/60 focus:ring-1 focus:ring-[#5BB8E6]/30 font-sans text-sm appearance-none cursor-pointer';

/* ------------------------------------------------------------------ */
/*  Step Indicator                                                     */
/* ------------------------------------------------------------------ */

function StepIndicator({ current }: { readonly current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === current;
        const isComplete = stepNum < current;

        return (
          <div key={label} className="flex items-center gap-2">
            {i > 0 && (
              <div
                className={`w-8 h-px ${
                  isComplete ? 'bg-[#5BB8E6]' : 'bg-white/[0.08]'
                }`}
              />
            )}
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#5BB8E6] text-black'
                    : isComplete
                      ? 'bg-[#5BB8E6]/20 text-[#5BB8E6] border border-[#5BB8E6]/40'
                      : 'bg-white/[0.04] text-white/30 border border-white/[0.08]'
                }`}
              >
                {isComplete ? (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`text-xs font-sans ${
                  isActive ? 'text-white/90' : 'text-white/30'
                }`}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 1 — Your Info                                                 */
/* ------------------------------------------------------------------ */

function StepInfo({
  storeGroups,
  pickupTimes,
  onPickupChange,
  name,
  phone,
  email,
  onNameChange,
  onPhoneChange,
  onEmailChange,
  onContinue,
  errors,
}: {
  readonly storeGroups: Map<string, import('@/types').CartItem[]>;
  readonly pickupTimes: Record<string, string>;
  readonly onPickupChange: (storeId: string, time: string) => void;
  readonly name: string;
  readonly phone: string;
  readonly email: string;
  readonly onNameChange: (v: string) => void;
  readonly onPhoneChange: (v: string) => void;
  readonly onEmailChange: (v: string) => void;
  readonly onContinue: () => void;
  readonly errors: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      {/* Contact info */}
      <div className="bg-card rounded-xl border border-white/[0.06] p-6 space-y-5">
        <h2 className="font-display text-lg text-white/90">
          Contact Information
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-white/40 mb-1.5 font-sans">
              Name <span className="text-[#5BB8E6]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Your full name"
              className={inputClass}
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1.5 font-sans">
              Phone <span className="text-[#5BB8E6]">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="(555) 123-4567"
              className={inputClass}
            />
            {errors.phone && (
              <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1.5 font-sans">
              Email{' '}
              <span className="text-white/20 font-normal">(optional)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="you@email.com"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Pickup times per store */}
      {Array.from(storeGroups.entries()).map(([storeId, items]) => {
        const storeName = items[0]?.storeName ?? storeId;
        return (
          <div
            key={storeId}
            className="bg-card rounded-xl border border-white/[0.06] p-6 space-y-3"
          >
            <h3 className="font-display text-sm text-white/90">
              Pickup Time &mdash; {storeName}
            </h3>
            <select
              value={pickupTimes[storeId] ?? PICKUP_OPTIONS[0]}
              onChange={(e) => onPickupChange(storeId, e.target.value)}
              className={selectClass}
            >
              {PICKUP_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-black text-white">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        );
      })}

      <button
        onClick={onContinue}
        className="w-full py-3.5 rounded-lg bg-[#5BB8E6] text-black font-display text-sm font-semibold hover:bg-[#4FA8D6] transition-colors"
      >
        Continue to Review
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 2 — Review                                                    */
/* ------------------------------------------------------------------ */

function StepReview({
  name,
  phone,
  email,
  storeGroups,
  pickupTimes,
  total,
  isMultiStore,
  onBack,
  onPlace,
}: {
  readonly name: string;
  readonly phone: string;
  readonly email: string;
  readonly storeGroups: Map<string, import('@/types').CartItem[]>;
  readonly pickupTimes: Record<string, string>;
  readonly total: number;
  readonly isMultiStore: boolean;
  readonly onBack: () => void;
  readonly onPlace: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Customer summary */}
      <div className="bg-card rounded-xl border border-white/[0.06] p-6 space-y-2">
        <h2 className="font-display text-lg text-white/90 mb-3">
          Your Information
        </h2>
        <p className="text-sm text-white/70 font-sans">
          <span className="text-white/40">Name:</span> {name}
        </p>
        <p className="text-sm text-white/70 font-sans">
          <span className="text-white/40">Phone:</span> {phone}
        </p>
        {email && (
          <p className="text-sm text-white/70 font-sans">
            <span className="text-white/40">Email:</span> {email}
          </p>
        )}
      </div>

      {/* Multi-store warning */}
      {isMultiStore && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
          <svg
            className="w-5 h-5 text-amber-400 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p className="text-sm text-amber-200/80 font-sans">
            Your order spans multiple stores. You will receive separate
            confirmation numbers and pickup times for each location.
          </p>
        </div>
      )}

      {/* Items grouped by store */}
      {Array.from(storeGroups.entries()).map(([storeId, items]) => {
        const storeName = items[0]?.storeName ?? storeId;
        const subtotal = items.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0,
        );
        const pickupTime = pickupTimes[storeId] ?? PICKUP_OPTIONS[0];

        return (
          <div
            key={storeId}
            className="bg-card rounded-xl border border-white/[0.06] p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm text-white/90">
                {storeName}
              </h3>
              <span className="text-xs text-[#5BB8E6] font-sans">
                {pickupTime}
              </span>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={`${item.productSlug}-${item.storeId}`}
                  className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-sm text-white/80 font-sans truncate">
                      {item.productName}
                    </p>
                    <p className="text-xs text-white/30 font-sans">
                      {item.brand} &middot; Qty {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm text-white/70 font-sans tabular-nums">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
              <span className="text-xs text-white/40 font-sans">Subtotal</span>
              <span className="text-sm text-white/90 font-sans font-medium tabular-nums">
                {formatCurrency(subtotal)}
              </span>
            </div>
          </div>
        );
      })}

      {/* Total */}
      <div className="bg-card rounded-xl border border-white/[0.06] p-6 flex items-center justify-between">
        <span className="font-display text-base text-white/90">Total</span>
        <span className="font-display text-xl text-[#5BB8E6] tabular-nums">
          {formatCurrency(total)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onPlace}
          className="w-full py-3.5 rounded-lg bg-[#5BB8E6] text-black font-display text-sm font-semibold hover:bg-[#4FA8D6] transition-colors"
        >
          Place Order
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 rounded-lg border border-white/[0.08] text-white/50 font-sans text-sm hover:text-white/70 hover:border-white/[0.12] transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 3 — Confirmation                                              */
/* ------------------------------------------------------------------ */

function StepConfirmation({
  order,
}: {
  readonly order: MockOrder;
}) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Success header */}
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-[#5BB8E6]/15 border border-[#5BB8E6]/30 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-[#5BB8E6]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="font-display text-2xl text-white/90 mb-1">
          Order Placed!
        </h2>
        <p className="text-sm text-white/40 font-sans">
          You&apos;ll receive a text at{' '}
          <span className="text-white/60">{order.customerPhone}</span> when your
          order is ready.
        </p>
      </div>

      {/* Store groups */}
      {order.storeGroups.map((group) => (
        <div
          key={group.storeId}
          className="bg-card rounded-xl border border-white/[0.06] p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm text-white/90">
              {group.storeName}
            </h3>
            <span className="text-xs text-[#5BB8E6] font-mono bg-[#5BB8E6]/10 px-2.5 py-1 rounded-md">
              {group.confirmationNumber}
            </span>
          </div>

          <div className="space-y-2 text-sm font-sans">
            <p className="text-white/40">
              Pickup:{' '}
              <span className="text-white/70">{group.pickupTime}</span>
            </p>
            <p className="text-white/40">
              Location:{' '}
              <span className="text-white/70">
                {group.storeAddress || group.storeName}
              </span>
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/[0.04]">
            {group.items.map((item) => (
              <div
                key={`${item.productSlug}-${item.storeId}`}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-white/60 font-sans">
                  {item.productName}{' '}
                  <span className="text-white/30">&times; {item.quantity}</span>
                </span>
                <span className="text-sm text-white/50 font-sans tabular-nums">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
            <span className="text-xs text-white/40 font-sans">Subtotal</span>
            <span className="text-sm text-white/90 font-sans font-medium tabular-nums">
              {formatCurrency(group.subtotal)}
            </span>
          </div>
        </div>
      ))}

      {/* Track button */}
      <button
        onClick={() => router.push(`/order/track/${order.id}`)}
        className="w-full py-3.5 rounded-lg bg-[#5BB8E6] text-black font-display text-sm font-semibold hover:bg-[#4FA8D6] transition-colors"
      >
        Track Your Order
      </button>

      <Link
        href="/order"
        className="block text-center text-sm text-white/40 hover:text-white/60 font-sans transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Checkout Component                                            */
/* ------------------------------------------------------------------ */

export function CheckoutClient() {
  const router = useRouter();
  const items = useOrderStore((s) => s.items);
  const clearCart = useOrderStore((s) => s.clearCart);
  const setActiveOrder = useOrderStore((s) => s.setActiveOrder);
  const setCustomerInfo = useOrderStore((s) => s.setCustomerInfo);
  const savedCustomerInfo = useOrderStore((s) => s.customerInfo);
  const total = useCartTotal();
  const storeGroups = useStoreGroups();
  const isMultiStore = useIsMultiStore();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(savedCustomerInfo?.name ?? '');
  const [phone, setPhone] = useState(savedCustomerInfo?.phone ?? '');
  const [email, setEmail] = useState(savedCustomerInfo?.email ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placedOrder, setPlacedOrder] = useState<MockOrder | null>(null);

  /* Pickup times — keyed by storeId */
  const [pickupTimes, setPickupTimes] = useState<Record<string, string>>({});

  const handlePickupChange = (storeId: string, time: string) => {
    setPickupTimes((prev) => ({ ...prev, [storeId]: time }));
  };

  /* ── Step 1 validation ── */
  const handleContinue = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!isValidPhone(phone)) {
      newErrors.phone = 'Enter a valid phone number (10+ digits)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const info: CustomerInfo = {
      name: name.trim(),
      phone: phone.trim(),
      ...(email.trim() ? { email: email.trim() } : {}),
    };
    setCustomerInfo(info);
    setStep(2);
  };

  /* ── Place order ── */
  const handlePlaceOrder = () => {
    const orderId = generateOrderId();

    const orderGroups: StoreOrderGroup[] = Array.from(
      storeGroups.entries(),
    ).map(([storeId, groupItems]) => {
      const subtotal = groupItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0,
      );
      return {
        storeId,
        storeName: groupItems[0]?.storeName ?? storeId,
        storeSlug: groupItems[0]?.storeSlug ?? storeId,
        storeAddress: groupItems[0]?.storeName ?? '',
        storePhone: '',
        items: groupItems,
        subtotal,
        confirmationNumber: generateConfirmation(),
        pickupTime: pickupTimes[storeId] ?? PICKUP_OPTIONS[0],
        status: 'placed' as const,
      };
    });

    const order: MockOrder = {
      id: orderId,
      storeGroups: orderGroups,
      customerName: name.trim(),
      customerPhone: phone.trim(),
      ...(email.trim() ? { customerEmail: email.trim() } : {}),
      placedAt: new Date(),
    };

    setActiveOrder(order);
    clearCart();
    setPlacedOrder(order);
    setStep(3);
  };

  /* ── Empty cart guard ── */
  if (items.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-white/50 font-sans mb-4">Your cart is empty.</p>
          <Link
            href="/order"
            className="inline-block px-6 py-3 rounded-lg bg-[#5BB8E6] text-black font-display text-sm font-semibold hover:bg-[#4FA8D6] transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-sans mb-8">
          <Link
            href="/order"
            className="text-white/40 hover:text-white/60 transition-colors"
          >
            Order
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-white/70">Checkout</span>
        </nav>

        {/* Step indicator */}
        <StepIndicator current={step} />

        {/* Step content */}
        {step === 1 && (
          <StepInfo
            storeGroups={storeGroups}
            pickupTimes={pickupTimes}
            onPickupChange={handlePickupChange}
            name={name}
            phone={phone}
            email={email}
            onNameChange={setName}
            onPhoneChange={setPhone}
            onEmailChange={setEmail}
            onContinue={handleContinue}
            errors={errors}
          />
        )}

        {step === 2 && (
          <StepReview
            name={name}
            phone={phone}
            email={email}
            storeGroups={storeGroups}
            pickupTimes={pickupTimes}
            total={total}
            isMultiStore={isMultiStore}
            onBack={() => setStep(1)}
            onPlace={handlePlaceOrder}
          />
        )}

        {step === 3 && placedOrder && (
          <StepConfirmation order={placedOrder} />
        )}
      </div>
    </div>
  );
}
