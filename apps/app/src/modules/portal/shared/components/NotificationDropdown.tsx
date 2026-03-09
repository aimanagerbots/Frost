'use client';

import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import {
  Bell,
  X,
  Package,
  Truck,
  CreditCard,
  AlertTriangle,
  Star,
  MessageSquare,
  Sparkles,
  Store,
} from 'lucide-react';
import { usePortalNotifications } from '../hooks';
import type { PortalNotification } from '../types';

// ─── Icon Mapping ──────────────────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
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

function getIcon(iconName: string): React.ElementType {
  return ICON_MAP[iconName] ?? Bell;
}

// ─── Relative Time ─────────────────────────────────────────────

function relativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
}

// ─── Component ─────────────────────────────────────────────────

export function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllRead } =
    usePortalNotifications();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const recentNotifications = notifications.slice(0, 10);

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-96 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-800">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead()}
                className="text-xs font-medium text-amber-600 hover:text-amber-700"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">
                No notifications yet
              </div>
            ) : (
              recentNotifications.map((notification) => (
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

// ─── Notification Item ─────────────────────────────────────────

function NotificationItem({
  notification,
  onRead,
}: {
  notification: PortalNotification;
  onRead: (id: string) => void;
}) {
  const Icon = getIcon(notification.icon);
  const isUrgent = notification.severity === 'urgent';
  const isWarning = notification.severity === 'warning';

  return (
    <button
      onClick={() => onRead(notification.id)}
      className={cn(
        'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50',
        isUrgent && 'border-l-2 border-red-500 bg-red-50',
        isWarning && !isUrgent && 'bg-amber-50'
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUrgent
            ? 'bg-red-100 text-red-600'
            : isWarning
              ? 'bg-amber-100 text-amber-600'
              : 'bg-gray-100 text-gray-500'
        )}
      >
        <Icon size={14} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              'text-sm',
              notification.read ? 'text-gray-600' : 'font-medium text-gray-800'
            )}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
          )}
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
          {notification.body}
        </p>
        <p className="mt-1 text-[10px] text-gray-400">
          {relativeTime(notification.timestamp)}
        </p>
      </div>
    </button>
  );
}
