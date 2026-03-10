'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { ChartWrapper, StatusBadge } from '@/components';
import { CHART_THEME } from '@/components';
import type { COAResults } from '../types';
import { ACCENT } from '@/design/colors';


const TERPENE_COLORS = [
  '#5BB8E6', '#A855F7', '#C084FC', '#D8B4FE', '#5BB8E6',
  '#6D28D9', '#5B21B6', '#5BB8E6',
];

interface COAResultsDisplayProps {
  results: COAResults;
  highlightFailures?: boolean;
}

export function COAResultsDisplay({ results, highlightFailures }: COAResultsDisplayProps) {
  const cannabinoids = [
    { label: 'THC', value: results.thcPercent, color: '#5BB8E6' },
    { label: 'CBD', value: results.cbdPercent, color: '#5BB8E6' },
    { label: 'Total', value: results.totalCannabinoids, color: ACCENT },
  ];

  const terpeneData = results.terpeneProfile.map((t) => ({
    name: t.name,
    percent: t.percent,
  }));

  return (
    <div className="space-y-5">
      {/* Cannabinoid bars */}
      <div className="rounded-xl bg-card p-4 space-y-3">
        <h4 className="text-sm font-medium text-text-muted">Cannabinoid Profile</h4>
        {cannabinoids.map((c) => (
          <div key={c.label} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-default">{c.label}</span>
              <span className="font-semibold" style={{ color: c.color }}>{c.value}%</span>
            </div>
            <div className="h-2 rounded-full bg-elevated overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min((c.value / (c.label === 'Total' ? 100 : 40)) * 100, 100)}%`,
                  backgroundColor: c.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Terpene chart */}
      {terpeneData.length > 0 && (
        <ChartWrapper title="Terpene Profile" height={200}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={terpeneData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
                axisLine={{ stroke: CHART_THEME.gridColor }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
                axisLine={{ stroke: CHART_THEME.gridColor }}
                tickLine={false}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: CHART_THEME.tooltipBg,
                  border: `1px solid ${CHART_THEME.tooltipBorder}`,
                  borderRadius: 8,
                  color: CHART_THEME.tooltipText,
                }}
                formatter={(value) => [`${value}%`, 'Content']}
              />
              <Bar dataKey="percent" radius={[4, 4, 0, 0]}>
                {terpeneData.map((_, i) => (
                  <Cell key={i} fill={TERPENE_COLORS[i % TERPENE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      )}

      {/* Contaminant table */}
      <div className="rounded-xl bg-card p-4 space-y-3">
        <h4 className="text-sm font-medium text-text-muted">Contaminant Testing</h4>
        <div className="rounded-lg border border-default overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-elevated text-text-muted">
                <th className="px-3 py-2 text-left">Test</th>
                <th className="px-3 py-2 text-left">Result</th>
                <th className="px-3 py-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {results.contaminants.map((c) => {
                const isFail = c.result === 'fail';
                return (
                  <tr
                    key={c.type}
                    className="border-t border-default"
                    style={highlightFailures && isFail ? { backgroundColor: 'rgba(239, 68, 68, 0.1)' } : undefined}
                  >
                    <td className="px-3 py-2 text-text-default">{c.type}</td>
                    <td className="px-3 py-2">
                      <StatusBadge
                        label={c.result}
                        variant={isFail ? 'danger' : 'success'}
                        size="sm"
                      />
                    </td>
                    <td className="px-3 py-2 text-text-muted text-xs">{c.value ?? '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Moisture */}
        <div className="flex items-center justify-between text-sm pt-1">
          <span className="text-text-muted">Moisture Content</span>
          <span
            className="font-medium"
            style={{
              color: highlightFailures && results.moistureContent > 13 ? '#EF4444' : 'var(--text-text-default)',
            }}
          >
            {results.moistureContent}%
          </span>
        </div>
      </div>
    </div>
  );
}
