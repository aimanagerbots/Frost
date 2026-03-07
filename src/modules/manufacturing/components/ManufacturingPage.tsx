'use client';

import { useState, useMemo } from 'react';
import { Factory } from 'lucide-react';
import { SectionHeader, MetricCard, DataTable, StatusBadge, LoadingSkeleton } from '@/components';
import { useWorkOrders, useManufacturingMetrics } from '../hooks';
import { ProductionLines } from './ProductionLines';
import { ManufacturingPipeline } from './ManufacturingPipeline';
import { WorkOrderDrawer } from './WorkOrderDrawer';
import type { WorkOrder } from '../types';

const ACCENT = '#10B981';

const STATUS_MAP: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  queued: 'default',
  'in-progress': 'info',
  completed: 'success',
  blocked: 'danger',
};

const PRIORITY_MAP: Record<string, 'danger' | 'warning' | 'info' | 'muted'> = {
  critical: 'danger',
  high: 'warning',
  medium: 'info',
  low: 'muted',
};

const TYPE_COLORS: Record<string, string> = {
  flower: '#22C55E',
  preroll: '#84CC16',
  vaporizer: '#06B6D4',
  concentrate: '#F59E0B',
  edible: '#EC4899',
  beverage: '#8B5CF6',
};

type WORow = WorkOrder & Record<string, unknown>;

const columns = [
  {
    header: 'Title',
    accessor: 'title' as const,
    sortable: true,
    render: (row: WORow) => <span className="font-medium text-bright">{row.title}</span>,
  },
  {
    header: 'Type',
    accessor: 'type' as const,
    sortable: true,
    render: (row: WORow) => (
      <span
        className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
        style={{ backgroundColor: `${TYPE_COLORS[row.type] ?? '#666'}20`, color: TYPE_COLORS[row.type] ?? '#666' }}
      >
        {row.type}
      </span>
    ),
  },
  {
    header: 'Status',
    accessor: 'status' as const,
    sortable: true,
    render: (row: WORow) => (
      <StatusBadge variant={STATUS_MAP[row.status] ?? 'default'} label={row.status} size="sm" dot pulse={row.status === 'in-progress'} />
    ),
  },
  {
    header: 'Priority',
    accessor: 'priority' as const,
    sortable: true,
    render: (row: WORow) => (
      <StatusBadge variant={PRIORITY_MAP[row.priority] ?? 'muted'} label={row.priority} size="sm" />
    ),
  },
  {
    header: 'Assignee',
    accessor: 'assignee' as const,
    sortable: true,
  },
  {
    header: 'Batch #',
    accessor: 'batchNumber' as const,
    sortable: true,
  },
  {
    header: 'Est. Time',
    accessor: 'estimatedMinutes' as const,
    sortable: true,
    render: (row: WORow) => <span>{row.estimatedMinutes} min</span>,
  },
  {
    header: 'Actual',
    accessor: ((row: WORow) => row.actualMinutes ?? '') as (row: WORow) => unknown,
    sortable: true,
    render: (row: WORow) => (
      <span>{row.actualMinutes ? `${row.actualMinutes} min` : '—'}</span>
    ),
  },
];

export function ManufacturingPage() {
  const { data: workOrders, isLoading: woLoading } = useWorkOrders();
  const { data: metrics, isLoading: metricsLoading } = useManufacturingMetrics();
  const [selectedWO, setSelectedWO] = useState<WorkOrder | null>(null);
  const [pipelineFilter, setPipelineFilter] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    if (!workOrders) return [];
    if (!pipelineFilter) return workOrders;
    return workOrders.filter(
      (wo) => wo.readinessStateFrom === pipelineFilter || wo.readinessStateTo === pipelineFilter
    );
  }, [workOrders, pipelineFilter]);

  if (metricsLoading) return <LoadingSkeleton variant="card" count={3} />;

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Factory}
        title="Manufacturing"
        subtitle="Production pipelines, work orders, and processing operations"
        accentColor={ACCENT}
        stats={metrics ? [
          { label: 'Active Lines', value: 5 },
          { label: 'Capacity', value: `${metrics.capacityUtilization}%` },
        ] : undefined}
      />

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <MetricCard label="Total Work Orders" value={metrics.totalWorkOrders} accentColor={ACCENT} />
          <MetricCard label="Completed Today" value={metrics.completedToday} accentColor={ACCENT} />
          <MetricCard label="In Progress" value={metrics.inProgress} accentColor={ACCENT} />
          <MetricCard label="Avg Completion" value={`${metrics.avgCompletionTime}m`} accentColor={ACCENT} />
          <MetricCard label="Capacity Utilization" value={`${metrics.capacityUtilization}%`} accentColor={ACCENT} />
          <MetricCard
            label="Bottleneck"
            value={metrics.bottleneckState}
            accentColor="#FB7185"
          />
        </div>
      )}

      {/* Production Lines */}
      <ProductionLines />

      {/* Pipeline Visualization */}
      <ManufacturingPipeline
        onStateClick={(state) => setPipelineFilter(prev => prev === state ? null : state)}
      />

      {/* Work Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-bright">
            Daily Work Queue
            {pipelineFilter && (
              <span className="ml-2 text-xs text-muted">
                Filtered by: {pipelineFilter}
                <button
                  onClick={() => setPipelineFilter(null)}
                  className="ml-1 text-danger hover:underline"
                >
                  Clear
                </button>
              </span>
            )}
          </h2>
        </div>
        <DataTable<WORow>
          data={filteredOrders as WORow[]}
          columns={columns}
          searchable
          searchPlaceholder="Search work orders..."
          loading={woLoading}
          onRowClick={(row) => setSelectedWO(row as WorkOrder)}
          pageSize={10}
          emptyState={{
            icon: Factory,
            title: 'No work orders',
            description: pipelineFilter ? 'No work orders match the selected pipeline state.' : 'No work orders found.',
            accentColor: ACCENT,
          }}
        />
      </div>

      {/* Work Order Drawer */}
      <WorkOrderDrawer
        workOrder={selectedWO}
        open={!!selectedWO}
        onClose={() => setSelectedWO(null)}
      />
    </div>
  );
}
