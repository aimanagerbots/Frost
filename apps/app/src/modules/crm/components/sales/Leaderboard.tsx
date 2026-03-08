'use client';

import { useState, useMemo } from 'react';
import { Trophy } from 'lucide-react';
import { LoadingSkeleton, EmptyState, ChartWrapper, CHART_THEME } from '@/components';
import { useLeaderboard } from '../../hooks';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { LeaderboardRep } from '../../types';
import { ACCENT as CRM_ACCENT } from '@/design/colors';


function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);
}

function formatCompact(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

const PERIODS = [
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'This Quarter', value: 'quarter' },
  { label: 'YTD', value: 'ytd' },
];

const MEDALS = ['', '\u{1F947}', '\u{1F948}', '\u{1F949}'];

function RepCard({ rep, expanded, onToggle }: { rep: LeaderboardRep; expanded: boolean; onToggle: () => void }) {
  const isManager = rep.rank === 0;

  // Mock category breakdown for expanded view
  const categoryData = [
    { name: 'Flower', revenue: rep.periodRevenue * 0.38 },
    { name: 'Preroll', revenue: rep.periodRevenue * 0.22 },
    { name: 'Vape', revenue: rep.periodRevenue * 0.18 },
    { name: 'Edible', revenue: rep.periodRevenue * 0.12 },
    { name: 'Conc.', revenue: rep.periodRevenue * 0.07 },
    { name: 'Bev.', revenue: rep.periodRevenue * 0.03 },
  ];

  return (
    <div
      className={`rounded-xl border border-default bg-card transition-all ${isManager ? 'border-amber-500/30' : ''}`}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-4 p-4 text-left"
      >
        {/* Rank */}
        <div className="flex w-12 shrink-0 flex-col items-center">
          {isManager ? (
            <span className="text-xs font-medium text-text-muted">MGR</span>
          ) : (
            <>
              <span className="text-2xl">{MEDALS[rep.rank] || ''}</span>
              <span className="text-lg font-bold text-text-bright">#{rep.rank}</span>
            </>
          )}
        </div>

        {/* Avatar + name */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: CRM_ACCENT }}
          >
            {rep.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="font-semibold text-text-bright">{rep.name}</div>
            <div className="text-xs text-text-muted">{rep.territory}</div>
          </div>
        </div>

        {/* Revenue */}
        <div className="ml-auto text-right">
          <div className="text-xl font-bold text-text-bright">{formatCurrency(rep.periodRevenue)}</div>
          <div className="flex items-center gap-1 text-xs">
            <span className={rep.trend === 'up' ? 'text-success' : rep.trend === 'down' ? 'text-danger' : 'text-text-muted'}>
              {rep.trend === 'up' ? '\u2191' : rep.trend === 'down' ? '\u2193' : '\u2192'}
            </span>
            <span className="text-text-muted">vs prior</span>
          </div>
        </div>
      </button>

      {/* Secondary metrics */}
      <div className="flex gap-4 border-t border-default/50 px-4 py-2.5 text-xs text-text-muted">
        <span><span className="font-medium text-text-default">{rep.periodOrders}</span> orders</span>
        <span><span className="font-medium text-text-default">{rep.newAccounts}</span> new accounts</span>
        <span><span className="font-medium text-text-default">{rep.proposalAcceptRate}%</span> accept rate</span>
        {!isManager && <span><span className="font-medium text-text-default">{rep.streakDays}d</span> streak</span>}
      </div>

      {/* Goal progress */}
      {!isManager && (
        <div className="px-4 pb-3">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-text-muted">Goal Progress</span>
            <span className={`font-semibold ${rep.goalProgress >= 90 ? 'text-success' : rep.goalProgress >= 70 ? 'text-warning' : 'text-danger'}`}>
              {rep.goalProgress}%
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-elevated">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${rep.goalProgress}%`,
                backgroundColor: rep.goalProgress >= 90 ? 'var(--success)' : rep.goalProgress >= 70 ? 'var(--warning)' : 'var(--danger)',
              }}
            />
          </div>
        </div>
      )}

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-default p-4 space-y-4">
          {/* Revenue by category chart */}
          <ChartWrapper title="Revenue by Category" height={180}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis dataKey="name" tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} axisLine={{ stroke: CHART_THEME.gridColor }} tickLine={{ stroke: CHART_THEME.gridColor }} />
                <YAxis tickFormatter={(v) => formatCompact(Number(v))} tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} axisLine={{ stroke: CHART_THEME.gridColor }} tickLine={{ stroke: CHART_THEME.gridColor }} />
                <Tooltip
                  formatter={(v) => formatCurrency(Number(v))}
                  contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 8, color: CHART_THEME.tooltipText }}
                />
                <Bar dataKey="revenue" fill={CRM_ACCENT} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>

          {/* Top accounts */}
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Top 5 Accounts</h4>
            <div className="space-y-1.5">
              {rep.topAccounts.map((acct, i) => (
                <div key={acct.name} className="flex items-center justify-between text-sm">
                  <span className="text-text-default">
                    <span className="mr-2 text-xs text-text-muted">{i + 1}.</span>
                    {acct.name}
                  </span>
                  <span className="font-medium text-text-bright">{formatCurrency(acct.revenue)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity metrics */}
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Activity This Period</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-elevated p-2 text-center">
                <div className="text-lg font-bold text-text-bright">{Math.round(rep.periodOrders * 0.8)}</div>
                <div className="text-[10px] text-text-muted">Calls</div>
              </div>
              <div className="rounded-lg bg-elevated p-2 text-center">
                <div className="text-lg font-bold text-text-bright">{Math.round(rep.periodOrders * 1.2)}</div>
                <div className="text-[10px] text-text-muted">Emails</div>
              </div>
              <div className="rounded-lg bg-elevated p-2 text-center">
                <div className="text-lg font-bold text-text-bright">{Math.round(rep.periodOrders * 0.3)}</div>
                <div className="text-[10px] text-text-muted">Meetings</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Leaderboard() {
  const { data: reps, isLoading } = useLeaderboard();
  const [period, setPeriod] = useState('quarter');
  const [expandedRep, setExpandedRep] = useState<string | null>(null);

  const manager = useMemo(() => reps?.find((r) => r.rank === 0), [reps]);
  const rankedReps = useMemo(
    () => (reps ?? []).filter((r) => r.rank > 0).sort((a, b) => a.rank - b.rank),
    [reps],
  );

  if (isLoading) return <LoadingSkeleton variant="card" count={4} />;

  if (!reps?.length) {
    return (
      <EmptyState
        icon={Trophy}
        title="No Leaderboard Data"
        description="No sales rep data available."
        accentColor={CRM_ACCENT}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Period selector */}
      <div className="flex gap-1 rounded-lg bg-elevated p-1">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              period === p.value
                ? 'bg-card text-text-bright shadow-sm'
                : 'text-text-muted hover:text-text-default'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Manager summary card */}
      {manager && (
        <RepCard
          rep={manager}
          expanded={expandedRep === manager.id}
          onToggle={() => setExpandedRep(expandedRep === manager.id ? null : manager.id)}
        />
      )}

      {/* Ranked reps */}
      <div className="space-y-3">
        {rankedReps.map((rep) => (
          <RepCard
            key={rep.id}
            rep={rep}
            expanded={expandedRep === rep.id}
            onToggle={() => setExpandedRep(expandedRep === rep.id ? null : rep.id)}
          />
        ))}
      </div>
    </div>
  );
}
