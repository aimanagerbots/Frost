'use client';

import { MetricCard, ChartWrapper, CHART_THEME, LoadingSkeleton } from '@/components';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart, BarChart, Bar } from 'recharts';
import type { SEOMetrics, BlogPost, OrganicTrendPoint } from '../../types/seo-events';
import { ACCENT } from '@/design/colors';


interface SEOOverviewTabProps {
  metrics: SEOMetrics;
  posts: BlogPost[];
  trend: OrganicTrendPoint[];
  isTrendLoading: boolean;
}

export function SEOOverviewTab({ metrics, posts, trend, isTrendLoading }: SEOOverviewTabProps) {
  const publishedPosts = posts.filter((p) => p.status === 'published');
  const topByOrganic = [...publishedPosts]
    .sort((a, b) => (b.organicTraffic ?? 0) - (a.organicTraffic ?? 0))
    .slice(0, 5);

  const barData = topByOrganic.map((p) => ({
    name: p.title.length > 30 ? p.title.slice(0, 30) + '...' : p.title,
    organic: p.organicTraffic ?? 0,
  }));

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Organic Visits (Month)"
          value={metrics.totalOrganicVisits.toLocaleString()}
          trend={{ value: 18, direction: 'up' }}
          accentColor={ACCENT}
        />
        <MetricCard label="Top 10 Rankings" value={metrics.top10Count} accentColor={ACCENT} />
        <MetricCard label="Avg Position" value={metrics.avgPosition} accentColor={ACCENT} />
        <MetricCard label="Published Posts" value={metrics.publishedPosts} accentColor={ACCENT} />
      </div>

      {/* Organic Traffic Trend */}
      {isTrendLoading ? (
        <LoadingSkeleton variant="card" count={1} />
      ) : trend.length > 0 ? (
        <ChartWrapper title="Organic Traffic Trend" subtitle="Visits over the last 30 days">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="organicGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ACCENT} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
                tickFormatter={(v: string) => {
                  const d = new Date(v);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
              />
              <YAxis tick={{ fill: CHART_THEME.axisColor, fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: CHART_THEME.tooltipBg,
                  border: `1px solid ${CHART_THEME.tooltipBorder}`,
                  borderRadius: 8,
                  color: CHART_THEME.tooltipText,
                }}
              />
              <Area
                type="monotone"
                dataKey="visits"
                stroke={ACCENT}
                strokeWidth={2}
                fill="url(#organicGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartWrapper>
      ) : null}

      {/* Top Pages by Organic Traffic */}
      {barData.length > 0 && (
        <ChartWrapper title="Top Pages by Organic Traffic" subtitle="Top 5 published posts">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} horizontal={false} />
              <XAxis type="number" tick={{ fill: CHART_THEME.axisColor, fontSize: 12 }} />
              <YAxis
                dataKey="name"
                type="category"
                width={180}
                tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: CHART_THEME.tooltipBg,
                  border: `1px solid ${CHART_THEME.tooltipBorder}`,
                  borderRadius: 8,
                  color: CHART_THEME.tooltipText,
                }}
              />
              <Bar dataKey="organic" fill={ACCENT} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      )}
    </div>
  );
}
