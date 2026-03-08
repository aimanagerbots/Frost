'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { MonthlyStat } from '../hooks/useTeamDashboard';

interface TrainingStatsProps {
  monthlyStats: MonthlyStat[];
  stats: {
    participation: number;
    avgTime: string;
    avgScore: string;
  };
}

function StatsTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: MonthlyStat }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-default bg-card px-3 py-2.5 shadow-xl">
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-6">
          <span className="text-[11px] text-[#5BB8E6]">Participation</span>
          <span className="text-[11px] font-semibold text-text-bright tabular-nums">{payload[0].value}</span>
        </div>
      </div>
    </div>
  );
}

export function TrainingStats({ monthlyStats, stats }: TrainingStatsProps) {
  return (
    <div className="rounded-2xl border border-default bg-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-text-bright">Statistics Overview</h3>
          <span className="h-4 w-4 rounded-full border border-border-hover flex items-center justify-center text-[8px] text-text-muted">?</span>
        </div>
        <button className="flex items-center gap-1 rounded-lg border border-default px-2.5 py-1 text-[11px] text-text-muted hover:text-text-bright hover:border-border-hover transition-colors">
          2026
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 4L5 6.5L7.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      {/* Summary stats row */}
      <div className="mb-4 flex items-center gap-4 rounded-lg bg-base/50 px-3 py-2">
        <div>
          <span className="text-[10px] text-[#5BB8E6] block">Participation</span>
          <span className="text-sm font-bold text-text-bright">{stats.participation}</span>
        </div>
        <div className="h-6 w-px bg-border-default" />
        <div>
          <span className="text-[10px] text-text-muted block">Avg. Time</span>
          <span className="text-sm font-bold text-text-bright">{stats.avgTime}</span>
        </div>
        <div className="h-6 w-px bg-border-default" />
        <div>
          <span className="text-[10px] text-text-muted block">Avg. Score</span>
          <span className="text-sm font-bold text-text-bright">{stats.avgScore}</span>
        </div>
      </div>

      {/* Bar Chart */}
      <div style={{ height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyStats} barCategoryGap="25%">
            <CartesianGrid
              vertical={false}
              stroke="var(--border-default)"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
              width={24}
            />
            <Tooltip
              content={<StatsTooltip />}
              cursor={{ fill: 'var(--bg-elevated)', opacity: 0.3 }}
            />
            <Bar
              dataKey="value"
              fill="#10B981"
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
