'use client';

import { PiggyBank } from 'lucide-react';
import { usePortalAuth, usePortalSavings } from '@/modules/portal/shared/hooks';
import { PortalCard } from '@/modules/portal/shared/components';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface SavingsBarProps {
  label: string;
  amount: number;
  maxAmount: number;
}

function SavingsBar({ label, amount, maxAmount }: SavingsBarProps) {
  const widthPercent = maxAmount > 0 ? Math.min((amount / maxAmount) * 100, 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-muted">{label}</span>
        <span className="font-semibold text-[#00E5A0]">{formatCurrency(amount)}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-[#00E5A0] transition-all duration-700"
          style={{ width: `${widthPercent}%` }}
        />
      </div>
    </div>
  );
}

export function DashboardSavings() {
  const { currentAccount } = usePortalAuth();
  const { data } = usePortalSavings(currentAccount?.id ?? '');

  if (!currentAccount || !data) return null;

  const maxCategory = Math.max(
    data.volumeDiscounts,
    data.loyaltyRebates,
    data.promoCredits,
    data.earlyPayCredits
  );

  return (
    <PortalCard padding="sm" className="flex flex-col">
      <div className="flex items-center gap-2 px-2 pb-4 pt-1">
        <PiggyBank className="h-4 w-4 text-[#00E5A0]" />
        <h3 className="font-display text-sm font-semibold text-text-bright">
          Your Savings
        </h3>
      </div>

      {/* Hero savings number */}
      <div className="mb-4 px-2 text-center">
        <p className="font-display text-3xl font-extrabold text-[#00E5A0]">
          {formatCurrency(data.totalSavingsThisQuarter)}
        </p>
        <p className="mt-1 text-xs text-text-muted">saved with Frost this quarter</p>
      </div>

      {/* Breakdown bars */}
      <div className="space-y-3 px-2 pb-2">
        <SavingsBar label="Volume Discounts" amount={data.volumeDiscounts} maxAmount={maxCategory} />
        <SavingsBar label="Loyalty Rebates" amount={data.loyaltyRebates} maxAmount={maxCategory} />
        <SavingsBar label="Promo Credits" amount={data.promoCredits} maxAmount={maxCategory} />
        <SavingsBar label="Early Pay Credits" amount={data.earlyPayCredits} maxAmount={maxCategory} />
      </div>
    </PortalCard>
  );
}
