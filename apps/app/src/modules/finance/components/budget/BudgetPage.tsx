'use client';

import { useState } from 'react';
import {
  SectionHeader,
  MetricCard,
  ChartWrapper,
  CHART_THEME,
  CHART_COLORS,
  DataTable,
  StatusBadge,
  LoadingSkeleton,
  ErrorState,
} from '@/components';
import {
  useBudgetByDivision,
  useBudgetScenarios,
  useCapexItems,
} from '@/modules/finance/hooks/budget-labor-hooks';
import type { BudgetScenario, CapexItem } from '@/modules/finance/types/budget-labor';
import { ScenarioDrawer } from './ScenarioDrawer';
import { Calculator, ChevronDown, ChevronRight, Lightbulb } from 'lucide-react';
import { ACCENT } from '@/design/colors';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';


function fmt(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

function fmtPct(n: number): string {
  return `${n > 0 ? '+' : ''}${n.toFixed(1)}%`;
}

const STATUS_VARIANT = {
  under: 'success' as const,
  'on-track': 'warning' as const,
  over: 'danger' as const,
};

const CAPEX_STATUS_VARIANT = {
  planned: 'muted' as const,
  approved: 'info' as const,
  purchased: 'warning' as const,
  installed: 'success' as const,
};

export function BudgetPage() {
  const { data: divisions, isLoading: divLoading, error: divErr, refetch: divRefetch } = useBudgetByDivision();
  const { data: scenarios, isLoading: scenLoading, error: scenErr, refetch: scenRefetch } = useBudgetScenarios();
  const { data: capex, isLoading: capexLoading, error: capexErr, refetch: capexRefetch } = useCapexItems();

  const [expandedDiv, setExpandedDiv] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<BudgetScenario | null>(null);

  const isLoading = divLoading || scenLoading || capexLoading;
  const error = divErr || scenErr || capexErr;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Budget & Planning" accentColor={ACCENT} icon={Calculator} />
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="chart" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Budget & Planning" accentColor={ACCENT} icon={Calculator} />
        <ErrorState onRetry={() => { divRefetch(); scenRefetch(); capexRefetch(); }} />
      </div>
    );
  }

  const totalBudget = divisions!.reduce((s, d) => s + d.budget, 0);
  const totalActual = divisions!.reduce((s, d) => s + d.actual, 0);
  const totalVariance = totalActual - totalBudget;
  const overCount = divisions!.filter((d) => d.status === 'over').length;
  const capexYTD = capex!.filter((c) => c.status === 'purchased' || c.status === 'installed').reduce((s, c) => s + c.amount, 0);

  const chartData = divisions!.map((d) => ({ name: d.name, Budget: d.budget, Actual: d.actual }));

  const capexColumns = [
    { header: 'Description', accessor: 'description' as const },
    { header: 'Amount', accessor: ((r: CapexItem) => fmt(r.amount)) as (row: CapexItem) => unknown, sortable: true },
    {
      header: 'Status',
      accessor: 'status' as const,
      render: (r: CapexItem) => (
        <StatusBadge label={r.status} variant={CAPEX_STATUS_VARIANT[r.status]} size="sm" dot />
      ),
    },
    { header: 'Division', accessor: 'division' as const, hideBelow: 'md' as const },
    { header: 'Purchase Date', accessor: ((r: CapexItem) => r.purchaseDate ?? '—') as (row: CapexItem) => unknown, hideBelow: 'md' as const },
    { header: 'Useful Life', accessor: ((r: CapexItem) => `${r.usefulLife} yr`) as (row: CapexItem) => unknown, hideBelow: 'lg' as const },
    { header: 'ROI', accessor: ((r: CapexItem) => r.roi != null ? `${r.roi}%/yr` : '—') as (row: CapexItem) => unknown, hideBelow: 'lg' as const },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="Budget & Planning" accentColor={ACCENT} icon={Calculator} />

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label="Total Budget" value={fmt(totalBudget)} accentColor={ACCENT} />
        <MetricCard label="Total Actual" value={fmt(totalActual)} accentColor={ACCENT} />
        <MetricCard
          label="Overall Variance"
          value={fmt(totalVariance)}
          accentColor={ACCENT}
          trend={{ value: Math.abs((totalVariance / totalBudget) * 100), direction: totalVariance > 0 ? 'up' : 'down' }}
        />
        <MetricCard
          label="Over Budget"
          value={`${overCount} divisions`}
          accentColor={overCount > 0 ? '#EF4444' : ACCENT}
        />
        <MetricCard label="CapEx YTD" value={fmt(capexYTD)} accentColor={ACCENT} />
      </div>

      {/* Budget vs Actual Cards */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-text-bright">Budget vs Actual by Division</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {divisions!.map((d) => {
            const expanded = expandedDiv === d.id;
            const pct = (d.actual / d.budget) * 100;
            const barColor = d.status === 'over' ? '#EF4444' : d.status === 'on-track' ? '#22C55E' : '#FBBF24';
            return (
              <div
                key={d.id}
                className="cursor-pointer rounded-xl border border-default bg-card p-4 transition-colors hover:border-white/10"
                onClick={() => setExpandedDiv(expanded ? null : d.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {expanded ? (
                      <ChevronDown className="h-4 w-4 text-text-muted" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-text-muted" />
                    )}
                    <span className="font-medium text-text-bright">{d.name}</span>
                  </div>
                  <StatusBadge label={d.status} variant={STATUS_VARIANT[d.status]} size="sm" dot />
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-elevated">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: barColor }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-text-muted">
                  <span>{fmt(d.actual)} / {fmt(d.budget)}</span>
                  <span className={d.variance > 0 ? 'text-danger' : 'text-success'}>
                    {d.variance > 0 ? '+' : ''}{fmt(d.variance)} ({fmtPct(d.variancePct)})
                  </span>
                </div>

                {/* Expanded Line Items */}
                {expanded && (
                  <div className="mt-3 space-y-1 border-t border-default pt-3">
                    {d.lineItems.map((li, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-text-muted">
                          <span className="mr-1.5 inline-block w-16 rounded bg-elevated px-1.5 py-0.5 text-center text-[10px] uppercase">
                            {li.category}
                          </span>
                          {li.subcategory}
                        </span>
                        <span className={li.variance > 0 ? 'text-danger' : 'text-success'}>
                          {li.variance > 0 ? '+' : ''}{fmt(li.variance)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Budget vs Actual Chart */}
      <ChartWrapper title="Budget vs Actual — All Divisions" subtitle="Monthly comparison">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
            <XAxis dataKey="name" tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} angle={-35} textAnchor="end" height={60} />
            <YAxis tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} tickFormatter={(v: number) => fmt(v)} />
            <Tooltip
              contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 8, color: CHART_THEME.tooltipText }}
              formatter={(v: unknown) => fmt(Number(v))}
            />
            <Legend formatter={(value: string) => <span style={{ color: '#E2E8F0' }}>{value}</span>} />
            <Bar dataKey="Budget" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Actual" fill={ACCENT} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Scenario Planning */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-text-bright">Scenario Planning</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {scenarios!.map((s) => (
            <div
              key={s.id}
              className="cursor-pointer rounded-xl border border-default bg-card p-4 transition-colors hover:border-white/10"
              onClick={() => setSelectedScenario(s)}
            >
              <div className="mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" style={{ color: ACCENT }} />
                <h3 className="font-medium text-text-bright">{s.name}</h3>
              </div>
              <p className="mb-3 text-xs leading-relaxed text-text-muted line-clamp-2">{s.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-text-muted">Net Income</span>
                  <p className="font-semibold text-text-bright">{fmt(s.projectedNetIncome)}</p>
                </div>
                <div>
                  <span className="text-text-muted">Cash Impact</span>
                  <p className={`font-semibold ${s.cashImpact >= 0 ? 'text-success' : 'text-danger'}`}>
                    {s.cashImpact >= 0 ? '+' : ''}{fmt(s.cashImpact)}
                  </p>
                </div>
              </div>
              {s.breakeven && (
                <p className="mt-2 text-xs text-text-muted">Breakeven: {s.breakeven}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CapEx Tracker */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-bright">CapEx Tracker</h2>
          <span className="text-sm text-text-muted">
            Total: {fmt(capex!.reduce((s, c) => s + c.amount, 0))} &middot; YTD Spent: {fmt(capexYTD)}
          </span>
        </div>
        <DataTable<CapexItem & Record<string, unknown>>
          data={capex!.map((c) => ({ ...c } as CapexItem & Record<string, unknown>))}
          columns={capexColumns}
          pageSize={10}
        />
      </div>

      {/* Scenario Drawer */}
      <ScenarioDrawer
        scenario={selectedScenario}
        open={!!selectedScenario}
        onClose={() => setSelectedScenario(null)}
      />
    </div>
  );
}
