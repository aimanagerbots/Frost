'use client';

import { useState, useMemo } from 'react';
import { Package } from 'lucide-react';
import { PortalPageHeader } from '@/modules/portal/shared/components';
import { usePortalAuth, usePortalOrders } from '@/modules/portal/shared/hooks';
import { getPipelineData } from '@/modules/portal/shared/mock-data';
import {
  OrdersSummaryStats,
  OrdersActiveSection,
  OrdersList,
  OrderDetail,
  OrderFilters,
} from '@/modules/portal/orders/components';

export default function OrdersPage() {
  const { currentAccount } = usePortalAuth();
  const { data: orders = [], isLoading } = usePortalOrders(currentAccount?.id ?? '');

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  // Build pipeline lookup for active orders
  const pipelineLookup = useMemo(() => {
    const lookup: Record<string, ReturnType<typeof getPipelineData>> = {};
    for (const order of orders) {
      const data = getPipelineData(order.id);
      if (data) lookup[order.id] = data;
    }
    return lookup;
  }, [orders]);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) ?? null;

  // If an order is selected, show the detail view
  if (selectedOrder) {
    return (
      <div className="space-y-6">
        <PortalPageHeader
          icon={Package}
          title="My Orders"
          subtitle="Track your wholesale orders from Frost"
        />
        <OrderDetail
          order={selectedOrder}
          pipelineData={pipelineLookup[selectedOrder.id]}
          onBack={() => setSelectedOrderId(null)}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PortalPageHeader
          icon={Package}
          title="My Orders"
          subtitle="Track your wholesale orders from Frost"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl border border-border-default bg-card"
            />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-xl border border-border-default bg-card" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        icon={Package}
        title="My Orders"
        subtitle="Track your wholesale orders from Frost"
      />

      {/* Summary stats */}
      <OrdersSummaryStats orders={orders} />

      {/* Active orders with pipeline trackers */}
      <OrdersActiveSection
        orders={orders}
        pipelineData={pipelineLookup}
        onSelectOrder={setSelectedOrderId}
      />

      {/* Filters */}
      <OrderFilters
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        paymentFilter={paymentFilter}
        onPaymentChange={setPaymentFilter}
      />

      {/* Full orders table */}
      <OrdersList
        orders={orders}
        pipelineData={pipelineLookup}
        onSelectOrder={setSelectedOrderId}
        statusFilter={statusFilter}
        dateRange={dateRange}
        paymentFilter={paymentFilter}
      />
    </div>
  );
}
