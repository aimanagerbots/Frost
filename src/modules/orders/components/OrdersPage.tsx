'use client';

import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { SectionHeader, MetricCard, DataTable, StatusBadge, LoadingSkeleton, ErrorState } from '@/components';
import { useOrders } from '@/modules/orders/hooks/useOrders';
import { useOrderMetrics } from '@/modules/orders/hooks/useOrderMetrics';
import { useOrderPipeline } from '@/modules/orders/hooks/useOrderPipeline';
import { OrderPipeline } from './OrderPipeline';
import { OrderDrawer } from './OrderDrawer';
import type { Order, OrderFilter, OrderStatus, PaymentStatus } from '@/modules/orders/types';

const ORDERS_ACCENT = '#F59E0B';

const STATUS_VARIANT: Record<OrderStatus, 'muted' | 'info' | 'warning' | 'success'> = {
  pending: 'muted',
  confirmed: 'info',
  'in-production': 'warning',
  packaged: 'info',
  fulfilled: 'warning',
  shipped: 'warning',
  delivered: 'success',
  paid: 'success',
};

const PAYMENT_VARIANT: Record<PaymentStatus, 'muted' | 'success' | 'danger'> = {
  pending: 'muted',
  received: 'success',
  overdue: 'danger',
};

const selectClass =
  'rounded-lg border border-default bg-elevated px-2.5 py-1.5 text-xs text-text-default outline-none focus:border-hover';

export function OrdersPage() {
  const [filters, setFilters] = useState<OrderFilter>({});
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { data: orders, isLoading: ordersLoading, error: ordersError, refetch: refetchOrders } = useOrders(filters);
  const { data: metrics, isLoading: metricsLoading, error: metricsError, refetch: refetchMetrics } = useOrderMetrics();
  const { data: pipeline, isLoading: pipelineLoading, error: pipelineError, refetch: refetchPipeline } = useOrderPipeline();

  const isLoading = ordersLoading || metricsLoading || pipelineLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <LoadingSkeleton variant="text" />
        <LoadingSkeleton variant="card" count={3} />
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  const error = ordersError || metricsError || pipelineError;
  if (error) {
    return (
      <ErrorState
        title="Failed to load orders"
        message={error.message}
        onRetry={() => { refetchOrders(); refetchMetrics(); refetchPipeline(); }}
      />
    );
  }

  const tableColumns = [
    {
      header: 'Order #',
      accessor: 'orderNumber' as const,
      sortable: true,
      render: (row: Order) => (
        <span className="text-sm font-medium text-text-bright">{row.orderNumber}</span>
      ),
    },
    {
      header: 'Date',
      accessor: 'createdAt' as const,
      sortable: true,
      hideBelow: 'md' as const,
      render: (row: Order) =>
        new Date(row.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    },
    {
      header: 'Account',
      accessor: 'accountName' as const,
      sortable: true,
    },
    {
      header: 'Items',
      accessor: (row: Order) => row.items.length,
      sortable: true,
      hideBelow: 'lg' as const,
      render: (row: Order) => <span className="text-text-muted">{row.items.length}</span>,
    },
    {
      header: 'Total',
      accessor: 'total' as const,
      sortable: true,
      render: (row: Order) => (
        <span className="font-medium text-text-bright">${row.total.toLocaleString()}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      sortable: true,
      render: (row: Order) => (
        <StatusBadge
          variant={STATUS_VARIANT[row.status]}
          label={row.status.replace(/-/g, ' ')}
          size="sm"
        />
      ),
    },
    {
      header: 'Payment',
      accessor: 'paymentStatus' as const,
      sortable: true,
      hideBelow: 'md' as const,
      render: (row: Order) => (
        <StatusBadge
          variant={PAYMENT_VARIANT[row.paymentStatus]}
          label={row.paymentStatus}
          size="sm"
        />
      ),
    },
    {
      header: 'Rep',
      accessor: 'assignedRep' as const,
      sortable: true,
      hideBelow: 'lg' as const,
      render: (row: Order) => (
        <span className="text-xs text-text-muted">{row.assignedRep.split(' ')[0]}</span>
      ),
    },
  ];

  function handlePipelineClick(status: OrderStatus) {
    setFilters((prev) => ({
      ...prev,
      status: prev.status === status ? undefined : status,
    }));
  }

  return (
    <div className="space-y-6 p-6">
      <SectionHeader
        icon={ClipboardList}
        title="Orders"
        subtitle="Sales order management"
        accentColor={ORDERS_ACCENT}
        stats={[
          { label: 'Total', value: metrics?.totalOrders ?? 0 },
          { label: 'Pending', value: metrics?.pendingCount ?? 0 },
          { label: 'This Month', value: `$${((metrics?.revenueThisMonth ?? 0) / 1000000).toFixed(2)}M` },
        ]}
      />

      {/* Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <MetricCard label="Total Orders" value={metrics.totalOrders} accentColor={ORDERS_ACCENT} />
          <MetricCard label="Pending" value={metrics.pendingCount} accentColor="#94A3B8" />
          <MetricCard
            label="Avg Fulfillment"
            value={`${metrics.avgFulfillmentDays}d`}
            accentColor="#3B82F6"
          />
          <MetricCard
            label="On-Time Rate"
            value={`${metrics.onTimeRate}%`}
            trend={{ value: 2, direction: 'up' }}
            accentColor="#22C55E"
          />
          <MetricCard
            label="Avg Order Value"
            value={`$${metrics.avgOrderValue.toLocaleString()}`}
            accentColor={ORDERS_ACCENT}
          />
          <MetricCard
            label="Revenue (Month)"
            value={`$${(metrics.revenueThisMonth / 1000000).toFixed(2)}M`}
            trend={{ value: 8, direction: 'up' }}
            accentColor="#059669"
          />
        </div>
      )}

      {/* Pipeline */}
      {pipeline && (
        <OrderPipeline
          stages={pipeline}
          activeStatus={filters.status}
          onStageClick={handlePipelineClick}
        />
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filters.status ?? ''}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              status: (e.target.value || undefined) as OrderFilter['status'],
            }))
          }
          className={selectClass}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="in-production">In Production</option>
          <option value="packaged">Packaged</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="paid">Paid</option>
        </select>

        <select
          value={filters.paymentStatus ?? ''}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              paymentStatus: (e.target.value || undefined) as OrderFilter['paymentStatus'],
            }))
          }
          className={selectClass}
        >
          <option value="">All Payment</option>
          <option value="pending">Pending</option>
          <option value="received">Received</option>
          <option value="overdue">Overdue</option>
        </select>

        <select
          value={filters.category ?? ''}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              category: e.target.value || undefined,
            }))
          }
          className={selectClass}
        >
          <option value="">All Categories</option>
          <option value="flower">Flower</option>
          <option value="preroll">Preroll</option>
          <option value="vaporizer">Vaporizer</option>
          <option value="concentrate">Concentrate</option>
          <option value="edible">Edible</option>
          <option value="beverage">Beverage</option>
        </select>
      </div>

      {/* Orders Table */}
      <DataTable<Order>
        data={orders ?? []}
        columns={tableColumns}
        searchable
        searchPlaceholder="Search orders..."
        onRowClick={(row) => setSelectedOrderId(row.id)}
        pageSize={12}
        emptyState={{
          icon: ClipboardList,
          title: 'No orders found',
          description: 'Try adjusting your filters.',
          accentColor: ORDERS_ACCENT,
        }}
      />

      <OrderDrawer
        orderId={selectedOrderId}
        open={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
      />
    </div>
  );
}
