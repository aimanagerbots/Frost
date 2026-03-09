'use client';

import { useState, useCallback } from 'react';
import { Store } from 'lucide-react';
import { PortalPageHeader } from '@/modules/portal/shared/components';
import { usePortalStoreOrders } from '@/modules/portal/shared/hooks';
import {
  StoreOrdersHeader,
  StoreOrdersKanban,
  StoreOrdersCompleted,
  StoreOrderDetail,
  DeclineModal,
  StoreOrdersIntegrations,
  StoreOrdersTextBot,
  StoreOrdersAnalytics,
} from '@/modules/portal/store-orders/components';

export default function StoreOrdersPage() {
  const {
    storeOrders,
    stats,
    acceptOrder,
    declineOrder,
    updateStatus,
  } = usePortalStoreOrders();

  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [declineOrderId, setDeclineOrderId] = useState<string | null>(null);

  const selectedOrder = storeOrders.find((o) => o.id === selectedOrderId) ?? null;

  const activeOrders = storeOrders.filter((o) =>
    ['new', 'accepted', 'preparing', 'ready'].includes(o.status)
  );
  const completedOrders = storeOrders.filter((o) =>
    ['picked-up', 'cancelled', 'no-show', 'declined'].includes(o.status)
  );

  const handleAction = useCallback(
    (action: string, orderId: string) => {
      switch (action) {
        case 'accept':
          acceptOrder(orderId);
          break;
        case 'decline':
          setDeclineOrderId(orderId);
          break;
        case 'start-preparing':
          updateStatus(orderId, 'preparing');
          break;
        case 'mark-ready':
          updateStatus(orderId, 'ready');
          break;
        case 'picked-up':
          updateStatus(orderId, 'picked-up');
          break;
        case 'no-show':
          updateStatus(orderId, 'no-show');
          break;
      }
    },
    [acceptOrder, updateStatus]
  );

  const handleDeclineConfirm = useCallback(
    (reason: string) => {
      if (declineOrderId) {
        declineOrder(declineOrderId, reason);
        setDeclineOrderId(null);
      }
    },
    [declineOrderId, declineOrder]
  );

  return (
    <div className="space-y-6">
      <PortalPageHeader
        icon={Store}
        title="Store Orders"
        subtitle="Manage consumer pickup orders"
      />

      {/* Header with stats + view toggle */}
      <StoreOrdersHeader
        stats={stats}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Kanban board (active orders) */}
      <StoreOrdersKanban
        orders={activeOrders}
        onAction={handleAction}
        onViewDetail={setSelectedOrderId}
      />

      {/* Completed orders table */}
      {completedOrders.length > 0 && (
        <StoreOrdersCompleted orders={completedOrders} />
      )}

      {/* Integrations + Text Bot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StoreOrdersIntegrations />
        </div>
        <StoreOrdersTextBot />
      </div>

      {/* Analytics */}
      <StoreOrdersAnalytics stats={stats} />

      {/* Order detail drawer */}
      <StoreOrderDetail
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrderId(null)}
        onAction={handleAction}
      />

      {/* Decline modal */}
      <DeclineModal
        isOpen={!!declineOrderId}
        onClose={() => setDeclineOrderId(null)}
        onConfirm={handleDeclineConfirm}
      />
    </div>
  );
}
