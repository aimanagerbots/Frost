'use client';

import Link from 'next/link';
import {
  Bell,
  Package,
  Truck,
  CreditCard,
  AlertTriangle,
  Tag,
  MessageSquare,
  Sparkles,
  ShoppingBag,
  Box,
} from 'lucide-react';
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

export function DashboardNotificationsPreview() {
  const { notifications, unreadCount } = usePortalNotifications();

  const unread = notifications
    .filter((n) => !n.read)
    .slice(0, 3);

  return (
    <PortalCard padding="sm" className="flex flex-col">
      <div className="flex items-center justify-between px-2 pb-3 pt-1">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-text-muted" />
          <h3 className="font-display text-sm font-semibold text-text-bright">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-primary px-1.5 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {unread.length === 0 ? (
        <div className="px-2 py-6 text-center text-sm text-text-muted">
          You&apos;re all caught up
        </div>
      ) : (
        <ul className="divide-y divide-border-default">
          {unread.map((notification) => {
            const Icon = ICON_MAP[notification.type] ?? Bell;
            return (
              <li key={notification.id} className="flex gap-3 px-2 py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-primary/10">
                  <Icon className="h-4 w-4 text-accent-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-default">
                    {notification.title}
                  </p>
                  <p className="line-clamp-1 text-xs text-text-muted">
                    {notification.body}
                  </p>
                </div>
                <span className="shrink-0 text-[11px] text-text-muted">
                  {formatRelativeTime(notification.timestamp)}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      <Link
        href="/messages"
        className="mt-auto block border-t border-border-default px-2 pt-3 pb-1 text-center text-xs font-medium text-accent-primary hover:text-accent-primary-hover"
      >
        View All
      </Link>
    </PortalCard>
  );
}
