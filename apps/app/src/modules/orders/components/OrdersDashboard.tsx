'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { MetricCard, ChartWrapper, CHART_THEME, legendFormatter, LoadingSkeleton } from '@/components';
import { useOrderMetrics } from '../hooks/useOrderMetrics';
import { useOrderVolumeChart } from '../hooks/useOrderVolumeChart';
import { useRevenueByCategory } from '../hooks/useRevenueByCategory';
import { useTopAccounts } from '../hooks/useTopAccounts';
import { ACCENT as ORDERS_ACCENT } from '@/design/colors';


const BAR_COLORS = {
  pending: '#5BB8E6',
  confirmed: '#5BB8E6',
  inProduction: '#5BB8E6',
  fulfilled: '#5BB8E6',
  delivered: '#5BB8E6',
  paid: '#5BB8E6',
};

export function OrdersDashboard() {
  const { data: metrics, isLoading: metricsLoading } = useOrderMetrics();
  const { data: volumeData, isLoading: volumeLoading } = useOrderVolumeChart();
  const { data: categoryData, isLoading: categoryLoading } = useRevenueByCategory();
  const { data: topAccounts, isLoading: accountsLoading } = useTopAccounts();

  if (metricsLoading) {
    return <LoadingSkeleton variant="card" count={6} />;
  }

  return (
    <div className="space-y-6">
      {/* Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <MetricCard label="Total Orders" value={metrics.totalOrders} accentColor={ORDERS_ACCENT} />
          <MetricCard label="Pending" value={metrics.pendingCount} accentColor="#5BB8E6" />
          <MetricCard
            label="Avg Fulfillment"
            value={`${metrics.avgFulfillmentDays}d`}
            accentColor="#5BB8E6"
          />
          <MetricCard
            label="On-Time Rate"
            value={`${metrics.onTimeRate}%`}
            trend={{ value: 2, direction: 'up' }}
            accentColor="#5BB8E6"
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
            accentColor="#5BB8E6"
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartWrapper title="Order Volume (12 Weeks)" loading={volumeLoading}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumeData ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
              <XAxis
                dataKey="week"
                tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
                axisLine={{ stroke: CHART_THEME.gridColor }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
                axisLine={{ stroke: CHART_THEME.gridColor }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: CHART_THEME.tooltipBg,
                  border: `1px solid ${CHART_THEME.tooltipBorder}`,
                  borderRadius: 8,
                  color: CHART_THEME.tooltipText,
                  fontSize: 12,
                }}
              />
              <Legend formatter={legendFormatter} />
              <Bar dataKey="pending" name="Pending" stackId="a" fill={BAR_COLORS.pending} radius={[0, 0, 0, 0]} />
              <Bar dataKey="confirmed" name="Confirmed" stackId="a" fill={BAR_COLORS.confirmed} />
              <Bar dataKey="inProduction" name="In Production" stackId="a" fill={BAR_COLORS.inProduction} />
              <Bar dataKey="fulfilled" name="Fulfilled" stackId="a" fill={BAR_COLORS.fulfilled} />
              <Bar dataKey="delivered" name="Delivered" stackId="a" fill={BAR_COLORS.delivered} />
              <Bar dataKey="paid" name="Paid" stackId="a" fill={BAR_COLORS.paid} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <ChartWrapper title="Revenue by Category" loading={categoryLoading}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData ?? []}
                dataKey="revenue"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, payload }: { name?: string; payload?: { percentage?: number } }) =>
                  `${name ?? ''} ${payload?.percentage ?? 0}%`
                }
                labelLine={{ stroke: CHART_THEME.axisColor }}
              >
                {(categoryData ?? []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: CHART_THEME.tooltipBg,
                  border: `1px solid ${CHART_THEME.tooltipBorder}`,
                  borderRadius: 8,
                  color: CHART_THEME.tooltipText,
                  fontSize: 12,
                }}
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
              />
              <Legend formatter={legendFormatter} />
            </PieChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      {/* Top Accounts */}
      <div className="rounded-xl bg-card p-4">
        <h3 className="mb-4 text-sm font-semibold text-text-bright">Top Accounts This Week</h3>
        {accountsLoading ? (
          <LoadingSkeleton variant="table" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-default text-xs text-text-muted">
                  <th className="pb-2 font-medium">Account</th>
                  <th className="pb-2 text-right font-medium">Orders</th>
                  <th className="pb-2 text-right font-medium">Revenue</th>
                  <th className="pb-2 text-right font-medium">Avg Order</th>
                </tr>
              </thead>
              <tbody>
                {(topAccounts ?? []).map((account) => (
                  <tr
                    key={account.accountId}
                    className="border-b border-default last:border-0"
                  >
                    <td className="py-2.5 font-medium text-text-bright">
                      {account.accountName}
                    </td>
                    <td className="py-2.5 text-right text-text-muted">
                      {account.orderCount}
                    </td>
                    <td className="py-2.5 text-right text-text-default">
                      ${account.totalRevenue.toLocaleString()}
                    </td>
                    <td className="py-2.5 text-right text-text-muted">
                      ${account.avgOrderValue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
