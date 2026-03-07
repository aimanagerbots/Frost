'use client';

import { useMemo } from 'react';
import { MetricCard, DataTable, StatusBadge, LoadingSkeleton } from '@/components';
import { useAccountDeliveries } from '../../../hooks';
import type { AccountDelivery } from '../../../types';

const CRM_ACCENT = '#F59E0B';

interface DeliveriesTabProps {
  accountId: string;
}

function statusVariant(status: AccountDelivery['status']) {
  switch (status) {
    case 'delivered': return 'success' as const;
    case 'in-transit': return 'info' as const;
    case 'scheduled': return 'warning' as const;
    case 'failed': return 'danger' as const;
  }
}

interface DeliveryRow extends Record<string, unknown> {
  id: string;
  date: string;
  orderNumber: string;
  status: string;
  driver: string;
  window: string;
  deliveredAt: string | null;
  items: number;
}

export function DeliveriesTab({ accountId }: DeliveriesTabProps) {
  const { data: deliveryData, isLoading } = useAccountDeliveries(accountId);

  const rows: DeliveryRow[] = useMemo(() => {
    if (!deliveryData) return [];
    return deliveryData.deliveries.map((d) => ({
      id: d.id,
      date: d.date,
      orderNumber: d.orderNumber,
      status: d.status,
      driver: d.driver,
      window: d.window,
      deliveredAt: d.deliveredAt,
      items: d.items,
    }));
  }, [deliveryData]);

  const columns = useMemo(() => [
    {
      header: 'Date',
      accessor: 'date' as const,
      sortable: true,
      render: (row: DeliveryRow) => new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    },
    {
      header: 'Order',
      accessor: 'orderNumber' as const,
      sortable: true,
      render: (row: DeliveryRow) => <span className="font-medium text-bright">{row.orderNumber}</span>,
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      sortable: true,
      render: (row: DeliveryRow) => (
        <StatusBadge variant={statusVariant(row.status as AccountDelivery['status'])} label={row.status} size="sm" />
      ),
    },
    { header: 'Driver', accessor: 'driver' as const, sortable: true },
    { header: 'Window', accessor: 'window' as const, sortable: false },
    {
      header: 'Delivered',
      accessor: 'deliveredAt' as const,
      sortable: true,
      render: (row: DeliveryRow) => row.deliveredAt
        ? new Date(row.deliveredAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        : <span className="text-muted">—</span>,
    },
    { header: 'Items', accessor: 'items' as const, sortable: true },
  ], []);

  if (isLoading || !deliveryData) return <LoadingSkeleton variant="card" count={2} />;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Preferred Window"
          value={deliveryData.preferredWindow}
          accentColor={CRM_ACCENT}
        />
        <MetricCard
          label="Avg Delivery Time"
          value={`${deliveryData.avgDeliveryMinutes}m`}
          accentColor={CRM_ACCENT}
        />
        <MetricCard
          label="On-Time Rate"
          value={`${deliveryData.onTimeRate}%`}
          accentColor={CRM_ACCENT}
        />
      </div>

      <DataTable<DeliveryRow>
        data={rows}
        columns={columns}
        pageSize={10}
      />
    </div>
  );
}
