'use client';

import { cn } from '@/lib/utils';
import { usePortalAuth } from '@/modules/portal/shared/hooks';
import { getIntegrationsForAccount } from '@/modules/portal/shared/mock-data';
import type { PortalIntegration } from '@/modules/portal/shared/types';

interface StoreOrdersIntegrationsProps {
  className?: string;
}

const STATUS_DOTS: Record<PortalIntegration['status'], string> = {
  connected: 'bg-emerald-400',
  disconnected: 'bg-gray-500',
  error: 'bg-red-400',
  pending: 'bg-amber-400',
};

const STATUS_LABELS: Record<PortalIntegration['status'], string> = {
  connected: 'Connected',
  disconnected: 'Disconnected',
  error: 'Error',
  pending: 'Pending',
};

const PLATFORM_COLORS: Record<string, string> = {
  dutchie: 'bg-purple-500/20 text-purple-400',
  jane: 'bg-emerald-500/20 text-emerald-400',
  treez: 'bg-amber-500/20 text-amber-400',
  flowhub: 'bg-blue-500/20 text-blue-400',
  weedmaps: 'bg-green-500/20 text-green-400',
  leafly: 'bg-teal-500/20 text-teal-400',
  'custom-webhook': 'bg-gray-500/20 text-gray-400',
  'text-bot': 'bg-sky-500/20 text-sky-400',
};

function formatLastSync(dateStr?: string): string {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function StoreOrdersIntegrations({ className }: StoreOrdersIntegrationsProps) {
  const { currentAccount } = usePortalAuth();
  const integrations = currentAccount
    ? getIntegrationsForAccount(currentAccount.id)
    : [];

  return (
    <div className={className}>
      <h3 className="text-sm font-semibold text-text-bright mb-4">Integrations</h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="rounded-xl border border-border-default bg-card p-4 flex flex-col gap-3"
          >
            {/* Icon + Name */}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold',
                  PLATFORM_COLORS[integration.platform] ?? 'bg-gray-500/20 text-gray-400'
                )}
              >
                {integration.label.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-bright truncate">
                  {integration.label}
                </p>
                <div className="flex items-center gap-1.5">
                  <div className={cn('h-1.5 w-1.5 rounded-full', STATUS_DOTS[integration.status])} />
                  <span className="text-xs text-text-muted">
                    {STATUS_LABELS[integration.status]}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-text-muted line-clamp-2">
              {integration.description}
            </p>

            {/* Last Sync */}
            {integration.status === 'connected' && (
              <p className="text-xs text-text-muted mt-auto">
                Last sync: {formatLastSync(integration.lastSyncAt)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
