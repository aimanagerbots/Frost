'use client';

import Link from 'next/link';
import { Crown, ChevronRight, Check } from 'lucide-react';
import { usePortalAuth, usePortalRewards } from '@/modules/portal/shared/hooks';
import { PortalCard } from '@/modules/portal/shared/components';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

const TIER_COLORS: Record<string, string> = {
  Bronze: '#CD7F32',
  Silver: '#C0C0C0',
  Gold: '#F59E0B',
  Platinum: '#A78BFA',
};

export function DashboardTierPreview() {
  const { currentAccount } = usePortalAuth();
  const { data } = usePortalRewards(currentAccount?.id ?? '');

  if (!currentAccount || !data) return null;

  const tierColor = TIER_COLORS[data.currentTier.name] ?? '#5BB8E6';
  const hasNextTier = data.nextTier !== null;

  // Progress calculation
  const currentMin = data.currentTier.minPoints;
  const nextMin = data.nextTier?.minPoints ?? data.totalPoints;
  const range = nextMin - currentMin;
  const progress = range > 0 ? ((data.totalPoints - currentMin) / range) * 100 : 100;

  return (
    <PortalCard padding="sm" className="flex flex-col">
      <div className="flex items-center gap-2 px-2 pb-3 pt-1">
        <Crown className="h-4 w-4" style={{ color: tierColor }} />
        <h3 className="font-display text-sm font-semibold text-text-bright">
          Rewards Tier
        </h3>
      </div>

      {/* Current tier badge */}
      <div className="mb-3 flex items-center justify-center px-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold"
          style={{
            backgroundColor: `${tierColor}15`,
            color: tierColor,
            border: `1px solid ${tierColor}30`,
          }}
        >
          <Crown className="h-3.5 w-3.5" />
          {data.currentTier.name}
        </span>
      </div>

      {/* Progress bar to next tier */}
      {hasNextTier && (
        <div className="mb-3 space-y-1.5 px-2">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>{data.currentTier.name}</span>
            <span>{data.nextTier!.name}</span>
          </div>
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background: `linear-gradient(90deg, ${tierColor}, ${TIER_COLORS[data.nextTier!.name] ?? tierColor})`,
              }}
            />
          </div>
          <p className="text-center text-xs text-text-muted">
            <span className="font-semibold text-text-default">
              {formatNumber(data.pointsToNextTier)}
            </span>{' '}
            points to {data.nextTier!.name}
          </p>
        </div>
      )}

      {/* Next tier benefits preview */}
      {hasNextTier && data.nextTier!.benefits.length > 0 && (
        <div className="mb-3 space-y-1.5 px-2">
          <p className="text-xs font-medium text-text-muted">
            Unlock with {data.nextTier!.name}:
          </p>
          <ul className="space-y-1">
            {data.nextTier!.benefits.slice(0, 3).map((benefit) => (
              <li key={benefit} className="flex items-start gap-1.5 text-xs text-text-default">
                <Check className="mt-0.5 h-3 w-3 shrink-0" style={{ color: TIER_COLORS[data.nextTier!.name] ?? tierColor }} />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quarterly rebate */}
      <div className="mx-2 rounded-lg bg-[#00E5A0]/5 px-3 py-2 text-center">
        <p className="text-xs text-text-muted">Quarterly Rebate Earned</p>
        <p className="font-display text-lg font-bold text-[#00E5A0]">
          {formatCurrency(data.quarterlyRebate)}
        </p>
      </div>

      {/* Link to rewards page */}
      <Link
        href="/rewards"
        className="mt-3 flex items-center justify-center gap-1 border-t border-border-default px-2 pt-3 pb-1 text-xs font-medium text-accent-primary hover:text-accent-primary-hover"
      >
        View Rewards
        <ChevronRight className="h-3 w-3" />
      </Link>
    </PortalCard>
  );
}
