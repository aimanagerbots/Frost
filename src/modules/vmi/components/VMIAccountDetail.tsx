'use client';

import { useState } from 'react';
import { X, AlertTriangle, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DataTable,
  StatusBadge,
  ChartWrapper,
  CHART_THEME,
  CHART_COLORS,
  LoadingSkeleton,
} from '@/components';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
} from 'recharts';
import { useVMISellThrough, useVMIMarketShare } from '../hooks';
import type { VMISellThrough } from '../types';

const ACCENT = '#EF4444';

interface VMIAccountDetailProps {
  accountId: string;
  accountName: string;
  onClose: () => void;
}

const CATEGORY_VARIANT: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'muted' | 'default'> = {
  flower: 'success',
  preroll: 'success',
  vaporizer: 'info',
  concentrate: 'warning',
  edible: 'danger',
  beverage: 'muted',
};

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-lg"
      style={{
        backgroundColor: CHART_THEME.tooltipBg,
        borderColor: CHART_THEME.tooltipBorder,
        color: CHART_THEME.tooltipText,
      }}
    >
      <p className="mb-1 font-medium">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: {entry.value}%
        </p>
      ))}
    </div>
  );
}

export function VMIAccountDetail({ accountId, accountName, onClose }: VMIAccountDetailProps) {
  const { data: sellThrough, isLoading: stLoading } = useVMISellThrough(accountId);
  const { data: marketShare, isLoading: msLoading } = useVMIMarketShare(accountId);
  const [showReorderOnly, setShowReorderOnly] = useState(false);

  if (stLoading || msLoading) return <LoadingSkeleton variant="card" count={3} />;

  const items = sellThrough ?? [];
  const shares = marketShare ?? [];
  const reorderItems = items.filter((i) => i.reorderRecommended);
  const displayItems = showReorderOnly ? reorderItems : items;

  // Days-on-hand chart data
  const dohChartData = items
    .sort((a, b) => a.daysOnHand - b.daysOnHand)
    .map((item) => ({
      name: item.productName.length > 20 ? item.productName.slice(0, 18) + '...' : item.productName,
      daysOnHand: item.daysOnHand,
      critical: item.daysOnHand < 3,
    }));

  // Market share chart data
  const msChartData = shares.map((s) => ({
    category: s.category.charAt(0).toUpperCase() + s.category.slice(1),
    'Our Share': s.ourShare,
    'Competitor Share': s.competitorShare,
  }));

  const sellThroughColumns = [
    {
      header: 'Product',
      accessor: 'productName' as keyof VMISellThrough,
      sortable: true,
    },
    {
      header: 'Category',
      accessor: 'category' as keyof VMISellThrough,
      render: (row: VMISellThrough) => (
        <StatusBadge
          label={row.category}
          variant={CATEGORY_VARIANT[row.category] ?? 'default'}
          size="sm"
        />
      ),
    },
    {
      header: 'Daily Avg',
      accessor: 'dailyAvg' as keyof VMISellThrough,
      sortable: true,
      render: (row: VMISellThrough) => <span>{row.dailyAvg.toFixed(1)}</span>,
    },
    {
      header: 'Weekly',
      accessor: 'weeklyTotal' as keyof VMISellThrough,
      sortable: true,
    },
    {
      header: 'Stock',
      accessor: 'currentStock' as keyof VMISellThrough,
      sortable: true,
    },
    {
      header: 'Days on Hand',
      accessor: 'daysOnHand' as keyof VMISellThrough,
      sortable: true,
      render: (row: VMISellThrough) => (
        <span className={cn(row.daysOnHand < 3 ? 'font-bold text-danger' : 'text-default')}>
          {row.daysOnHand.toFixed(1)}
        </span>
      ),
    },
    {
      header: 'Reorder',
      accessor: 'reorderRecommended' as keyof VMISellThrough,
      render: (row: VMISellThrough) =>
        row.reorderRecommended ? (
          <StatusBadge label={`+${row.reorderQty ?? 0}`} variant="danger" size="sm" dot pulse />
        ) : (
          <span className="text-muted">-</span>
        ),
    },
  ];

  return (
    <div className="space-y-6 rounded-xl border border-default bg-card p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${ACCENT}20` }}
          >
            <Package className="h-5 w-5" style={{ color: ACCENT }} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-bright">{accountName}</h2>
            <p className="text-xs text-muted">
              {items.length} SKUs tracked &middot; {reorderItems.length} reorder alerts
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-elevated hover:text-default"
          aria-label="Close detail"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Sell-Through Table */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-bright">Sell-Through Data</h3>
          <button
            onClick={() => setShowReorderOnly((v) => !v)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              showReorderOnly
                ? 'bg-danger/20 text-danger'
                : 'bg-elevated text-muted hover:text-default'
            )}
          >
            {showReorderOnly ? 'Showing Reorders Only' : 'Filter Reorders'}
          </button>
        </div>
        <DataTable
          data={displayItems as unknown as Record<string, unknown>[]}
          columns={sellThroughColumns as Parameters<typeof DataTable>[0]['columns']}
          searchable
          searchPlaceholder="Search SKUs..."
          pageSize={8}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Days on Hand Chart */}
        <ChartWrapper title="Days on Hand by SKU" subtitle="Red bars indicate critical stock (< 3 days)" height={320}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dohChartData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={130}
                tick={{ fill: CHART_THEME.axisColor, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div
                      className="rounded-lg border px-3 py-2 text-xs shadow-lg"
                      style={{
                        backgroundColor: CHART_THEME.tooltipBg,
                        borderColor: CHART_THEME.tooltipBorder,
                        color: CHART_THEME.tooltipText,
                      }}
                    >
                      <p className="font-medium">{label}</p>
                      <p>{payload[0].value} days</p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="daysOnHand" radius={[0, 4, 4, 0]}>
                {dohChartData.map((entry, i) => (
                  <Cell key={i} fill={entry.critical ? CHART_COLORS.danger : CHART_COLORS.success} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Market Share Chart */}
        <ChartWrapper title="Market Share by Category" subtitle="Our share vs top competitor" height={320}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={msChartData} margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
              <XAxis
                dataKey="category"
                tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ color: CHART_THEME.legendColor, fontSize: 12 }}
              />
              <Bar dataKey="Our Share" fill={ACCENT} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Competitor Share" fill={CHART_COLORS.warning} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      {/* Reorder Section */}
      {reorderItems.length > 0 && (
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-danger" />
            <h3 className="text-sm font-semibold text-danger">
              Reorder Recommendations ({reorderItems.length})
            </h3>
          </div>
          <div className="space-y-2">
            {reorderItems.map((item) => (
              <div
                key={item.sku}
                className="flex items-center justify-between rounded-lg bg-card px-3 py-2 text-sm"
              >
                <div>
                  <span className="font-medium text-bright">{item.productName}</span>
                  <span className="ml-2 text-xs text-muted">({item.sku})</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted">
                    {item.daysOnHand.toFixed(1)} days left
                  </span>
                  <span className="text-xs font-semibold text-danger">
                    +{item.reorderQty} units
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button
            className="mt-3 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: ACCENT }}
          >
            Create Proposal
          </button>
        </div>
      )}
    </div>
  );
}
