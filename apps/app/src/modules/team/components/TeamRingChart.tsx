'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { TeamRole } from '../hooks/useTeamDashboard';

interface TeamRingChartProps {
  roles: TeamRole[];
  total: number;
}

export function TeamRingChart({ roles, total }: TeamRingChartProps) {
  return (
    <div className="rounded-2xl border border-default bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-text-bright">Team Overview</h3>
          <span className="h-4 w-4 rounded-full border border-border-hover flex items-center justify-center text-[8px] text-text-muted">?</span>
        </div>
        <button className="text-text-muted hover:text-text-bright transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      </div>

      {/* Ring Chart */}
      <div className="relative mx-auto" style={{ width: 220, height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={roles}
              dataKey="count"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              strokeWidth={3}
              stroke="var(--bg-card)"
              startAngle={90}
              endAngle={-270}
            >
              {roles.map((role) => (
                <Cell key={role.name} fill={role.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-text-bright tracking-tight">{total}</span>
          <span className="text-xs text-text-muted mt-0.5">Team members</span>
        </div>
      </div>

      {/* Legend Grid */}
      <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5">
        {roles.map((role) => (
          <div key={role.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: role.color }}
              />
              <span className="text-xs text-text-muted">{role.name}</span>
            </div>
            <span className="text-xs font-semibold text-text-bright tabular-nums">{role.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
