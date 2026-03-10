'use client';

import {
  ChartWrapper,
  CHART_THEME,
  CHART_COLORS,
  LoadingSkeleton,
  legendFormatter,
} from '@/components';
import { AlertTriangle } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { useMerchBudget } from '../../hooks/seo-events-hooks';
import type { MerchItem } from '../../types/seo-events';
import { ACCENT } from '@/design/colors';


const CATEGORY_COLORS = [
  CHART_COLORS.purple,
  CHART_COLORS.info,
  ACCENT,
  '#5BB8E6',
  CHART_COLORS.success,
  '#5BB8E6',
];

interface MerchBudgetTabProps {
  items: MerchItem[];
}

export function MerchBudgetTab({ items }: MerchBudgetTabProps) {
  const { data: budget, isLoading } = useMerchBudget();

  if (isLoading || !budget) return <LoadingSkeleton variant="card" count={3} />;

  const pct = Math.round((budget.spentYTD / budget.annual) * 100);

  const donutData = budget.byCategory.map((c, i) => ({
    name: c.category,
    value: c.amount,
    color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  }));

  // Top distributed items
  const topDistributed = [...items]
    .sort((a, b) => b.distributed - a.distributed)
    .slice(0, 5)
    .map((item) => ({
      name: item.name.length > 22 ? item.name.slice(0, 22) + '...' : item.name,
      quantity: item.distributed,
    }));

  // Reorder alerts
  const reorderAlerts = items.filter((i) => i.stock <= 15 || i.stock === 0);

  return (
    <div className="space-y-6">
      {/* Budget Summary */}
      <div className="rounded-xl bg-card p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-text-bright">Annual Merch Budget</h3>
          <span className="text-xs text-text-muted">${budget.spentYTD.toLocaleString()} / ${budget.annual.toLocaleString()}</span>
        </div>
        <div className="h-3 w-full rounded-full bg-elevated">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: pct > 80 ? '#FB7185' : ACCENT }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-text-muted">{pct}% spent YTD</span>
          <span className="text-xs text-text-muted">${(budget.annual - budget.spentYTD).toLocaleString()} remaining</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* Spend by Category */}
        <ChartWrapper title="Spend by Category" height={260}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={donutData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3}>
                {donutData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 8, color: CHART_THEME.tooltipText }}
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Spend']}
              />
              <Legend formatter={legendFormatter} />
            </PieChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Monthly Spend Trend */}
        <ChartWrapper title="Monthly Spend Trend" height={260}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={budget.monthlySpend}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
              <XAxis dataKey="month" tick={{ fill: CHART_THEME.axisColor, fontSize: 12 }} />
              <YAxis tick={{ fill: CHART_THEME.axisColor, fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 8, color: CHART_THEME.tooltipText }}
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Spend']}
              />
              <Bar dataKey="amount" fill={ACCENT} radius={[4, 4, 0, 0]} name="Spend" />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Top Distributed Items */}
        <ChartWrapper title="Top Distributed Items" height={260}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topDistributed} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} horizontal={false} />
              <XAxis type="number" tick={{ fill: CHART_THEME.axisColor, fontSize: 12 }} />
              <YAxis dataKey="name" type="category" width={160} tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 8, color: CHART_THEME.tooltipText }}
              />
              <Bar dataKey="quantity" fill={ACCENT} radius={[0, 4, 4, 0]} name="Distributed" />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      {/* Reorder Alerts */}
      {reorderAlerts.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-warning">Reorder Alerts</h2>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
            {reorderAlerts.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-xl border border-warning/30 bg-card p-3">
                <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-bright truncate">{item.name}</p>
                  <p className="text-xs text-text-muted">
                    {item.stock === 0
                      ? 'OUT OF STOCK'
                      : `${item.stock} remaining — reorder point is ${Math.max(item.stock + 10, 25)}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
