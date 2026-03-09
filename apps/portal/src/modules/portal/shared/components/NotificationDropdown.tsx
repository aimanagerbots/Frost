'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Bell,
  Package,
  Truck,
  CreditCard,
  AlertTriangle,
  Star,
  MessageSquare,
  Sparkles,
  Store,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePortalNotifications } from '../hooks';
import type { PortalNotification } from '../types';

const ICON_MAP: Record<string, LucideIcon> = {
  package: Package,
  truck: Truck,
  'credit-card': CreditCard,
  'alert-triangle': AlertTriangle,
  star: Star,
  'message-square': MessageSquare,
  sparkles: Sparkles,
  store: Store,
  bell: Bell,
};

function relativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead, markAllRead } =
    usePortalNotifications();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayCount = unreadCount > 99 ? '99+' : unreadCount;

  return (
    <div ref={containerRef} className="relative">
      {/* Bell button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'relative rounded-lg p-2 transition-colors',
          'text-text-muted hover:bg-white/[0.04] hover:text-text-default'
        )}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-primary px-1 text-[10px] font-medium text-white">
            {displayCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-96 overflow-hidden rounded-xl border border-border-default bg-card shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border-default px-4 py-3">
            <h3 className="text-sm font-semibold text-text-bright">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs font-medium text-accent-primary hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-text-muted">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={markAsRead}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationItem({
  notification,
  onRead,
}: {
  notification: PortalNotification;
  onRead: (id: string) => void;
}) {
  const Icon = ICON_MAP[notification.icon] ?? Bell;
  const severity = notification.severity ?? 'info';

  return (
    <button
      type="button"
      onClick={() => onRead(notification.id)}
      className={cn(
        'flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.04]',
        severity === 'urgent' && 'border-l-2 border-red-500 bg-red-500/10',
        severity === 'warning' && 'border-l-2 border-amber-500 bg-amber-500/10'
      )}
    >
      {/* Icon circle */}
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          severity === 'urgent' && 'bg-red-500/20 text-red-400',
          severity === 'warning' && 'bg-amber-500/20 text-amber-400',
          severity === 'info' && 'bg-white/[0.06] text-text-muted'
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              'text-sm',
              !notification.read
                ? 'font-medium text-text-default'
                : 'text-text-muted'
            )}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary" />
          )}
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs text-text-muted">
          {notification.body}
        </p>
        <p className="mt-1 text-[10px] text-text-muted">
          {relativeTime(notification.timestamp)}
        </p>
      </div>
    </button>
  );
}
