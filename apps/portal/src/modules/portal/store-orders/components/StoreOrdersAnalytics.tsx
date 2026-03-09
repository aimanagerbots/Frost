'use client';

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { cn } from '@/lib/utils';
import type { StoreOrderStats } from '@/modules/portal/shared/types';

interface StoreOrdersAnalyticsProps {
  stats: StoreOrderStats | null;
  className?: string;
}

const PIE_COLORS = [
  '#5BB8E6', // frost blue
  '#6B46C1', // purple (dutchie)
  '#059669', // green (jane)
  '#22C55E', // weedmaps
  '#F59E0B', // treez
  '#10B981', // leafly
  '#6B7280', // gray (walk-in)
  '#3B82F6', // blue
];

const MOCK_PREP_TREND = [
  { day: 'Mon', avgMinutes: 11 },
  { day: 'Tue', avgMinutes: 9 },
  { day: 'Wed', avgMinutes: 13 },
  { day: 'Thu', avgMinutes: 8 },
  { day: 'Fri', avgMinutes: 10 },
  { day: 'Sat', avgMinutes: 14 },
  { day: 'Sun', avgMinutes: 12 },
];

function formatHour(hour: number): string {
  if (hour === 0) return '12a';
  if (hour < 12) return `${hour}a`;
  if (hour === 12) return '12p';
  return `${hour - 12}p`;
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border-default bg-card p-4">
      <h4 className="text-xs font-semibold text-text-bright mb-3">{title}</h4>
      {children}
    </div>
  );
}

const CustomTooltipContent = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border-default bg-elevated px-3 py-2 shadow-lg">
      {label && <p className="text-xs text-text-muted mb-1">{label}</p>}
      {payload.map((entry, idx) => (
        <p key={idx} className="text-xs font-medium text-text-bright">
          {entry.value}
        </p>
      ))}
    </div>
  );
};

export function StoreOrdersAnalytics({
  stats,
  className,
}: StoreOrdersAnalyticsProps) {
  if (!stats) {
    return (
      <div className={cn('text-center text-sm text-text-muted py-12', className)}>
        No analytics data available
      </div>
    );
  }

  const sourceData = stats.ordersBySource.map((s) => ({
    name: s.source.replace('-', ' '),
    value: s.count,
  }));

  const hourData = stats.ordersByHour.map((h) => ({
    hour: formatHour(h.hour),
    count: h.count,
  }));

  const productData = stats.popularProducts.slice(0, 6).map((p) => ({
    name: p.productName.length > 18
      ? p.productName.slice(0, 18) + '...'
      : p.productName,
    count: p.orderCount,
  }));

  return (
    <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-2', className)}>
      {/* Source Distribution */}
      <ChartCard title="Source Distribution">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sourceData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {sourceData.map((_, idx) => (
                  <Cell
                    key={idx}
                    fill={PIE_COLORS[idx % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0];
                  return (
                    <div className="rounded-lg border border-border-default bg-elevated px-3 py-2 shadow-lg">
                      <p className="text-xs text-text-muted">{data.name}</p>
                      <p className="text-xs font-medium text-text-bright">{data.value} orders</p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
          {sourceData.map((entry, idx) => (
            <div key={entry.name} className="flex items-center gap-1.5">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
              />
              <span className="text-xs text-text-muted capitalize">{entry.name}</span>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Orders by Hour */}
      <ChartCard title="Orders by Hour">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
                vertical={false}
              />
              <XAxis
                dataKey="hour"
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={24}
              />
              <Tooltip content={<CustomTooltipContent />} />
              <Bar
                dataKey="count"
                fill="#5BB8E6"
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Prep Time Trend */}
      <ChartCard title="Avg Prep Time (7-Day)">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_PREP_TREND}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={24}
                unit="m"
              />
              <Tooltip content={<CustomTooltipContent />} />
              <Line
                type="monotone"
                dataKey="avgMinutes"
                stroke="#5BB8E6"
                strokeWidth={2}
                dot={{ fill: '#5BB8E6', r: 3 }}
                activeDot={{ fill: '#5BB8E6', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Popular Products */}
      <ChartCard title="Popular Products">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productData} layout="vertical">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={100}
              />
              <Tooltip content={<CustomTooltipContent />} />
              <Bar
                dataKey="count"
                fill="#4A8DB8"
                radius={[0, 4, 4, 0]}
                maxBarSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}
