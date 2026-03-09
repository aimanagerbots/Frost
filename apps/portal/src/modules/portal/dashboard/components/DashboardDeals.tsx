'use client';

import { Tag, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePortalPromotions } from '@/modules/portal/shared/hooks';
import { PortalCard } from '@/modules/portal/shared/components';

function getCountdown(endDate: string): string {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return 'Expired';

  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);

  if (days > 0) return `${days}d ${hours}h left`;
  return `${hours}h left`;
}

function formatDiscount(type: string, value: number): string {
  if (type === 'percentage') return `${value}% OFF`;
  if (type === 'bogo') return 'BOGO';
  return 'BUNDLE';
}

export function DashboardDeals() {
  const { data: promotions } = usePortalPromotions();

  const activeDeals = (promotions ?? [])
    .filter((p) => p.isActive)
    .slice(0, 3);

  if (activeDeals.length === 0) return null;

  return (
    <PortalCard padding="sm" className="flex flex-col">
      <div className="flex items-center gap-2 px-2 pb-3 pt-1">
        <Tag className="h-4 w-4 text-text-muted" />
        <h3 className="font-display text-sm font-semibold text-text-bright">
          Active Deals
        </h3>
      </div>

      <ul className="divide-y divide-border-default">
        {activeDeals.map((promo) => {
          const countdown = getCountdown(promo.endDate);
          const isExpiring = countdown.includes('h') && !countdown.includes('d');

          return (
            <li key={promo.id} className="flex items-start gap-3 px-2 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-default">
                  {promo.title}
                </p>
                <p className="mt-0.5 line-clamp-1 text-xs text-text-muted">
                  {promo.description}
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <span className="rounded-md bg-accent-primary/15 px-2 py-0.5 text-[11px] font-bold text-accent-primary">
                  {formatDiscount(promo.discountType, promo.discountValue)}
                </span>
                <span
                  className={cn(
                    'flex items-center gap-1 text-[11px]',
                    isExpiring ? 'text-warning' : 'text-text-muted'
                  )}
                >
                  <Clock className="h-3 w-3" />
                  {countdown}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </PortalCard>
  );
}
