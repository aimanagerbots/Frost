'use client';

import {
  SectionHeader,
  MetricCard,
  ChartWrapper,
  CHART_THEME,
  DataTable,
  StatusBadge,
  LoadingSkeleton,
  ErrorState,
} from '@/components';
import {
  useLaborData,
  useLaborMetrics,
  useLaborAllocation,
  useSchedulingData,
  useLaborRecommendations,
  useCostPerUnitTrends,
} from '@/modules/finance/hooks/budget-labor-hooks';
import type { TeamMemberCost, LaborAllocation } from '@/modules/finance/types/budget-labor';
import { HardHat, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { PieLabelRenderProps } from 'recharts';

const ACCENT = '#059669';

function fmt(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

const DIVISION_COLORS: Record<string, string> = {
  Cultivation: '#22C55E',
  Manufacturing: '#10B981',
  Packaging: '#84CC16',
  Fulfillment: '#14B8A6',
  Delivery: '#0EA5E9',
  Sales: '#F59E0B',
  Trimming: '#22C55E',
  Extraction: '#10B981',
  Preroll: '#F59E0B',
};

const SCHED_COLORS: Record<string, string> = {
  understaffed: '#EF4444',
  optimal: '#22C55E',
  overstaffed: '#F59E0B',
};

const PRIORITY_VARIANT = {
  high: 'danger' as const,
  medium: 'warning' as const,
  low: 'info' as const,
};

export function LaborPage() {
  const { data: team, isLoading: teamLoading, error: teamErr, refetch: teamRefetch } = useLaborData();
  const { data: metrics, isLoading: metLoading, error: metErr, refetch: metRefetch } = useLaborMetrics();
  const { data: allocation, isLoading: allocLoading, error: allocErr, refetch: allocRefetch } = useLaborAllocation();
  const { data: scheduling, isLoading: schedLoading, error: schedErr, refetch: schedRefetch } = useSchedulingData();
  const { data: recs, isLoading: recsLoading, error: recsErr, refetch: recsRefetch } = useLaborRecommendations();
  const { data: cpuTrends, isLoading: cpuLoading, error: cpuErr, refetch: cpuRefetch } = useCostPerUnitTrends();

  const isLoading = teamLoading || metLoading || allocLoading || schedLoading || recsLoading || cpuLoading;
  const error = teamErr || metErr || allocErr || schedErr || recsErr || cpuErr;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Labor & Payroll" accentColor={ACCENT} icon={HardHat} />
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="chart" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Labor & Payroll" accentColor={ACCENT} icon={HardHat} />
        <ErrorState onRetry={() => { teamRefetch(); metRefetch(); allocRefetch(); schedRefetch(); recsRefetch(); cpuRefetch(); }} />
      </div>
    );
  }

  // Headcount by division
  const divMap = new Map<string, { count: number; cost: number }>();
  team!.forEach((t) => {
    const entry = divMap.get(t.division) ?? { count: 0, cost: 0 };
    entry.count += 1;
    entry.cost += t.totalCost;
    divMap.set(t.division, entry);
  });
  const headcountData = Array.from(divMap.entries()).map(([name, v]) => ({ name, ...v }));

  // Overtime by division
  const otMap = new Map<string, number>();
  team!.forEach((t) => {
    if (t.overtimeHours > 0) otMap.set(t.division, (otMap.get(t.division) ?? 0) + t.overtimeHours);
  });
  const overtimeData = Array.from(otMap.entries()).map(([name, hours]) => ({ name, hours }));

  // Scheduling efficiency %
  const optimalDays = scheduling!.filter((s) => s.status === 'optimal').length;
  const schedEfficiency = Math.round((optimalDays / scheduling!.length) * 100);

  // Best cost/unit division
  const bestCPU = metrics!.costPerUnit.reduce((best, c) =>
    c.trend < best.trend ? c : best
  , metrics!.costPerUnit[0]);

  const teamColumns = [
    { header: 'Name', accessor: 'name' as const },
    {
      header: 'Division',
      accessor: 'division' as const,
      render: (r: TeamMemberCost) => (
        <span className="inline-flex items-center gap-1.5 text-sm">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: DIVISION_COLORS[r.division] ?? ACCENT }} />
          {r.division}
        </span>
      ),
    },
    { header: 'Role', accessor: 'role' as const, hideBelow: 'md' as const },
    { header: 'Monthly Cost', accessor: ((r: TeamMemberCost) => fmt(r.totalCost)) as (row: TeamMemberCost) => unknown, sortable: true },
    { header: 'OT Hours', accessor: 'overtimeHours' as const, hideBelow: 'md' as const },
    {
      header: 'Cost/Unit',
      accessor: ((r: TeamMemberCost) => r.costPerUnit != null ? `$${r.costPerUnit.toFixed(2)}` : '—') as (row: TeamMemberCost) => unknown,
      hideBelow: 'lg' as const,
    },
  ];

  const allocColumns = [
    { header: 'Activity', accessor: 'division' as const },
    { header: 'Hours/Week', accessor: 'hours' as const, sortable: true },
    { header: '% of Total', accessor: ((r: LaborAllocation) => `${r.percentage}%`) as (row: LaborAllocation) => unknown },
    { header: 'Cost/Hour', accessor: ((r: LaborAllocation) => `$${r.costPerHour.toFixed(2)}`) as (row: LaborAllocation) => unknown, hideBelow: 'md' as const },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="Labor & Payroll" accentColor={ACCENT} icon={HardHat} />

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <MetricCard label="Headcount" value={metrics!.totalHeadcount} accentColor={ACCENT} />
        <MetricCard label="Monthly Labor" value={fmt(metrics!.totalLaborCost)} accentColor={ACCENT} />
        <MetricCard label="Rev / Employee" value={fmt(metrics!.revenuePerEmployee)} accentColor={ACCENT} trend={{ value: 9.3, direction: 'up' }} />
        <MetricCard
          label="Overtime Hours"
          value={team!.reduce((s, t) => s + t.overtimeHours, 0)}
          accentColor={team!.reduce((s, t) => s + t.overtimeHours, 0) > 20 ? '#F59E0B' : ACCENT}
        />
        <MetricCard label={`Best: ${bestCPU.division}`} value={`${bestCPU.trend > 0 ? '+' : ''}${bestCPU.trend}%`} accentColor={ACCENT} trend={{ value: Math.abs(bestCPU.trend), direction: 'down' }} />
        <MetricCard label="Sched. Efficiency" value={`${schedEfficiency}%`} accentColor={ACCENT} />
      </div>

      {/* Headcount by Division */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartWrapper title="Headcount by Division">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={headcountData}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
              <XAxis dataKey="name" tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} />
              <YAxis tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 8, color: CHART_THEME.tooltipText }}
              />
              <Bar dataKey="count" name="Headcount" radius={[4, 4, 0, 0]}>
                {headcountData.map((d) => (
                  <Cell key={d.name} fill={DIVISION_COLORS[d.name] ?? ACCENT} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Labor Allocation Donut */}
        <ChartWrapper title="Labor Allocation" subtitle="Weekly hours by activity">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocation!}
                dataKey="hours"
                nameKey="division"
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="80%"
                paddingAngle={2}
                label={(props: PieLabelRenderProps) => {
                  const p = props as PieLabelRenderProps & { division: string; percentage: number };
                  const { x, y } = props;
                  return (
                    <text x={x} y={y} fill="#E2E8F0" fontSize={11} textAnchor="middle" dominantBaseline="central">
                      {p.division} {p.percentage}%
                    </text>
                  );
                }}
              >
                {allocation!.map((a) => (
                  <Cell key={a.division} fill={DIVISION_COLORS[a.division] ?? ACCENT} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 8, color: CHART_THEME.tooltipText }}
                formatter={(value: unknown) => `${value} hrs`}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      {/* Cost per Unit Trends */}
      <ChartWrapper title="Cost per Unit Trends" subtitle="6-month efficiency — all lines trending down = improving">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={cpuTrends!}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
            <XAxis dataKey="month" tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} />
            <YAxis tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 8, color: CHART_THEME.tooltipText }}
            />
            <Legend formatter={(value: string) => <span style={{ color: '#E2E8F0' }}>{value}</span>} />
            <Line type="monotone" dataKey="flowerPerLb" name="Flower $/lb" stroke="#22C55E" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="prerollPerUnit" name="Preroll $/unit" stroke="#F59E0B" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="vapePerUnit" name="Vape $/unit" stroke="#8B5CF6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="fulfillmentPerOrder" name="Fulfillment $/order" stroke="#14B8A6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="deliveryPerStop" name="Delivery $/stop" stroke="#0EA5E9" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Scheduling Efficiency */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-text-bright">Scheduling Efficiency</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartWrapper title="Demand vs Staffed" subtitle="Score by day of week">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scheduling!}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
                <XAxis dataKey="dayOfWeek" tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} />
                <YAxis tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 8, color: CHART_THEME.tooltipText }}
                />
                <Legend formatter={(value: string) => <span style={{ color: '#E2E8F0' }}>{value}</span>} />
                <Line type="monotone" dataKey="demand" name="Demand" stroke="#EF4444" strokeWidth={2} />
                <Line type="monotone" dataKey="staffed" name="Staffed" stroke={ACCENT} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartWrapper>

          {/* Day-by-day status cards */}
          <div className="grid grid-cols-1 gap-2">
            {scheduling!.map((s) => (
              <div
                key={s.dayOfWeek}
                className="flex items-center justify-between rounded-lg border border-default bg-card px-4 py-2"
              >
                <span className="w-24 text-sm font-medium text-text-bright">{s.dayOfWeek}</span>
                <div className="flex items-center gap-4 text-xs text-text-muted">
                  <span>Demand: {s.demand}</span>
                  <span>Staffed: {s.staffed}</span>
                  <span className={s.gap < 0 ? 'text-danger' : s.gap > 5 ? 'text-warning' : 'text-success'}>
                    Gap: {s.gap > 0 ? '+' : ''}{s.gap}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {s.status === 'understaffed' ? (
                    <AlertTriangle className="h-3.5 w-3.5 text-danger" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" style={{ color: SCHED_COLORS[s.status] }} />
                  )}
                  <StatusBadge
                    label={s.status}
                    variant={s.status === 'understaffed' ? 'danger' : s.status === 'overstaffed' ? 'warning' : 'success'}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Labor Allocation Table */}
      <DataTable<LaborAllocation & Record<string, unknown>>
        data={allocation!.map((a) => ({ ...a } as LaborAllocation & Record<string, unknown>))}
        columns={allocColumns}
        pageSize={10}
      />

      {/* Team Cost Table */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-text-bright">Team Cost Breakdown</h2>
        <DataTable<TeamMemberCost & Record<string, unknown>>
          data={team!.map((t) => ({ ...t } as TeamMemberCost & Record<string, unknown>))}
          columns={teamColumns}
          searchable
          searchPlaceholder="Search team members..."
          pageSize={10}
        />
      </div>

      {/* AI Recommendations */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5" style={{ color: ACCENT }} />
          <h2 className="text-lg font-semibold text-text-bright">AI Recommendations</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recs!.map((r) => (
            <div key={r.id} className="rounded-xl border border-default bg-card p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium text-text-bright">{r.title}</h3>
                <StatusBadge label={r.priority} variant={PRIORITY_VARIANT[r.priority]} size="sm" />
              </div>
              <p className="mb-2 text-xs leading-relaxed text-text-muted">{r.description}</p>
              <p className="text-xs font-medium" style={{ color: ACCENT }}>{r.impact}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Overtime Tracker */}
      {overtimeData.length > 0 && (
        <ChartWrapper title="Overtime Hours by Division" subtitle="This month">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={overtimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
              <XAxis dataKey="name" tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} />
              <YAxis tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 8, color: CHART_THEME.tooltipText }}
                formatter={(value: unknown) => `${value} hrs`}
              />
              <Bar dataKey="hours" name="Overtime Hours" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      )}
    </div>
  );
}
