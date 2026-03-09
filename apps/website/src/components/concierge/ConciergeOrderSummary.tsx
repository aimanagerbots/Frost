'use client';

import { useMemo } from 'react';

interface ConciergeOrderSummaryProps {
  storeName: string;
  productName: string;
  price: number;
  pickupTime: string;
  phoneNumber: string;
}

function generateConfirmation(): string {
  const digits = Math.floor(100000 + Math.random() * 900000).toString();
  return `FROST-${digits}`;
}

export function ConciergeOrderSummary({
  storeName,
  productName,
  price,
  pickupTime,
  phoneNumber,
}: ConciergeOrderSummaryProps) {
  const confirmationNumber = useMemo(() => generateConfirmation(), []);

  return (
    <div className="w-full max-w-[320px] rounded-xl border border-white/[0.08] bg-[#0A0A0F] overflow-hidden">
      {/* Accent top bar */}
      <div className="h-[2px] bg-gradient-to-r from-[#5BB8E6] via-[#5BB8E6]/80 to-[#5BB8E6]/40" />

      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.15em] text-[#5BB8E6] font-medium">
            Order Confirmed
          </span>
          <span className="text-[10px] text-[var(--text-muted)] font-mono">
            {confirmationNumber}
          </span>
        </div>

        {/* Product */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-white">{productName}</p>
          <p className="text-xs text-[var(--text-muted)]">{storeName}</p>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/[0.06]">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-0.5">
              Pickup
            </p>
            <p className="text-xs text-[var(--text-default)]">{pickupTime}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-0.5">
              Total
            </p>
            <p className="text-xs text-[var(--text-default)] font-medium">
              ${price.toFixed(2)}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-0.5">
              SMS Updates
            </p>
            <p className="text-xs text-[var(--text-default)]">{phoneNumber}</p>
          </div>
        </div>

        {/* Action */}
        <button
          type="button"
          onClick={() => console.log('View email confirmation', confirmationNumber)}
          className="w-full mt-1 py-2 rounded-lg bg-[#5BB8E6]/10 border border-[#5BB8E6]/20 text-xs text-[#5BB8E6] font-medium hover:bg-[#5BB8E6]/15 transition-colors cursor-pointer"
        >
          View Email Confirmation
        </button>
      </div>
    </div>
  );
}
