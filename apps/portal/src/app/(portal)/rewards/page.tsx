'use client';

import { useState } from 'react';
import {
  Gift,
  Star,
  Coins,
  Trophy as TrophyIcon,
  ShoppingBag,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PortalPageHeader } from '@/modules/portal/shared/components';
import { usePortalAuth, usePortalRewards } from '@/modules/portal/shared/hooks';
import {
  RewardsTierStatus,
  RewardsPointsLedger,
  RewardsAchievements,
  RewardsCatalog,
  RewardsLeaderboard,
} from '@/modules/portal/rewards/components';

const TABS = [
  { id: 'tier', label: 'Tier Status', icon: Star },
  { id: 'points', label: 'Points', icon: Coins },
  { id: 'achievements', label: 'Achievements', icon: Award },
  { id: 'catalog', label: 'Catalog', icon: ShoppingBag },
  { id: 'leaderboard', label: 'Leaderboard', icon: TrophyIcon },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('tier');
  const { currentAccount } = usePortalAuth();
  const accountId = currentAccount?.id ?? '';
  const { data, isLoading } = usePortalRewards(accountId);

  if (!currentAccount) {
    return (
      <div className="space-y-6">
        <PortalPageHeader
          icon={Gift}
          title="Frost Rewards"
          subtitle="Earn points, unlock tiers, redeem rewards"
        />
        <div className="rounded-xl border border-border-default bg-card p-8 text-center text-text-muted">
          Please log in to view your rewards.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        icon={Gift}
        title="Frost Rewards"
        subtitle="Earn points, unlock tiers, redeem rewards"
      />

      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto border-b border-border-default">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'border-accent-primary text-accent-primary'
                  : 'border-transparent text-text-muted hover:text-text-default'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl border border-border-default bg-card"
            />
          ))}
        </div>
      )}

      {/* Tab content */}
      {data && (
        <>
          {activeTab === 'tier' && <RewardsTierStatus data={data} />}
          {activeTab === 'points' && <RewardsPointsLedger data={data} />}
          {activeTab === 'achievements' && (
            <RewardsAchievements achievements={data.achievements} />
          )}
          {activeTab === 'catalog' && (
            <RewardsCatalog catalog={data.catalog} totalPoints={data.totalPoints} />
          )}
          {activeTab === 'leaderboard' && (
            <RewardsLeaderboard leaderboard={data.leaderboard} />
          )}
        </>
      )}
    </div>
  );
}
