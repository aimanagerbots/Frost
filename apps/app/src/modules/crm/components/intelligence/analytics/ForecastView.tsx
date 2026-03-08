'use client';

import { ChartWrapper, CHART_THEME, CHART_COLORS } from '@/components';
import type { Forecast, RevenueAnalytics } from '../../../types';
import { ACCENT as CRM_ACCENT } from '@/design/colors';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Line,
} from 'recharts';


interface ForecastViewProps {
  forecasts: Forecast[];
  monthlyRevenue: RevenueAnalytics['monthlyRevenue'];
}

export function ForecastView({ forecasts, monthlyRevenue }: ForecastViewProps) {
  // Build combined chart data: historical + forecast
  const historicalData = monthlyRevenue.map((m) => {
    const total = m.flower + m.preroll + m.vaporizer + m.concentrate + m.edible + m.beverage;
    return {
      month: new Date(m.month + '-01').toLocaleDateString('en-US', { month: 'short' }),
      revenue: total,
    };
  });

  // Add forecast points
  const f30 = forecasts.find((f) => f.period === '30-day');
  const f60 = forecasts.find((f) => f.period === '60-day');
  const f90 = forecasts.find((f) => f.period === '90-day');

  const chartData = [
    ...historicalData.map((d) => ({ ...d, forecast: null as number | null, upper: null as number | null, lower: null as number | null })),
    // Last actual point also starts the forecast
    ...(f30 ? [{ month: 'Apr', revenue: null as number | null, forecast: f30.predicted, upper: f30.upper, lower: f30.lower }] : []),
    ...(f60 ? [{ month: 'May', revenue: null as number | null, forecast: f60.predicted / 2, upper: f60.upper / 2, lower: f60.lower / 2 }] : []),
    ...(f90 ? [{ month: 'Jun', revenue: null as number | null, forecast: f90.predicted / 3, upper: f90.upper / 3, lower: f90.lower / 3 }] : []),
  ];

  return (
    <div className="space-y-6">
      {/* Forecast cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {forecasts.map((f) => (
          <div key={f.period} className="rounded-xl border border-default bg-card p-4">
            <div className="mb-1 text-xs font-medium uppercase text-text-muted">{f.period} Forecast</div>
            <div className="text-2xl font-bold text-text-bright">${(f.predicted / 1000).toFixed(0)}K</div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs text-text-muted">Range:</span>
              <span className="text-xs text-text-default">${(f.lower / 1000).toFixed(0)}K – ${(f.upper / 1000).toFixed(0)}K</span>
            </div>
            <div className="mt-1">
              <span className={`text-xs ${f.confidence >= 80 ? 'text-success' : f.confidence >= 70 ? 'text-warning' : 'text-danger'}`}>
                {f.confidence}% confidence
              </span>
            </div>
            <p className="mt-2 text-xs text-text-muted leading-relaxed">{f.basis}</p>
          </div>
        ))}
      </div>

      {/* Combined chart */}
      <ChartWrapper title="Revenue Trend + Forecast" subtitle="Historical with projected range">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
            <XAxis dataKey="month" tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} axisLine={{ stroke: CHART_THEME.gridColor }} />
            <YAxis tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} axisLine={{ stroke: CHART_THEME.gridColor }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, color: CHART_THEME.tooltipText, borderRadius: 8 }}
              formatter={(value) => value !== null ? [`$${Number(value).toLocaleString()}`, ''] : ['—', '']}
            />
            {/* Confidence band */}
            <Area type="monotone" dataKey="upper" stroke="none" fill={CHART_COLORS.primary} fillOpacity={0.1} />
            <Area type="monotone" dataKey="lower" stroke="none" fill="transparent" />
            {/* Historical line */}
            <Line type="monotone" dataKey="revenue" stroke={CHART_COLORS.primary} strokeWidth={2} dot={{ fill: CHART_COLORS.primary, r: 3 }} connectNulls={false} />
            {/* Forecast line */}
            <Line type="monotone" dataKey="forecast" stroke={CRM_ACCENT} strokeWidth={2} strokeDasharray="6 3" dot={{ fill: CRM_ACCENT, r: 3 }} connectNulls={false} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </div>
  );
}
