'use client';

import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const METRICS = [
  { label: 'Total Revenue', value: '$148,420', change: '+18.2%', up: true, icon: DollarSign, period: 'vs last quarter' },
  { label: 'Orders Placed', value: '67', change: '+12', up: true, icon: ShoppingCart, period: 'vs last quarter' },
  { label: 'Unique SKUs Ordered', value: '42', change: '+6', up: true, icon: Package, period: 'vs last quarter' },
  { label: 'Avg. Fulfillment Time', value: '2.4 days', change: '-0.8', up: true, icon: Users, period: 'vs last quarter' },
];

const MONTHLY_DATA = [
  { month: 'Oct', revenue: 32400 },
  { month: 'Nov', revenue: 38200 },
  { month: 'Dec', revenue: 45100 },
  { month: 'Jan', revenue: 41800 },
  { month: 'Feb', revenue: 43600 },
  { month: 'Mar', revenue: 48200 },
];

const CATEGORY_SPLIT = [
  { name: 'Flower', pct: 34, color: '#22C55E' },
  { name: 'Concentrate', pct: 24, color: '#F59E0B' },
  { name: 'Edible', pct: 18, color: '#8B5CF6' },
  { name: 'Preroll', pct: 14, color: '#F97316' },
  { name: 'Beverage', pct: 6, color: '#14B8A6' },
  { name: 'Vape', pct: 4, color: '#3B82F6' },
];

export default function AnalyticsPage() {
  const maxRevenue = Math.max(...MONTHLY_DATA.map((d) => d.revenue));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-bright font-display">Analytics</h1>
        <p className="text-sm text-text-muted mt-1">Performance metrics and trends</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="rounded-xl border border-border-default bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-primary/10">
                  <Icon className="h-[18px] w-[18px] text-accent-primary" />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${m.up ? 'text-success' : 'text-danger'}`}>
                  {m.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {m.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-text-bright font-display">{m.value}</p>
              <p className="text-xs text-text-muted mt-1">{m.period}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart (CSS bars) */}
        <div className="lg:col-span-2 rounded-xl border border-border-default bg-card p-5">
          <h2 className="text-sm font-semibold text-text-bright mb-6">Revenue Trend</h2>
          <div className="flex items-end gap-3 h-48">
            {MONTHLY_DATA.map((d) => (
              <div key={d.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs text-text-muted font-mono">${(d.revenue / 1000).toFixed(0)}k</span>
                <div
                  className="w-full rounded-t-md bg-accent-primary/30 hover:bg-accent-primary/50 transition-colors"
                  style={{ height: `${(d.revenue / maxRevenue) * 140}px` }}
                />
                <span className="text-xs text-text-muted">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category split */}
        <div className="rounded-xl border border-border-default bg-card p-5">
          <h2 className="text-sm font-semibold text-text-bright mb-6">Sales by Category</h2>
          <div className="space-y-4">
            {CATEGORY_SPLIT.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-text-default">{cat.name}</span>
                  <span className="text-sm font-semibold text-text-bright">{cat.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
