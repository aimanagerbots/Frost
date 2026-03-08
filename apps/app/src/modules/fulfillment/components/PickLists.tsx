'use client';

import { useState, useMemo } from 'react';
import { Package } from 'lucide-react';
import { DataTable, StatusBadge, ErrorState } from '@/components';
import { useFulfillmentOrders } from '../hooks';
import { FulfillmentDrawer } from './FulfillmentDrawer';
import type { FulfillmentStatus, FulfillmentOrder } from '../types';
import { ACCENT } from '@/design/colors';


const STATUS_PIPELINE: { key: FulfillmentStatus; label: string }[] = [
  { key: 'queued', label: 'Queued' },
  { key: 'picking', label: 'Picking' },
  { key: 'picked', label: 'Picked' },
  { key: 'packing', label: 'Packing' },
  { key: 'packed', label: 'Packed' },
  { key: 'manifested', label: 'Manifested' },
  { key: 'ready-for-driver', label: 'Ready' },
];

const statusVariant = (s: FulfillmentStatus) => {
  const map: Record<FulfillmentStatus, 'default' | 'info' | 'success' | 'warning' | 'muted'> = {
    queued: 'muted',
    picking: 'info',
    picked: 'default',
    packing: 'warning',
    packed: 'default',
    manifested: 'success',
    'ready-for-driver': 'success',
  };
  return map[s];
};

const priorityVariant = (p: string) => {
  const map: Record<string, 'danger' | 'warning' | 'default' | 'muted'> = {
    urgent: 'danger',
    high: 'warning',
    normal: 'default',
    low: 'muted',
  };
  return map[p] ?? 'default';
};

export function PickLists() {
  const [selectedStatus, setSelectedStatus] = useState<FulfillmentStatus | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useFulfillmentOrders(selectedStatus ? { status: selectedStatus } : undefined);

  const {
    data: allOrders,
    error: allOrdersError,
    refetch: refetchAllOrders,
  } = useFulfillmentOrders();

  const pipelineCounts = useMemo(() => {
    if (!allOrders) return new Map<FulfillmentStatus, number>();
    const counts = new Map<FulfillmentStatus, number>();
    for (const o of allOrders) {
      counts.set(o.status, (counts.get(o.status) || 0) + 1);
    }
    return counts;
  }, [allOrders]);

  const selectedOrder = useMemo(
    () => orders?.find((o) => o.id === selectedOrderId) ?? null,
    [orders, selectedOrderId]
  );

  if (ordersError || allOrdersError) {
    return (
      <ErrorState
        title="Failed to load pick lists"
        message={(ordersError || allOrdersError)?.message}
        onRetry={() => { refetchOrders(); refetchAllOrders(); }}
      />
    );
  }

  const columns = [
    {
      header: 'Order #',
      accessor: 'orderNumber' as const,
      sortable: true,
    },
    {
      header: 'Account',
      accessor: 'accountName' as const,
      sortable: true,
    },
    {
      header: 'Items',
      accessor: 'id' as const,
      render: (row: FulfillmentOrder) => (
        <span className="text-text-muted">{row.items.length} items</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      sortable: true,
      render: (row: FulfillmentOrder) => (
        <StatusBadge label={row.status.replace(/-/g, ' ')} variant={statusVariant(row.status)} size="sm" />
      ),
    },
    {
      header: 'Priority',
      accessor: 'priority' as const,
      sortable: true,
      render: (row: FulfillmentOrder) => (
        <StatusBadge label={row.priority} variant={priorityVariant(row.priority)} size="sm" />
      ),
    },
    {
      header: 'Assignee',
      accessor: 'assignee' as const,
      sortable: true,
    },
    {
      header: 'Est. Time',
      accessor: 'estimatedMinutes' as const,
      render: (row: FulfillmentOrder) => (
        <span className="text-text-muted">{row.estimatedMinutes}m</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Status Pipeline */}
      <div className="rounded-xl border border-default bg-card p-4">
        <h3 className="text-sm font-medium text-text-muted mb-3">Fulfillment Pipeline</h3>
        <div className="flex items-center gap-1 overflow-x-auto">
          {STATUS_PIPELINE.map((stage, i) => {
            const count = pipelineCounts.get(stage.key) || 0;
            const isActive = selectedStatus === stage.key;
            return (
              <button
                key={stage.key}
                onClick={() => setSelectedStatus(isActive ? null : stage.key)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors whitespace-nowrap"
                style={{
                  backgroundColor: isActive ? `${ACCENT}20` : undefined,
                  borderColor: isActive ? ACCENT : 'transparent',
                  borderWidth: 1,
                  color: isActive ? ACCENT : undefined,
                }}
              >
                <span className={isActive ? 'font-semibold' : 'text-text-muted'}>{stage.label}</span>
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: isActive ? `${ACCENT}30` : 'var(--bg-elevated)',
                    color: isActive ? ACCENT : 'var(--text-text-muted)',
                  }}
                >
                  {count}
                </span>
                {i < STATUS_PIPELINE.length - 1 && (
                  <span className="text-text-muted ml-1">&rarr;</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <DataTable
        data={orders ?? []}
        columns={columns}
        searchable
        searchPlaceholder="Search orders, accounts, assignees..."
        onRowClick={(row) => setSelectedOrderId(row.id)}
        loading={ordersLoading}
        emptyState={{
          icon: Package,
          title: 'No orders found',
          description: selectedStatus
            ? `No orders with status "${selectedStatus}"`
            : 'No fulfillment orders to display',
          accentColor: ACCENT,
        }}
      />

      {/* Drawer */}
      <FulfillmentDrawer
        order={selectedOrder}
        open={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
      />
    </div>
  );
}
