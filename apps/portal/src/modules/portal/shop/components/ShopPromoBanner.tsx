'use client';

import { useEffect, useState, useCallback } from 'react';
import { X, Clock, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePortalPromotions } from '@/modules/portal/shared/hooks';
import type { PortalPromotion } from '@/modules/portal/shared/types';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

function getTimeLeft(endDate: string): TimeLeft {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
  };
}

function formatDiscountBadge(promo: PortalPromotion): string {
  if (promo.discountType === 'percentage') return `${promo.discountValue}% OFF`;
  if (promo.discountType === 'bogo') return 'BOGO';
  return `Bundle Deal`;
}

const ACCENT_GRADIENTS = [
  'from-accent-primary to-blue-600',
  'from-emerald-500 to-teal-600',
] as const;

export function ShopPromoBanner() {
  const { data: promotions } = usePortalPromotions();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [countdowns, setCountdowns] = useState<Record<string, TimeLeft>>({});

  const activePromos = (promotions ?? [])
    .filter((p) => p.isActive && !dismissed.has(p.id))
    .slice(0, 2);

  const updateCountdowns = useCallback(() => {
    const next: Record<string, TimeLeft> = {};
    for (const promo of activePromos) {
      next[promo.id] = getTimeLeft(promo.endDate);
    }
    setCountdowns(next);
  }, [activePromos]);

  useEffect(() => {
    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60_000);
    return () => clearInterval(interval);
  }, [updateCountdowns]);

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set([...prev, id]));
  };

  if (activePromos.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {activePromos.map((promo, idx) => {
        const tl = countdowns[promo.id] ?? getTimeLeft(promo.endDate);
        const gradient = ACCENT_GRADIENTS[idx % ACCENT_GRADIENTS.length];

        return (
          <div
            key={promo.id}
            className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-border-default bg-card"
          >
            {/* Accent bar */}
            <div
              className={cn(
                'h-full w-1.5 shrink-0 self-stretch bg-gradient-to-b',
                gradient
              )}
            />

            {/* Content */}
            <div className="flex flex-1 items-center gap-4 py-3 pr-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-accent-primary shrink-0" />
                  <h3 className="text-sm font-semibold text-text-bright truncate">
                    {promo.title}
                  </h3>
                </div>
                <p className="mt-0.5 text-xs text-text-muted line-clamp-1">
                  {promo.description}
                </p>
              </div>

              {/* Discount badge */}
              <span className="shrink-0 rounded-lg bg-accent-primary/15 px-3 py-1.5 text-xs font-bold text-accent-primary">
                {formatDiscountBadge(promo)}
              </span>

              {/* Countdown */}
              <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                <Clock className="h-3.5 w-3.5 text-text-muted" />
                <div className="flex items-center gap-1 font-mono text-xs text-text-default">
                  <span className="rounded bg-elevated px-1.5 py-0.5">
                    {String(tl.days).padStart(2, '0')}d
                  </span>
                  <span className="text-text-muted">:</span>
                  <span className="rounded bg-elevated px-1.5 py-0.5">
                    {String(tl.hours).padStart(2, '0')}h
                  </span>
                  <span className="text-text-muted">:</span>
                  <span className="rounded bg-elevated px-1.5 py-0.5">
                    {String(tl.minutes).padStart(2, '0')}m
                  </span>
                </div>
              </div>

              {/* Dismiss */}
              <button
                type="button"
                onClick={() => handleDismiss(promo.id)}
                className="shrink-0 rounded-lg p-1.5 text-text-muted transition-colors hover:bg-elevated hover:text-text-default"
                aria-label="Dismiss promotion"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
