'use client';

import { ChartWrapper, CHART_THEME, CHART_COLORS } from '@/components';
import type { AccountHealthModel } from '../../../types';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const TIER_COLORS: Record<string, string> = {
  Thriving: CHART_COLORS.success,
  Healthy: CHART_COLORS.info,
  'At Risk': CHART_COLORS.warning,
  Churning: CHART_COLORS.danger,
};

interface HealthModelViewProps {
  model: AccountHealthModel;
}

export function HealthModelView({ model }: HealthModelViewProps) {
  const pieData = model.distribution.map((d) => ({
    name: d.tier,
    value: d.count,
    color: TIER_COLORS[d.tier] || CHART_COLORS.primary,
  }));

  const trendData = model.avgScoreTrend.map((score, i) => ({
    month: `M${i + 1}`,
    score,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Distribution donut */}
        <ChartWrapper title="Health Distribution" subtitle={`Avg score: ${model.avgScore}`}>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                label={({ name, value, x, y }: { name?: string; value?: number; x?: number; y?: number }) => (
                  <text x={x} y={y} fill="#E2E8F0" fontSize={11} textAnchor="middle" dominantBaseline="central">
                    {name}: {value}
                  </text>
                )}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, color: CHART_THEME.tooltipText, borderRadius: 8 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Score trend */}
        <ChartWrapper title="Average Health Score Trend" subtitle="12 months">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
              <XAxis dataKey="month" tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} axisLine={{ stroke: CHART_THEME.gridColor }} />
              <YAxis domain={[60, 80]} tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} axisLine={{ stroke: CHART_THEME.gridColor }} />
              <Tooltip
                contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, color: CHART_THEME.tooltipText, borderRadius: 8 }}
              />
              <Line type="monotone" dataKey="score" stroke={CHART_COLORS.primary} strokeWidth={2} dot={{ fill: CHART_COLORS.primary, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      {/* Factors table */}
      <div className="rounded-xl border border-default bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-default">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">Factor</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">Weight</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">Description</th>
            </tr>
          </thead>
          <tbody>
            {model.factors.map((f) => (
              <tr key={f.name} className="border-b border-default/50">
                <td className="px-4 py-3 font-medium text-text-bright">{f.name}</td>
                <td className="px-4 py-3 text-text-default">{f.weight}%</td>
                <td className="px-4 py-3 text-text-muted">{f.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Correlations */}
      <div className="rounded-xl border border-default bg-card p-4">
        <h4 className="mb-3 text-sm font-medium text-text-bright">Key Correlations</h4>
        <div className="space-y-2">
          {model.correlations.map((c) => (
            <div key={c.factor} className="flex items-start gap-3 rounded-lg bg-base p-3">
              <span className={`mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full ${c.impact === 'high' ? 'bg-success' : 'bg-info'}`} />
              <div>
                <span className="text-sm font-medium text-text-default">{c.factor}</span>
                <p className="text-xs text-text-muted">{c.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
