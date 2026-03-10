'use client';

import { Snowflake, TrendingUp } from 'lucide-react';
import type { LoyaltyAccount } from '@/types/merch';
import { TIER_THRESHOLDS } from '@/mocks/account';

interface PointsCardProps {
  loyalty: LoyaltyAccount;
}

export function PointsCard({ loyalty }: PointsCardProps) {
  const currentTier = TIER_THRESHOLDS[loyalty.tier];
  const nextTier = loyalty.nextTier ? TIER_THRESHOLDS[loyalty.nextTier] : null;

  // Progress within current tier toward next
  const progressPercent = nextTier
    ? Math.min(
        ((loyalty.points - currentTier.min) / (nextTier.min - currentTier.min)) * 100,
        100,
      )
    : 100;

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
            Frost Points
          </p>
          <p className="mt-1 text-4xl font-bold text-white">
            {loyalty.points.toLocaleString()}
          </p>
        </div>
        <div
          className="flex items-center gap-2 rounded-full px-3 py-1.5"
          style={{ backgroundColor: `${currentTier.color}20`, color: currentTier.color }}
        >
          <Snowflake className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wider">
            {currentTier.label} Tier
          </span>
        </div>
      </div>

      {/* Progress bar */}
      {nextTier && (
        <div className="mt-6">
          <div className="flex items-center justify-between text-[11px] text-white/40">
            <span>{currentTier.label}</span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {loyalty.pointsToNextTier.toLocaleString()} pts to {nextTier.label}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progressPercent}%`,
                background: `linear-gradient(90deg, ${currentTier.color}, ${nextTier.color})`,
              }}
            />
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-white/[0.03] px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/30">
            Lifetime Earned
          </p>
          <p className="mt-1 text-lg font-bold text-white">
            {loyalty.lifetimePoints.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg bg-white/[0.03] px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/30">
            Member Since
          </p>
          <p className="mt-1 text-lg font-bold text-white">
            {new Date(loyalty.memberSince).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
