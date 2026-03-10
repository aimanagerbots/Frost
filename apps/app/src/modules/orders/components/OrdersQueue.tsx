'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ClipboardList } from 'lucide-react';
import { DataTable, StatusBadge, LoadingSkeleton, ErrorState } from '@/components';
import { useOrders } from '../hooks/useOrders';
import { useOrderPipeline } from '../hooks/useOrderPipeline';
import { OrderPipeline } from './OrderPipeline';
import { OrderDrawer } from './OrderDrawer';
import type { Order, OrderFilter, OrderStatus } from '@/modules/orders/types';
import { ACCENT as ORDERS_ACCENT } from '@/design/colors';

import type { DomainStatus } from '@/components/StatusBadge';

const ORDER_STATUS_TO_DOMAIN: Record<OrderStatus, DomainStatus> = {
  pending: 'pending',
  confirmed: 'confirmed',
  'in-production': 'in-production',
  packaged: 'packaged',
  fulfilled: 'fulfilled',
  shipped: 'shipped',
  delivered: 'delivered',
  paid: 'paid',
};

const selectClass =
  'rounded-lg border border-default bg-elevated px-2.5 py-1.5 text-xs text-text-default outline-none focus:border-hover';


export function OrdersQueue() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountParam = searchParams.get('account');
  const [filters, setFilters] = useState<OrderFilter>(accountParam ? { accountId: accountParam } : {});
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { data: orders, isLoading: ordersLoading, error: ordersError, refetch: refetchOrders } = useOrders(filters);
  const { data: pipeline, isLoading: pipelineLoading, error: pipelineError, refetch: refetchPipeline } = useOrderPipeline();

  const isLoading = ordersLoading || pipelineLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="card" count={3} />
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  const error = ordersError || pipelineError;
  if (error) {
    return (
      <ErrorState
        title="Failed to load orders"
        message={error.message}
        onRetry={() => { refetchOrders(); refetchPipeline(); }}
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
      render: (row: Order) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/crm?account=${row.accountId}`);
          }}
          className="text-sm text-[#5BB8E6] hover:underline"
        >
          {row.accountName}
        </button>
      ),
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
          status={ORDER_STATUS_TO_DOMAIN[row.status]}
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
          status={row.paymentStatus === 'received' ? 'paid' : row.paymentStatus as DomainStatus}
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
    <div className="space-y-6">
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
