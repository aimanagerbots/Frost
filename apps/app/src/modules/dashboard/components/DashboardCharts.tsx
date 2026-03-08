'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { ChartWrapper, CHART_THEME } from '@/components';
import type { DashboardChartsData } from '@/modules/dashboard/types';

interface DashboardChartsProps {
  data: DashboardChartsData;
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Revenue Trend */}
      <ChartWrapper title="Revenue Trend" subtitle="Last 30 days" height={260}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.revenueTrend}>
            <XAxis
              dataKey="label"
              tick={{ fill: CHART_THEME.axisColor, fontSize: 10 }}
              axisLine={{ stroke: CHART_THEME.gridColor }}
              tickLine={false}
              interval={4}
            />
            <YAxis
              tick={{ fill: CHART_THEME.axisColor, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`}
            />
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
            <Line
              type="monotone"
              dataKey="value"
              stroke="#5BB8E6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#5BB8E6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Orders by Status */}
      <ChartWrapper title="Orders by Status" subtitle="Current distribution" height={260}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.ordersByStatus}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              dataKey="count"
              nameKey="status"
            >
              {data.ordersByStatus.map((entry) => (
                <Cell key={entry.status} fill={entry.color} />
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
              formatter={(value, name) => [value, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Division Workload */}
      <ChartWrapper title="Division Workload" subtitle="Active tasks by division" height={260}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.divisionWorkload}>
            <XAxis
              dataKey="division"
              tick={{ fill: CHART_THEME.axisColor, fontSize: 10 }}
              axisLine={{ stroke: CHART_THEME.gridColor }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: CHART_THEME.axisColor, fontSize: 10 }}
              axisLine={false}
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
            <Bar dataKey="tasks" radius={[4, 4, 0, 0]}>
              {data.divisionWorkload.map((entry) => (
                <Cell key={entry.division} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Top Products */}
      <ChartWrapper title="Top Products This Week" subtitle="By revenue" height={260}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.topProducts} layout="vertical">
            <XAxis
              type="number"
              tick={{ fill: CHART_THEME.axisColor, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: CHART_THEME.axisColor, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={130}
            />
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
            <Bar dataKey="revenue" radius={[0, 4, 4, 0]} fill="#5BB8E6" />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </div>
  );
}
