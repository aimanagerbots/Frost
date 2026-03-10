'use client';

import { useState, useMemo } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  TrendingUp,
  Gift,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PortalCard } from '@/modules/portal/shared/components';
import type { PointsTransaction, PortalRewardsData } from '../../shared/types';

const SOURCE_CONFIG: Record<
  PointsTransaction['source'],
  { label: string; className: string }
> = {
  order: { label: 'Order', className: 'bg-accent-primary/15 text-accent-primary' },
  'early-payment': { label: 'Early Pay', className: 'bg-[#00E5A0]/15 text-[#00E5A0]' },
  training: { label: 'Training', className: 'bg-[#A78BFA]/15 text-[#A78BFA]' },
  event: { label: 'Event', className: 'bg-[#F59E0B]/15 text-[#F59E0B]' },
  referral: { label: 'Referral', className: 'bg-[#EC4899]/15 text-[#EC4899]' },
  achievement: { label: 'Achievement', className: 'bg-[#FBBF24]/15 text-[#FBBF24]' },
  redemption: { label: 'Redemption', className: 'bg-[#FB7185]/15 text-[#FB7185]' },
};

type FilterType = 'all' | 'earn' | 'redeem';

interface RewardsPointsLedgerProps {
  data: PortalRewardsData;
}

export function RewardsPointsLedger({ data }: RewardsPointsLedgerProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const { transactions, totalPoints } = data;

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const earnedThisMonth = transactions
      .filter((t) => t.type === 'earn' && new Date(t.date) >= monthStart)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalRedeemed = transactions
      .filter((t) => t.type === 'redeem')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const pending = transactions
      .filter((t) => t.type === 'earn' && t.source === 'order')
      .slice(0, 1)
      .reduce((sum, t) => sum + Math.round(t.amount * 0.1), 0);

    return { earnedThisMonth, totalRedeemed, pending };
  }, [transactions]);

  const filteredTransactions = useMemo(
    () =>
      filter === 'all'
        ? transactions
        : transactions.filter((t) => t.type === filter),
    [transactions, filter]
  );

  const summaryCards = [
    {
      label: 'Total Points',
      value: totalPoints.toLocaleString(),
      icon: Coins,
      iconClass: 'text-accent-primary',
    },
    {
      label: 'Earned This Month',
      value: `+${stats.earnedThisMonth.toLocaleString()}`,
      icon: TrendingUp,
      iconClass: 'text-[#00E5A0]',
    },
    {
      label: 'Redeemed',
      value: stats.totalRedeemed.toLocaleString(),
      icon: Gift,
      iconClass: 'text-[#FB7185]',
    },
    {
      label: 'Pending',
      value: stats.pending > 0 ? `+${stats.pending}` : '0',
      icon: Clock,
      iconClass: 'text-[#FBBF24]',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <PortalCard key={card.label}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">{card.label}</p>
                  <p className="font-display text-2xl font-bold text-text-bright">
                    {card.value}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                  <Icon className={cn('h-5 w-5', card.iconClass)} />
                </div>
              </div>
            </PortalCard>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'earn', 'redeem'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              filter === f
                ? 'bg-accent-primary/15 text-accent-primary'
                : 'text-text-muted hover:bg-white/5 hover:text-text-default'
            )}
          >
            {f === 'all' ? 'All' : f === 'earn' ? 'Earned' : 'Redeemed'}
          </button>
        ))}
      </div>

      {/* Transaction table */}
      <PortalCard padding="sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-default text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {filteredTransactions.map((tx) => {
                const isEarn = tx.type === 'earn';
                const sourceInfo = SOURCE_CONFIG[tx.source];
                return (
                  <tr key={tx.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-text-muted">
                      {new Date(tx.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-default">
                      {tx.description}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                          sourceInfo.className
                        )}
                      >
                        {sourceInfo.label}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isEarn ? (
                          <ArrowUpRight className="h-4 w-4 text-[#00E5A0]" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-[#FB7185]" />
                        )}
                        <span
                          className={cn(
                            'font-display text-sm font-semibold',
                            isEarn ? 'text-[#00E5A0]' : 'text-[#FB7185]'
                          )}
                        >
                          {isEarn ? '+' : ''}
                          {tx.amount.toLocaleString()}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="py-12 text-center text-sm text-text-muted">
            No {filter === 'earn' ? 'earned' : filter === 'redeem' ? 'redeemed' : ''}{' '}
            transactions found.
          </div>
        )}
      </PortalCard>
    </div>
  );
}
