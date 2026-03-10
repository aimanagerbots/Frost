'use client';

import { useState, useMemo } from 'react';
import { MetricCard, StatusBadge, LoadingSkeleton } from '@/components';
import { useProductRecommendations } from '../../hooks/useProductRecommendations';
import { ChartWrapper, CHART_THEME, CHART_COLORS } from '@/components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Filter, ShoppingCart, Mail, X } from 'lucide-react';
import { ACCENT as CRM_ACCENT } from '@/design/colors';


const CATEGORY_COLORS: Record<string, string> = {
  flower: CHART_COLORS.flower,
  preroll: CHART_COLORS.preroll,
  vaporizer: CHART_COLORS.vaporizer,
  concentrate: CHART_COLORS.concentrate,
  edible: CHART_COLORS.edible,
  beverage: CHART_COLORS.beverage,
};

import type { DomainStatus } from '@/components/StatusBadge';

const STATUS_VARIANT: Record<string, 'success' | 'info' | 'warning' | 'muted'> = {
  new: 'info',
  pitched: 'warning',
  accepted: 'success',
  dismissed: 'muted',
};

const REC_STATUS_DOMAIN: Record<string, DomainStatus | null> = {
  new: 'new',
  accepted: 'accepted',
};

type AggView = 'cards' | 'by-product' | 'by-account' | 'by-category';

export function ProductRecommendations() {
  const { data: recommendations, isLoading } = useProductRecommendations();
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [aggView, setAggView] = useState<AggView>('cards');
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    if (!recommendations) return [];
    return recommendations.filter((r) => {
      if (statusFilter && r.status !== statusFilter) return false;
      if (categoryFilter && r.category !== categoryFilter) return false;
      return true;
    });
  }, [recommendations, statusFilter, categoryFilter]);

  // Aggregation data (must be before early returns)
  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach((r) => { map[r.category] = (map[r.category] || 0) + r.estimatedRevenue; });
    return Object.entries(map).map(([category, revenue]) => ({ category, revenue })).sort((a, b) => b.revenue - a.revenue);
  }, [filtered]);

  const byAccount = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach((r) => { map[r.accountName] = (map[r.accountName] || 0) + r.estimatedRevenue; });
    return Object.entries(map).map(([account, revenue]) => ({ account, revenue })).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  }, [filtered]);

  const byProduct = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach((r) => { map[r.productName] = (map[r.productName] || 0) + 1; });
    return Object.entries(map).map(([product, count]) => ({ product, count })).sort((a, b) => b.count - a.count).slice(0, 10);
  }, [filtered]);

  if (isLoading) return <LoadingSkeleton variant="card" count={4} />;
  if (!recommendations) return null;

  const totalRecs = recommendations.length;
  const untappedRevenue = recommendations.filter((r) => r.status !== 'dismissed').reduce((s, r) => s + r.estimatedRevenue, 0);
  const acceptanceRate = recommendations.length > 0
    ? (recommendations.filter((r) => r.status === 'accepted').length / recommendations.length * 100)
    : 0;
  const topCategory = Object.entries(
    recommendations.reduce<Record<string, number>>((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + r.estimatedRevenue;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  function handleDismiss(id: string) {
    setDismissedIds((prev) => new Set(prev).add(id));
  }

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard label="Total Recommendations" value={totalRecs} accentColor={CRM_ACCENT} />
        <MetricCard label="Estimated Untapped Revenue" value={`$${(untappedRevenue / 1000).toFixed(1)}K/mo`} accentColor="#5BB8E6" />
        <MetricCard label="Acceptance Rate" value={`${acceptanceRate.toFixed(0)}%`} accentColor="#5BB8E6" />
        <MetricCard label="Top Category" value={topCategory} accentColor="#5BB8E6" />
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-card p-4">
        <Filter className="h-4 w-4 text-text-muted" />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-default bg-base px-2 py-1 text-xs text-text-default focus:outline-none"
        >
          <option value="">All Categories</option>
          {['flower', 'preroll', 'vaporizer', 'concentrate', 'edible', 'beverage'].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-default bg-base px-2 py-1 text-xs text-text-default focus:outline-none"
        >
          <option value="">All Status</option>
          {['new', 'pitched', 'accepted', 'dismissed'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <div className="flex-1" />

        {/* Aggregate toggle */}
        <div className="flex gap-1.5">
          {([['cards', 'Cards'], ['by-product', 'By Product'], ['by-account', 'By Account'], ['by-category', 'By Category']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setAggView(key)}
              className={`rounded-md px-2 py-1 text-xs transition-colors ${
                aggView === key ? 'bg-amber-500/20 text-amber-400' : 'bg-elevated text-text-muted hover:text-text-default'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards View */}
      {aggView === 'cards' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((rec) => {
            const isDismissed = dismissedIds.has(rec.id) || rec.status === 'dismissed';
            return (
              <div
                key={rec.id}
                className={`rounded-xl bg-card p-4 transition-opacity ${isDismissed ? 'opacity-50' : ''}`}
              >
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-text-bright">{rec.productName}</h4>
                    <span className="text-xs text-text-muted">{rec.accountName}</span>
                  </div>
                  <span
                    className="rounded-full px-2 py-0.5 text-xs capitalize"
                    style={{ backgroundColor: `${CATEGORY_COLORS[rec.category]}20`, color: CATEGORY_COLORS[rec.category] }}
                  >
                    {rec.category}
                  </span>
                </div>

                {/* Confidence bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>Confidence</span>
                    <span>{rec.confidence}%</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-elevated">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${rec.confidence}%`,
                        backgroundColor: rec.confidence >= 80 ? CHART_COLORS.success : rec.confidence >= 60 ? CRM_ACCENT : CHART_COLORS.danger,
                      }}
                    />
                  </div>
                </div>

                <div className="mb-2 text-sm font-medium text-success">${rec.estimatedRevenue.toLocaleString()}/mo est.</div>

                <p className="mb-2 text-xs text-text-muted leading-relaxed line-clamp-3">{rec.reason}</p>

                {rec.competitorContext && (
                  <p className="mb-3 rounded-lg bg-danger/5 p-2 text-xs text-danger/80">{rec.competitorContext}</p>
                )}

                <div className="flex items-center justify-between">
                  <StatusBadge
                    {...((!isDismissed && REC_STATUS_DOMAIN[rec.status])
                      ? { status: REC_STATUS_DOMAIN[rec.status]! }
                      : { variant: STATUS_VARIANT[isDismissed ? 'dismissed' : rec.status], label: isDismissed ? 'dismissed' : rec.status })}
                    size="sm"
                  />
                  {!isDismissed && rec.status === 'new' && (
                    <div className="flex gap-1.5">
                      <button className="flex items-center gap-1 rounded-md bg-success/20 px-2 py-1 text-xs text-success hover:bg-success/30">
                        <ShoppingCart className="h-3 w-3" /> Add to Order
                      </button>
                      <button className="flex items-center gap-1 rounded-md bg-info/20 px-2 py-1 text-xs text-info hover:bg-info/30">
                        <Mail className="h-3 w-3" /> Pitch
                      </button>
                      <button
                        onClick={() => handleDismiss(rec.id)}
                        className="flex items-center gap-1 rounded-md bg-elevated px-2 py-1 text-xs text-text-muted hover:text-text-default"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* By Category */}
      {aggView === 'by-category' && (
        <ChartWrapper title="Opportunity by Category" subtitle="Total estimated monthly revenue">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byCategory} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
              <XAxis type="number" tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="category" tick={{ fill: CHART_THEME.axisColor, fontSize: 12 }} width={80} />
              <Tooltip
                contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, color: CHART_THEME.tooltipText, borderRadius: 8 }}
                formatter={(value) => [`$${Number(value).toLocaleString()}/mo`, 'Est. Revenue']}
              />
              <Bar dataKey="revenue" fill={CRM_ACCENT} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      )}

      {/* By Account */}
      {aggView === 'by-account' && (
        <ChartWrapper title="Opportunity by Account" subtitle="Top 10 accounts by untapped revenue">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byAccount} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
              <XAxis type="number" tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="account" tick={{ fill: CHART_THEME.axisColor, fontSize: 10 }} width={140} />
              <Tooltip
                contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, color: CHART_THEME.tooltipText, borderRadius: 8 }}
                formatter={(value) => [`$${Number(value).toLocaleString()}/mo`, 'Est. Revenue']}
              />
              <Bar dataKey="revenue" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      )}

      {/* By Product */}
      {aggView === 'by-product' && (
        <ChartWrapper title="Most Recommended Products" subtitle="Top 10 by number of target accounts">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byProduct} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
              <XAxis type="number" tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} />
              <YAxis type="category" dataKey="product" tick={{ fill: CHART_THEME.axisColor, fontSize: 10 }} width={180} />
              <Tooltip
                contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, color: CHART_THEME.tooltipText, borderRadius: 8 }}
                formatter={(value) => [value, 'Accounts']}
              />
              <Bar dataKey="count" fill={CHART_COLORS.success} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      )}
    </div>
  );
}
