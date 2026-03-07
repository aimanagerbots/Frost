'use client';

import { ChartWrapper, CHART_COLORS, CHART_THEME } from '@/components';
import { ReorderCadenceHistogram } from './charts/ReorderCadenceHistogram';
import { CategoryCoverageHeatMap } from './charts/CategoryCoverageHeatMap';
import { RevenueConcentrationDonut } from './charts/RevenueConcentrationDonut';
import { PaymentComplianceTrafficLight } from './charts/PaymentComplianceTrafficLight';
import {
  getReorderCadenceData,
  getCategoryCoverageData,
  getRevenueConcentrationData,
  getPaymentComplianceData,
} from '@/mocks/crm-kpi-charts';
import type {
  RevenueByCategoryWeek,
  HealthDistribution,
  OrderVolume,
  TopAccount,
  PipelineDistribution,
  RecoveryFunnel,
} from '@/modules/crm/types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  FunnelChart,
  Funnel,
  LabelList,
} from 'recharts';

interface ChartsSectionProps {
  revenueByCategoryWeeks: RevenueByCategoryWeek[];
  healthDistribution: HealthDistribution[];
  orderVolume: OrderVolume[];
  topAccounts: TopAccount[];
  pipelineDistribution?: PipelineDistribution[];
  recoveryFunnel?: RecoveryFunnel[];
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
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
      {label && <p className="mb-1 font-medium">{label}</p>}
      {payload.map((entry) => (
        <p key={entry.name} className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name}: {typeof entry.value === 'number' ? entry.value : ''}
        </p>
      ))}
    </div>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  flower: CHART_COLORS.flower,
  preroll: CHART_COLORS.preroll,
  vaporizer: CHART_COLORS.vaporizer,
  concentrate: CHART_COLORS.concentrate,
  edible: CHART_COLORS.edible,
  beverage: CHART_COLORS.beverage,
};

const PIPELINE_COLORS = {
  active: '#22C55E',
  inactive: '#EF4444',
  recovery: '#F59E0B',
};

const FUNNEL_COLORS = ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A', '#22C55E'];

const legendFormatter = (value: string) => (
  <span style={{ color: CHART_THEME.legendColor }}>{value}</span>
);

export function ChartsSection({
  revenueByCategoryWeeks,
  healthDistribution,
  orderVolume,
  topAccounts,
  pipelineDistribution,
  recoveryFunnel,
}: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Pipeline Distribution */}
      {pipelineDistribution && pipelineDistribution.length > 0 && (
        <ChartWrapper
          title="Pipeline Distribution"
          subtitle="Accounts by status and phase"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pipelineDistribution}>
              <CartesianGrid
                stroke={CHART_THEME.gridColor}
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="phaseLabel"
                tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
                axisLine={{ stroke: CHART_THEME.gridColor }}
                tickLine={{ stroke: CHART_THEME.gridColor }}
              />
              <YAxis
                tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
                axisLine={{ stroke: CHART_THEME.gridColor }}
                tickLine={{ stroke: CHART_THEME.gridColor }}
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 11 }}
                formatter={legendFormatter}
              />
              <Bar
                dataKey="active"
                stackId="pipeline"
                fill={PIPELINE_COLORS.active}
                name="Active"
              />
              <Bar
                dataKey="inactive"
                stackId="pipeline"
                fill={PIPELINE_COLORS.inactive}
                name="Inactive"
              />
              <Bar
                dataKey="recovery"
                stackId="pipeline"
                fill={PIPELINE_COLORS.recovery}
                name="Recovery"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      )}

      {/* Revenue by Category */}
      <ChartWrapper title="Revenue by Category" subtitle="Last 12 weeks">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenueByCategoryWeeks}>
            <CartesianGrid
              stroke={CHART_THEME.gridColor}
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="week"
              tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
              tickFormatter={(v: string) => v.slice(5)}
              axisLine={{ stroke: CHART_THEME.gridColor }}
              tickLine={{ stroke: CHART_THEME.gridColor }}
            />
            <YAxis
              tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`}
              axisLine={{ stroke: CHART_THEME.gridColor }}
              tickLine={{ stroke: CHART_THEME.gridColor }}
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
                    {label && <p className="mb-1 font-medium">{label}</p>}
                    {payload.map((entry) => (
                      <p key={entry.name} className="flex items-center gap-2">
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: entry.color as string }}
                        />
                        {entry.name}: $
                        {(
                          (typeof entry.value === 'number' ? entry.value : 0) /
                          1000
                        ).toFixed(1)}
                        K
                      </p>
                    ))}
                  </div>
                );
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11 }}
              formatter={legendFormatter}
            />
            {Object.entries(CATEGORY_COLORS).map(([key, color]) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="revenue"
                fill={color}
                name={key.charAt(0).toUpperCase() + key.slice(1)}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Account Health Distribution */}
      <ChartWrapper title="Account Health" subtitle="Distribution by tier">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={healthDistribution}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={3}
              dataKey="value"
              nameKey="name"
              stroke="none"
              label={({
                name,
                percent,
                x,
                y,
              }: {
                name?: string;
                percent?: number;
                x?: number;
                y?: number;
              }) => (
                <text
                  x={x}
                  y={y}
                  fill={CHART_THEME.legendColor}
                  fontSize={11}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {name ?? ''} {((percent ?? 0) * 100).toFixed(0)}%
                </text>
              )}
              labelLine={{ stroke: CHART_THEME.axisColor }}
            >
              {healthDistribution.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as HealthDistribution;
                return (
                  <div
                    className="rounded-lg border px-3 py-2 text-xs shadow-lg"
                    style={{
                      backgroundColor: CHART_THEME.tooltipBg,
                      borderColor: CHART_THEME.tooltipBorder,
                      color: CHART_THEME.tooltipText,
                    }}
                  >
                    <p className="flex items-center gap-2">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: d.color }}
                      />
                      {d.name}: {d.value} accounts
                    </p>
                  </div>
                );
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11 }}
              formatter={legendFormatter}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Recovery Funnel */}
      {recoveryFunnel && recoveryFunnel.length > 0 && (
        <ChartWrapper
          title="Recovery Funnel"
          subtitle="R1 → R5 conversion rates"
        >
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload as RecoveryFunnel;
                  return (
                    <div
                      className="rounded-lg border px-3 py-2 text-xs shadow-lg"
                      style={{
                        backgroundColor: CHART_THEME.tooltipBg,
                        borderColor: CHART_THEME.tooltipBorder,
                        color: CHART_THEME.tooltipText,
                      }}
                    >
                      <p className="font-medium">{d.phase}</p>
                      <p>
                        {d.count} accounts ({d.conversionRate}% conversion)
                      </p>
                    </div>
                  );
                }}
              />
              <Funnel dataKey="count" data={recoveryFunnel} isAnimationActive>
                {recoveryFunnel.map((_, i) => (
                  <Cell
                    key={`cell-${i}`}
                    fill={FUNNEL_COLORS[i % FUNNEL_COLORS.length]}
                  />
                ))}
                <LabelList
                  dataKey="phase"
                  position="right"
                  fill={CHART_THEME.legendColor}
                  fontSize={11}
                />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </ChartWrapper>
      )}

      {/* Order Volume Trend */}
      <ChartWrapper
        title="Order Volume"
        subtitle="Last 30 days with 7-day moving avg"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={orderVolume}>
            <CartesianGrid
              stroke={CHART_THEME.gridColor}
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="date"
              tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
              tickFormatter={(v: string) => v.slice(5)}
              axisLine={{ stroke: CHART_THEME.gridColor }}
              tickLine={{ stroke: CHART_THEME.gridColor }}
            />
            <YAxis
              tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
              axisLine={{ stroke: CHART_THEME.gridColor }}
              tickLine={{ stroke: CHART_THEME.gridColor }}
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
                    <p className="mb-1 font-medium">{label}</p>
                    {payload.map((entry) => (
                      <p key={entry.name}>
                        {entry.name}:{' '}
                        {typeof entry.value === 'number' ? entry.value : ''}
                      </p>
                    ))}
                  </div>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke={CHART_COLORS.primary}
              strokeWidth={2}
              dot={{ r: 2, fill: CHART_COLORS.primary }}
              name="Orders"
            />
            <Line
              type="monotone"
              dataKey="movingAvg"
              stroke={CHART_COLORS.warning}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="7-Day Avg"
            />
            <Legend
              wrapperStyle={{ fontSize: 11 }}
              formatter={legendFormatter}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Top 10 Accounts */}
      <ChartWrapper title="Top 10 Accounts" subtitle="By total revenue">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topAccounts}
            layout="vertical"
            margin={{ left: 20 }}
          >
            <CartesianGrid
              stroke={CHART_THEME.gridColor}
              strokeDasharray="3 3"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`}
              axisLine={{ stroke: CHART_THEME.gridColor }}
              tickLine={{ stroke: CHART_THEME.gridColor }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
              width={120}
              axisLine={{ stroke: CHART_THEME.gridColor }}
              tickLine={{ stroke: CHART_THEME.gridColor }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as TopAccount;
                return (
                  <div
                    className="rounded-lg border px-3 py-2 text-xs shadow-lg"
                    style={{
                      backgroundColor: CHART_THEME.tooltipBg,
                      borderColor: CHART_THEME.tooltipBorder,
                      color: CHART_THEME.tooltipText,
                    }}
                  >
                    <p className="font-medium">{d.name}</p>
                    <p>${d.revenue.toLocaleString()}</p>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="revenue"
              fill={CHART_COLORS.amber}
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Reorder Cadence Histogram */}
      <ReorderCadenceHistogram data={getReorderCadenceData()} />

      {/* Revenue Concentration Donut */}
      <RevenueConcentrationDonut data={getRevenueConcentrationData()} />

      {/* Payment Compliance Traffic Light */}
      <PaymentComplianceTrafficLight data={getPaymentComplianceData()} />

      {/* Category Coverage Heat Map — full width */}
      <div className="md:col-span-2">
        <CategoryCoverageHeatMap data={getCategoryCoverageData()} />
      </div>
    </div>
  );
}
