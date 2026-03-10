'use client';

import { useState, useMemo } from 'react';
import {
  CreditCard,
  Package,
  KeyRound,
  Shirt,
  Wrench,
  ShoppingBag,
  AlertCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PortalCard } from '@/modules/portal/shared/components';
import type { RewardItem } from '../../shared/types';

const CATEGORY_TABS: {
  id: RewardItem['category'] | 'all';
  label: string;
  icon: LucideIcon;
}[] = [
  { id: 'all', label: 'All', icon: ShoppingBag },
  { id: 'credit', label: 'Credits', icon: CreditCard },
  { id: 'product', label: 'Products', icon: Package },
  { id: 'access', label: 'Access', icon: KeyRound },
  { id: 'merch', label: 'Merch', icon: Shirt },
  { id: 'service', label: 'Services', icon: Wrench },
];

const CATEGORY_COLORS: Record<RewardItem['category'], string> = {
  credit: '#00E5A0',
  product: '#5BB8E6',
  access: '#A78BFA',
  merch: '#F59E0B',
  service: '#EC4899',
};

interface RewardsCatalogProps {
  catalog: RewardItem[];
  totalPoints: number;
}

export function RewardsCatalog({ catalog, totalPoints }: RewardsCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<RewardItem['category'] | 'all'>(
    'all'
  );

  const filteredItems = useMemo(
    () =>
      activeCategory === 'all'
        ? catalog
        : catalog.filter((item) => item.category === activeCategory),
    [catalog, activeCategory]
  );

  return (
    <div className="space-y-6">
      {/* Points balance bar */}
      <PortalCard>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted">Available to Redeem</p>
            <p className="font-display text-2xl font-bold text-accent-primary">
              {totalPoints.toLocaleString()} pts
            </p>
          </div>
          <ShoppingBag className="h-6 w-6 text-accent-primary" />
        </div>
      </PortalCard>

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORY_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent-primary/15 text-accent-primary'
                  : 'text-text-muted hover:bg-white/5 hover:text-text-default'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item) => {
          const canAfford = totalPoints >= item.pointsCost;
          const pointsNeeded = item.pointsCost - totalPoints;
          const catColor = CATEGORY_COLORS[item.category];

          return (
            <PortalCard
              key={item.id}
              className="group relative flex flex-col justify-between transition-colors hover:bg-card-hover"
            >
              {/* Limited badge */}
              {item.limitedQuantity != null && (
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#FBBF24]/15 px-2 py-0.5 text-xs font-medium text-[#FBBF24]">
                  <AlertCircle className="h-3 w-3" />
                  Only {item.limitedQuantity} left
                </div>
              )}

              {/* Category dot */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: catColor }}
                  />
                  <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
                    {item.category}
                  </span>
                </div>

                <h4 className="font-display text-base font-semibold text-text-bright">
                  {item.name}
                </h4>
                <p className="mt-1 text-sm text-text-muted">{item.description}</p>
              </div>

              {/* Footer: cost + button */}
              <div className="mt-4 flex items-center justify-between border-t border-border-default pt-4">
                <div>
                  <p className="font-display text-lg font-bold text-text-bright">
                    {item.pointsCost.toLocaleString()}
                  </p>
                  <p className="text-xs text-text-muted">points</p>
                </div>

                {canAfford ? (
                  <button className="rounded-lg bg-accent-primary/15 px-4 py-2 text-sm font-semibold text-accent-primary transition-colors hover:bg-accent-primary/25">
                    Redeem
                  </button>
                ) : (
                  <div className="text-right">
                    <button
                      disabled
                      className="cursor-not-allowed rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-text-muted"
                    >
                      Redeem
                    </button>
                    <p className="mt-1 text-xs text-[#FB7185]">
                      Need {pointsNeeded.toLocaleString()} more
                    </p>
                  </div>
                )}
              </div>
            </PortalCard>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <PortalCard>
          <div className="py-8 text-center text-sm text-text-muted">
            No rewards available in this category.
          </div>
        </PortalCard>
      )}
    </div>
  );
}
