'use client';

import { useMemo } from 'react';
import { Trophy, Medal, Crown, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PortalCard } from '@/modules/portal/shared/components';
import type { LeaderboardEntry } from '../../shared/types';

const TIER_COLORS: Record<string, string> = {
  Bronze: '#CD7F32',
  Silver: '#C0C0C0',
  Gold: '#F59E0B',
  Platinum: '#A78BFA',
};

const PODIUM_ICONS = [Crown, Trophy, Medal];
const PODIUM_SIZES = ['h-7 w-7', 'h-6 w-6', 'h-5 w-5'];
const PODIUM_HEIGHTS = ['h-32', 'h-24', 'h-20'];

interface RewardsLeaderboardProps {
  leaderboard: LeaderboardEntry[];
}

export function RewardsLeaderboard({ leaderboard }: RewardsLeaderboardProps) {
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);
  const currentUser = leaderboard.find((e) => e.isCurrentUser);
  const totalPartners = 45;

  const tierDistribution = useMemo(() => {
    const counts: Record<string, number> = { Bronze: 0, Silver: 0, Gold: 0, Platinum: 0 };
    leaderboard.forEach((e) => {
      if (counts[e.tier] !== undefined) {
        counts[e.tier] += 1;
      }
    });
    // Pad with realistic totals
    counts.Bronze = Math.max(counts.Bronze, 18);
    counts.Silver = Math.max(counts.Silver, 14);
    counts.Gold = Math.max(counts.Gold, 9);
    counts.Platinum = Math.max(counts.Platinum, 4);
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return Object.entries(counts).map(([tier, count]) => ({
      tier,
      count,
      percent: Math.round((count / total) * 100),
      color: TIER_COLORS[tier] ?? '#5BB8E6',
    }));
  }, [leaderboard]);

  // Display order for podium: 2nd, 1st, 3rd
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;

  return (
    <div className="space-y-6">
      {/* Hero text */}
      {currentUser && (
        <PortalCard>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-primary/10">
              <Trophy className="h-6 w-6 text-accent-primary" />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-text-bright">
                You&apos;re #{currentUser.rank} of {totalPartners} Frost partners in your region
              </p>
              <p className="text-sm text-text-muted">
                <span
                  className="font-semibold"
                  style={{ color: TIER_COLORS[currentUser.tier] }}
                >
                  {currentUser.tier}
                </span>{' '}
                tier &middot; {currentUser.points.toLocaleString()} points
              </p>
            </div>
          </div>
        </PortalCard>
      )}

      {/* Podium */}
      <PortalCard>
        <h3 className="mb-6 text-center font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
          Top Partners
        </h3>

        <div className="mx-auto flex max-w-lg items-end justify-center gap-4">
          {podiumOrder.map((entry, visualIdx) => {
            // Map visual position back to actual rank index (0=2nd, 1=1st, 2=3rd)
            const rankIdx = visualIdx === 0 ? 1 : visualIdx === 1 ? 0 : 2;
            const Icon = PODIUM_ICONS[rankIdx];
            const tierColor = TIER_COLORS[entry.tier] ?? '#5BB8E6';

            return (
              <div key={entry.rank} className="flex flex-col items-center">
                {/* Avatar circle */}
                <div
                  className={cn(
                    'mb-2 flex items-center justify-center rounded-full border-2',
                    rankIdx === 0 ? 'h-16 w-16' : 'h-12 w-12'
                  )}
                  style={{
                    borderColor: tierColor,
                    boxShadow: rankIdx === 0 ? `0 0 20px ${tierColor}33` : undefined,
                  }}
                >
                  <Icon className={PODIUM_SIZES[rankIdx]} style={{ color: tierColor }} />
                </div>

                {/* Name */}
                <p className="text-center text-xs font-semibold text-text-default">
                  {entry.displayName}
                </p>
                <p className="text-xs text-text-muted">
                  {entry.points.toLocaleString()} pts
                </p>

                {/* Podium block */}
                <div
                  className={cn(
                    'mt-2 w-24 rounded-t-lg',
                    PODIUM_HEIGHTS[rankIdx]
                  )}
                  style={{
                    background: `linear-gradient(180deg, ${tierColor}33, ${tierColor}11)`,
                    borderTop: `2px solid ${tierColor}`,
                  }}
                >
                  <p
                    className="pt-2 text-center font-display text-lg font-bold"
                    style={{ color: tierColor }}
                  >
                    #{entry.rank}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </PortalCard>

      {/* Rankings table */}
      <PortalCard padding="sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-default text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Partner</th>
                <th className="px-4 py-3">Tier</th>
                <th className="px-4 py-3 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {rest.map((entry) => {
                const tierColor = TIER_COLORS[entry.tier] ?? '#5BB8E6';
                return (
                  <tr
                    key={entry.rank}
                    className={cn(
                      'transition-colors',
                      entry.isCurrentUser
                        ? 'bg-accent-primary/5'
                        : 'hover:bg-white/[0.02]'
                    )}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-text-muted">
                      #{entry.rank}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={cn(
                          'font-medium',
                          entry.isCurrentUser ? 'text-accent-primary' : 'text-text-default'
                        )}
                      >
                        {entry.displayName}
                        {entry.isCurrentUser && (
                          <span className="ml-2 text-xs text-accent-primary">(You)</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Star
                          className="h-3.5 w-3.5"
                          style={{ color: tierColor }}
                          fill={tierColor}
                        />
                        <span className="text-sm" style={{ color: tierColor }}>
                          {entry.tier}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-display text-sm font-semibold text-text-default">
                      {entry.points.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </PortalCard>

      {/* Tier distribution */}
      <PortalCard>
        <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
          Tier Distribution
        </h3>

        {/* Stacked bar */}
        <div className="mb-4 flex h-4 overflow-hidden rounded-full">
          {tierDistribution.map((td) => (
            <div
              key={td.tier}
              className="transition-all"
              style={{
                width: `${td.percent}%`,
                backgroundColor: td.color,
                opacity: 0.7,
              }}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4">
          {tierDistribution.map((td) => (
            <div key={td.tier} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: td.color }}
              />
              <span className="text-xs text-text-muted">
                {td.tier}{' '}
                <span className="font-semibold text-text-default">{td.count}</span>{' '}
                ({td.percent}%)
              </span>
            </div>
          ))}
        </div>
      </PortalCard>
    </div>
  );
}
