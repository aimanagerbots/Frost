'use client';

import { useState } from 'react';
import { MetricCard, DataTable, LoadingSkeleton } from '@/components';
import { useRevenueAnalytics } from '../../hooks/useRevenueAnalytics';
import { useHealthModel } from '../../hooks/useHealthModel';
import { useForecasts } from '../../hooks/useForecasts';
import { RevenueCharts } from './analytics/RevenueCharts';
import { HealthModelView } from './analytics/HealthModelView';
import { ForecastView } from './analytics/ForecastView';
import { ACCENT as CRM_ACCENT } from '@/design/colors';


type ProductRow = { rank: number; name: string; category: string; revenue: number; unitsSold: number } & Record<string, unknown>;

export function Analytics() {
  const { data: analytics, isLoading: loadingAnalytics } = useRevenueAnalytics();
  const { data: healthModel, isLoading: loadingHealth } = useHealthModel();
  const { data: forecasts, isLoading: loadingForecasts } = useForecasts();
  const [period, setPeriod] = useState('this-quarter');

  if (loadingAnalytics || loadingHealth || loadingForecasts) {
    return <LoadingSkeleton variant="card" count={4} />;
  }

  if (!analytics || !healthModel || !forecasts) return null;

  const totalRevenue = analytics.totalRevenue;
  const prevTotal = analytics.revenueByCategory.reduce((s, c) => s + c.prevRevenue, 0);
  const revChange = prevTotal > 0 ? ((totalRevenue - prevTotal) / prevTotal * 100) : 0;
  const avgOrderValue = Math.round(totalRevenue / 1200); // approx orders
  const ordersCount = 1200;

  const productRows: ProductRow[] = analytics.topProducts.map((p, i) => ({
    rank: i + 1,
    name: p.name,
    category: p.category,
    revenue: p.revenue,
    unitsSold: p.unitsSold,
  }));

  const productColumns = [
    { header: '#', accessor: 'rank' as const, sortable: true },
    {
      header: 'Product',
      accessor: 'name' as const,
      sortable: true,
      render: (row: ProductRow) => <span className="font-medium text-text-bright">{row.name}</span>,
    },
    {
      header: 'Category',
      accessor: 'category' as const,
      render: (row: ProductRow) => (
        <span className="rounded-full bg-elevated px-2 py-0.5 text-xs capitalize text-text-muted">{row.category}</span>
      ),
    },
    {
      header: 'Revenue',
      accessor: 'revenue' as const,
      sortable: true,
      render: (row: ProductRow) => <span>${Number(row.revenue).toLocaleString()}</span>,
    },
    {
      header: 'Units Sold',
      accessor: 'unitsSold' as const,
      sortable: true,
      render: (row: ProductRow) => <span>{Number(row.unitsSold).toLocaleString()}</span>,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Period selector */}
      <div className="flex gap-2">
        {[
          { value: 'this-month', label: 'This Month' },
          { value: 'this-quarter', label: 'This Quarter' },
          { value: 'this-year', label: 'This Year' },
        ].map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
              period === p.value
                ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40'
                : 'bg-elevated text-text-muted hover:text-text-default'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Revenue Metrics */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">Revenue</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <MetricCard
            label="Total Revenue"
            value={`$${(totalRevenue / 1_000_000).toFixed(2)}M`}
            accentColor={CRM_ACCENT}
          />
          <MetricCard
            label="vs Prior Period"
            value={`${revChange >= 0 ? '+' : ''}${revChange.toFixed(1)}%`}
            trend={{ value: revChange, direction: revChange >= 0 ? 'up' : 'down' }}
            accentColor={revChange >= 0 ? '#5BB8E6' : '#EF4444'}
          />
          <MetricCard
            label="Avg Order Value"
            value={`$${avgOrderValue.toLocaleString()}`}
            accentColor="#5BB8E6"
          />
          <MetricCard
            label="Orders Count"
            value={ordersCount.toLocaleString()}
            accentColor="#5BB8E6"
          />
        </div>
      </div>

      {/* Revenue Charts */}
      <RevenueCharts analytics={analytics} />

      {/* Health Model */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">Account Health</h3>
        <HealthModelView model={healthModel} />
      </div>

      {/* Forecasting */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">Forecasting</h3>
        <ForecastView forecasts={forecasts} monthlyRevenue={analytics.monthlyRevenue} />
      </div>

      {/* Top Products */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">Top Products</h3>
        <DataTable
          data={productRows}
          columns={productColumns}
          searchable
          searchPlaceholder="Search products..."
          pageSize={10}
        />
      </div>
    </div>
  );
}
