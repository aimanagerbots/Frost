import { create } from 'zustand';
import type { PortalNotification } from '../types';
import { getNotificationsForAccount } from '../mock-data';

interface PortalNotificationState {
  notifications: PortalNotification[];
  unreadCount: number;
  initializeForAccount: (accountId: string) => void;
  markAsRead: (notificationId: string) => void;
  markAllRead: () => void;
}

export const usePortalNotifications = create<PortalNotificationState>(
  (set, get) => ({
    notifications: [],
    unreadCount: 0,

    initializeForAccount: (accountId: string) => {
      const notifications = getNotificationsForAccount(accountId);
      const unreadCount = notifications.filter((n) => !n.read).length;
      set({ notifications, unreadCount });
    },

    markAsRead: (notificationId: string) => {
      const { notifications, unreadCount } = get();
      const target = notifications.find((n) => n.id === notificationId);
      if (!target || target.read) return;

      const updatedNotifications = notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      set({
        notifications: updatedNotifications,
        unreadCount: Math.max(0, unreadCount - 1),
      });
    },

    markAllRead: () => {
      const { notifications } = get();
      const updatedNotifications = notifications.map((n) => ({
        ...n,
        read: true,
      }));
      set({ notifications: updatedNotifications, unreadCount: 0 });
    },
  })
);
