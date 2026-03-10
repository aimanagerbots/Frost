'use client';

import { useMemo } from 'react';
import { CheckCircle, Star, ChevronRight, DollarSign, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PortalCard } from '@/modules/portal/shared/components';
import type { RewardsTier, PortalRewardsData } from '../../shared/types';

const TIER_ORDER: RewardsTier['name'][] = ['Bronze', 'Silver', 'Gold', 'Platinum'];

const TIER_COLORS: Record<RewardsTier['name'], string> = {
  Bronze: '#CD7F32',
  Silver: '#C0C0C0',
  Gold: '#F59E0B',
  Platinum: '#A78BFA',
};

const ALL_TIERS: { name: RewardsTier['name']; minPoints: number }[] = [
  { name: 'Bronze', minPoints: 0 },
  { name: 'Silver', minPoints: 2500 },
  { name: 'Gold', minPoints: 7500 },
  { name: 'Platinum', minPoints: 15000 },
];

interface RewardsTierStatusProps {
  data: PortalRewardsData;
}

export function RewardsTierStatus({ data }: RewardsTierStatusProps) {
  const { currentTier, nextTier, totalPoints, pointsToNextTier, quarterlyRebate } = data;

  const progressPercent = useMemo(() => {
    if (!nextTier) return 100;
    const rangeTotal = nextTier.minPoints - currentTier.minPoints;
    const rangeProgress = totalPoints - currentTier.minPoints;
    return Math.min(100, Math.round((rangeProgress / rangeTotal) * 100));
  }, [currentTier, nextTier, totalPoints]);

  const currentTierIdx = TIER_ORDER.indexOf(currentTier.name);

  return (
    <div className="space-y-6">
      {/* Hero section */}
      <PortalCard className="relative overflow-hidden">
        {/* Background glow */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: TIER_COLORS[currentTier.name] }}
        />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Tier badge + info */}
          <div className="flex items-center gap-6">
            {/* Tier badge */}
            <div
              className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl border-2"
              style={{
                borderColor: TIER_COLORS[currentTier.name],
                boxShadow: `0 0 24px ${TIER_COLORS[currentTier.name]}33, 0 0 48px ${TIER_COLORS[currentTier.name]}11`,
                background: `linear-gradient(135deg, ${TIER_COLORS[currentTier.name]}15, ${TIER_COLORS[currentTier.name]}05)`,
              }}
            >
              <Star
                className="h-10 w-10"
                style={{ color: TIER_COLORS[currentTier.name] }}
                fill={TIER_COLORS[currentTier.name]}
              />
            </div>

            <div>
              <p className="text-sm font-medium text-text-muted">Current Tier</p>
              <h2
                className="font-display text-3xl font-bold"
                style={{ color: TIER_COLORS[currentTier.name] }}
              >
                {currentTier.name}
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                {currentTier.discountPercent}% quarterly rebate
              </p>
            </div>
          </div>

          {/* Right: Points + Rebate */}
          <div className="flex gap-6">
            <div className="text-right">
              <p className="text-sm font-medium text-text-muted">Points Balance</p>
              <p className="font-display text-3xl font-bold text-text-bright">
                {totalPoints.toLocaleString()}
              </p>
            </div>
            {quarterlyRebate > 0 && (
              <div className="text-right">
                <p className="text-sm font-medium text-text-muted">Quarterly Rebate</p>
                <div className="flex items-center justify-end gap-1.5">
                  <DollarSign className="h-5 w-5 text-[#00E5A0]" />
                  <p className="font-display text-3xl font-bold text-[#00E5A0]">
                    {quarterlyRebate.toLocaleString()}
                  </p>
                </div>
                <p className="text-xs text-text-muted">earned this quarter</p>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {nextTier && (
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-text-muted">
                Progress to{' '}
                <span className="font-semibold" style={{ color: TIER_COLORS[nextTier.name] }}>
                  {nextTier.name}
                </span>
              </span>
              <span className="text-text-muted">
                <span className="font-semibold text-text-default">
                  {pointsToNextTier.toLocaleString()}
                </span>{' '}
                points to go
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${progressPercent}%`,
                  background: `linear-gradient(90deg, ${TIER_COLORS[currentTier.name]}, ${TIER_COLORS[nextTier.name]})`,
                }}
              />
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-text-muted">
              <TrendingUp className="h-4 w-4 text-accent-primary" />
              <span>
                Unlock {nextTier.name}:{' '}
                {nextTier.benefits.slice(-2).join(', ')}
              </span>
            </div>
          </div>
        )}

        {nextTier === null && (
          <div className="mt-6 rounded-lg bg-[#A78BFA]/10 px-4 py-3 text-sm text-[#A78BFA]">
            <span className="font-semibold">Maximum tier reached!</span> You enjoy the highest
            level of Frost partner benefits.
          </div>
        )}
      </PortalCard>

      {/* Tier cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ALL_TIERS.map((tier, idx) => {
          const isCurrent = currentTier.name === tier.name;
          const isUnlocked = idx <= currentTierIdx;
          const tierColor = TIER_COLORS[tier.name];
          const tierData = data.currentTier.name === tier.name ? data.currentTier : null;
          const benefits =
            tierData?.benefits ??
            (tier.name === 'Bronze'
              ? ['Portal access', 'Standard delivery', 'Basic reports']
              : tier.name === 'Silver'
                ? ['2% rebate', 'Early product access', 'Priority delivery']
                : tier.name === 'Gold'
                  ? ['4% rebate', 'Allocation reserves', 'Dedicated rep']
                  : ['6% rebate', 'First drop access', 'Strategy sessions']);

          return (
            <div
              key={tier.name}
              className={cn(
                'relative rounded-xl border border-border-default bg-card p-5 transition-all',
                isCurrent && 'ring-1',
                !isUnlocked && 'opacity-50'
              )}
              style={
                isCurrent
                  ? { borderColor: tierColor, boxShadow: `0 0 16px ${tierColor}22` }
                  : undefined
              }
            >
              {isCurrent && (
                <div
                  className="absolute -top-px left-0 right-0 h-0.5 rounded-t-xl"
                  style={{ backgroundColor: tierColor }}
                />
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5" style={{ color: tierColor }} fill={isUnlocked ? tierColor : 'none'} />
                  <span className="font-display text-lg font-bold" style={{ color: tierColor }}>
                    {tier.name}
                  </span>
                </div>
                {isCurrent && (
                  <CheckCircle className="h-5 w-5" style={{ color: tierColor }} />
                )}
                {!isCurrent && isUnlocked && (
                  <CheckCircle className="h-4 w-4 text-text-muted" />
                )}
              </div>

              <p className="mt-1 text-xs text-text-muted">
                {tier.minPoints === 0 ? 'Starting tier' : `${tier.minPoints.toLocaleString()} pts`}
              </p>

              <ul className="mt-3 space-y-1.5">
                {benefits.slice(0, 3).map((b) => (
                  <li key={b} className="flex items-start gap-1.5 text-xs text-text-muted">
                    <ChevronRight className="mt-0.5 h-3 w-3 flex-shrink-0" style={{ color: tierColor }} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
