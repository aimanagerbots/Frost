'use client';

import {
  Snowflake,
  Package,
  Layers,
  Clock,
  Flame,
  GraduationCap,
  Award,
  TrendingUp,
  Crown,
  Users,
  Lock,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PortalCard } from '@/modules/portal/shared/components';
import type { Achievement } from '../../shared/types';

const ICON_MAP: Record<string, LucideIcon> = {
  Snowflake,
  Package,
  Layers,
  Clock,
  Flame,
  GraduationCap,
  Award,
  TrendingUp,
  Crown,
  Users,
};

const CATEGORY_CONFIG: Record<
  Achievement['category'],
  { label: string; color: string }
> = {
  ordering: { label: 'Ordering', color: '#5BB8E6' },
  loyalty: { label: 'Loyalty', color: '#F59E0B' },
  engagement: { label: 'Engagement', color: '#A78BFA' },
  performance: { label: 'Performance', color: '#00E5A0' },
};

interface RewardsAchievementsProps {
  achievements: Achievement[];
}

export function RewardsAchievements({ achievements }: RewardsAchievementsProps) {
  const categories = (['ordering', 'loyalty', 'engagement', 'performance'] as const).map(
    (cat) => ({
      ...CATEGORY_CONFIG[cat],
      id: cat,
      items: achievements.filter((a) => a.category === cat),
    })
  );

  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;
  const totalCount = achievements.length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <PortalCard>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted">Achievements Unlocked</p>
            <p className="font-display text-2xl font-bold text-text-bright">
              {unlockedCount}{' '}
              <span className="text-lg font-normal text-text-muted">/ {totalCount}</span>
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-primary/10">
            <Award className="h-6 w-6 text-accent-primary" />
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-accent-primary transition-all duration-700"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
      </PortalCard>

      {/* Category sections */}
      {categories.map((cat) => (
        <div key={cat.id}>
          <div className="mb-3 flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: cat.color }}
            />
            <h3 className="font-display text-sm font-semibold text-text-default">
              {cat.label}
            </h3>
            <span className="text-xs text-text-muted">
              ({cat.items.filter((a) => a.unlockedAt).length}/{cat.items.length})
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cat.items.map((achievement) => {
              const isUnlocked = !!achievement.unlockedAt;
              const Icon = ICON_MAP[achievement.icon] ?? Award;
              const progressPct =
                achievement.target > 0
                  ? Math.min(100, Math.round((achievement.progress / achievement.target) * 100))
                  : 0;

              return (
                <PortalCard
                  key={achievement.id}
                  padding="sm"
                  className={cn(
                    'relative transition-all',
                    isUnlocked
                      ? 'border-border-default'
                      : 'border-border-default opacity-60 grayscale'
                  )}
                >
                  {/* Glow for unlocked */}
                  {isUnlocked && (
                    <div
                      className="pointer-events-none absolute inset-0 rounded-xl opacity-5"
                      style={{
                        background: `radial-gradient(ellipse at center, ${cat.color}, transparent 70%)`,
                      }}
                    />
                  )}

                  <div className="relative flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className={cn(
                        'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg',
                        isUnlocked ? 'bg-white/10' : 'bg-white/5'
                      )}
                    >
                      {isUnlocked ? (
                        <Icon className="h-5 w-5" style={{ color: cat.color }} />
                      ) : (
                        <Lock className="h-4 w-4 text-text-muted" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-text-default">
                        {achievement.name}
                      </p>
                      <p className="mt-0.5 text-xs text-text-muted">
                        {achievement.description}
                      </p>

                      {/* Progress or unlock date */}
                      {isUnlocked ? (
                        <p className="mt-2 text-xs text-text-muted">
                          Unlocked{' '}
                          {new Date(achievement.unlockedAt!).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      ) : (
                        <div className="mt-2">
                          <div className="mb-1 flex items-center justify-between text-xs text-text-muted">
                            <span>
                              {achievement.progress}/{achievement.target}
                            </span>
                            <span>{progressPct}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${progressPct}%`,
                                backgroundColor: cat.color,
                                opacity: 0.6,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </PortalCard>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
