'use client';

import Link from 'next/link';
import {
  AlertTriangle,
  Bell,
  Package,
  Truck,
  CreditCard,
  Tag,
  MessageSquare,
  Sparkles,
  ShoppingBag,
  Box,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePortalNotifications } from '@/modules/portal/shared/hooks';
import { PortalCard } from '@/modules/portal/shared/components';
import type { PortalNotification } from '@/modules/portal/shared/types';
import type { LucideIcon } from 'lucide-react';

const ICON_MAP: Record<PortalNotification['type'], LucideIcon> = {
  order_update: Package,
  delivery_alert: Truck,
  payment_reminder: CreditCard,
  payment_overdue: AlertTriangle,
  stock_alert: Box,
  new_product: ShoppingBag,
  promotion: Tag,
  message: MessageSquare,
  ai_suggestion: Sparkles,
  store_order: ShoppingBag,
};

const SEVERITY_STYLES: Record<string, { border: string; iconColor: string; bg: string }> = {
  urgent: {
    border: 'border-[#FB7185]/40',
    iconColor: 'text-[#FB7185]',
    bg: 'bg-[#FB7185]/5',
  },
  warning: {
    border: 'border-[#FBBF24]/40',
    iconColor: 'text-[#FBBF24]',
    bg: 'bg-[#FBBF24]/5',
  },
  info: {
    border: 'border-border-default',
    iconColor: 'text-accent-primary',
    bg: 'bg-accent-primary/5',
  },
};

function formatRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function DashboardAlerts() {
  const { notifications } = usePortalNotifications();

  // Prioritize unread, then by severity, max 5
  const prioritized = [...notifications]
    .filter((n) => !n.read)
    .sort((a, b) => {
      const severityOrder = { urgent: 0, warning: 1, info: 2 };
      const aSev = severityOrder[a.severity ?? 'info'] ?? 2;
      const bSev = severityOrder[b.severity ?? 'info'] ?? 2;
      return aSev - bSev;
    })
    .slice(0, 5);

  return (
    <PortalCard padding="sm" className="flex flex-col">
      <div className="flex items-center gap-2 px-2 pb-3 pt-1">
        <AlertTriangle className="h-4 w-4 text-[#FB7185]" />
        <h3 className="font-display text-sm font-semibold text-text-bright">
          Needs Your Attention
        </h3>
        {prioritized.length > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FB7185] px-1.5 text-[10px] font-bold text-white">
            {prioritized.length}
          </span>
        )}
      </div>

      {prioritized.length === 0 ? (
        <div className="px-2 py-6 text-center text-sm text-text-muted">
          Nothing urgent right now
        </div>
      ) : (
        <ul className="space-y-2 px-1">
          {prioritized.map((notification) => {
            const severity = notification.severity ?? 'info';
            const styles = SEVERITY_STYLES[severity] ?? SEVERITY_STYLES.info;
            const Icon = ICON_MAP[notification.type] ?? Bell;

            return (
              <li
                key={notification.id}
                className={cn(
                  'flex gap-3 rounded-lg border p-3',
                  styles.border,
                  styles.bg
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                    severity === 'urgent' ? 'bg-[#FB7185]/15' : severity === 'warning' ? 'bg-[#FBBF24]/15' : 'bg-accent-primary/10'
                  )}
                >
                  <Icon className={cn('h-4 w-4', styles.iconColor)} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-default">
                    {notification.title}
                  </p>
                  <p className="line-clamp-1 text-xs text-text-muted">
                    {notification.body}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-[11px] text-text-muted">
                      {formatRelativeTime(notification.timestamp)}
                    </span>
                    {notification.actionUrl && notification.actionLabel && (
                      <Link
                        href={notification.actionUrl}
                        className="text-[11px] font-semibold text-accent-primary hover:text-accent-primary-hover"
                      >
                        {notification.actionLabel}
                      </Link>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Link
        href="/comms-hub"
        className="mt-auto block border-t border-border-default px-2 pt-3 pb-1 text-center text-xs font-medium text-accent-primary hover:text-accent-primary-hover"
      >
        View All Notifications
      </Link>
    </PortalCard>
  );
}
