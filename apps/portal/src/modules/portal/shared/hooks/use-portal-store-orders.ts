import { create } from 'zustand';
import type { StoreOrder, StoreOrderStats } from '../types';
import {
  getStoreOrdersForAccount,
  getStoreOrderStatsForAccount,
} from '../mock-data';

const ACTIVE_STATUSES: StoreOrder['status'][] = [
  'new',
  'accepted',
  'preparing',
  'ready',
];

interface PortalStoreOrderState {
  storeOrders: StoreOrder[];
  stats: StoreOrderStats | null;
  initializeForAccount: (accountId: string) => void;
  acceptOrder: (orderId: string) => void;
  declineOrder: (orderId: string, reason: string) => void;
  updateStatus: (
    orderId: string,
    status: StoreOrder['status'],
    preparedBy?: string
  ) => void;
  getOrdersByStatus: (status: StoreOrder['status']) => StoreOrder[];
  activeOrders: () => StoreOrder[];
}

export const usePortalStoreOrders = create<PortalStoreOrderState>(
  (set, get) => ({
    storeOrders: [],
    stats: null,

    initializeForAccount: (accountId: string) => {
      const storeOrders = getStoreOrdersForAccount(accountId);
      const stats = getStoreOrderStatsForAccount(accountId);
      set({ storeOrders, stats });
    },

    acceptOrder: (orderId: string) => {
      const { storeOrders } = get();
      const now = new Date().toISOString();
      const updatedOrders = storeOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: 'accepted' as const,
              acceptedAt: now,
              statusHistory: [
                ...order.statusHistory,
                { status: 'accepted', timestamp: now },
              ],
            }
          : order
      );
      set({ storeOrders: updatedOrders });
    },

    declineOrder: (orderId: string, reason: string) => {
      const { storeOrders } = get();
      const now = new Date().toISOString();
      const updatedOrders = storeOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: 'declined' as const,
              declineReason: reason,
              statusHistory: [
                ...order.statusHistory,
                { status: 'declined', timestamp: now, note: reason },
              ],
            }
          : order
      );
      set({ storeOrders: updatedOrders });
    },

    updateStatus: (
      orderId: string,
      status: StoreOrder['status'],
      preparedBy?: string
    ) => {
      const { storeOrders } = get();
      const now = new Date().toISOString();
      const updatedOrders = storeOrders.map((order) => {
        if (order.id !== orderId) return order;

        const updates: Partial<StoreOrder> = {
          status,
          statusHistory: [
            ...order.statusHistory,
            { status, timestamp: now },
          ],
        };

        if (status === 'preparing') updates.preparingAt = now;
        if (status === 'ready') updates.readyAt = now;
        if (status === 'picked-up' || status === 'cancelled' || status === 'no-show') {
          updates.completedAt = now;
        }
        if (preparedBy) updates.preparedBy = preparedBy;

        return { ...order, ...updates };
      });
      set({ storeOrders: updatedOrders });
    },

    getOrdersByStatus: (status: StoreOrder['status']) => {
      const { storeOrders } = get();
      return storeOrders.filter((o) => o.status === status);
    },

    activeOrders: () => {
      const { storeOrders } = get();
      return storeOrders.filter((o) =>
        ACTIVE_STATUSES.includes(o.status)
      );
    },
  })
);
