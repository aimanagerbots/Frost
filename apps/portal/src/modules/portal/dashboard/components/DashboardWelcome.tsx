'use client';

import { cn } from '@/lib/utils';
import { usePortalAuth } from '@/modules/portal/shared/hooks';
import { PortalCard } from '@/modules/portal/shared/components';

const HEALTH_CONFIG = {
  thriving: { label: 'Thriving', color: 'bg-green-500/15 text-green-400', dot: 'bg-green-500' },
  healthy: { label: 'Healthy', color: 'bg-blue-500/15 text-blue-400', dot: 'bg-blue-500' },
  'at-risk': { label: 'At Risk', color: 'bg-amber-500/15 text-amber-400', dot: 'bg-amber-500' },
  churning: { label: 'Churning', color: 'bg-red-500/15 text-red-400', dot: 'bg-red-500' },
} as const;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function DashboardWelcome() {
  const { currentAccount } = usePortalAuth();

  if (!currentAccount) return null;

  const health = HEALTH_CONFIG[currentAccount.healthStatus];

  return (
    <PortalCard className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-display text-xl font-semibold text-text-bright">
          {getGreeting()}, {currentAccount.businessName}
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          {currentAccount.pipelineLabel}
        </p>
      </div>

      <span
        className={cn(
          'inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
          health.color
        )}
      >
        <span className={cn('h-1.5 w-1.5 rounded-full', health.dot)} />
        {health.label}
      </span>
    </PortalCard>
  );
}
