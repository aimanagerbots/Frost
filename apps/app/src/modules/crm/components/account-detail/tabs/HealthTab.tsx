'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { ChartWrapper, CHART_THEME, StatusBadge, LoadingSkeleton } from '@/components';
import { useAccountHealth } from '../../../hooks';
import { InteractionOrderOverlay } from '../../dashboard/charts/InteractionOrderOverlay';
import { getInteractionOrderData } from '@/mocks/crm-kpi-charts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface HealthTabProps {
  accountId: string;
}

function scoreColor(score: number): string {
  if (score >= 80) return '#00E5A0';
  if (score >= 60) return '#38BDF8';
  if (score >= 40) return '#5BB8E6';
  return '#FB7185';
}

function impactIcon(impact: 'positive' | 'negative' | 'neutral') {
  switch (impact) {
    case 'positive': return <TrendingUp className="h-4 w-4 text-success" />;
    case 'negative': return <TrendingDown className="h-4 w-4 text-danger" />;
    default: return <Minus className="h-4 w-4 text-text-muted" />;
  }
}

function priorityVariant(priority: string) {
  switch (priority) {
    case 'high': return 'danger' as const;
    case 'medium': return 'warning' as const;
    default: return 'info' as const;
  }
}

export function HealthTab({ accountId }: HealthTabProps) {
  const { data: health, isLoading } = useAccountHealth(accountId);

  if (isLoading || !health) return <LoadingSkeleton variant="card" count={2} />;

  const color = scoreColor(health.score);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Score + Sparkline */}
        <div className="rounded-xl bg-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-5xl font-bold" style={{ color }}>{health.score}</div>
              <div className="mt-1 text-sm text-text-muted">
                Health Score &middot;{' '}
                <span className={health.trend === 'improving' ? 'text-success' : health.trend === 'declining' ? 'text-danger' : 'text-text-muted'}>
                  {health.trend}
                </span>
              </div>
            </div>
            <div className="h-16 w-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={health.history}>
                  <Line type="monotone" dataKey="score" stroke={color} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Score History Chart */}
        <ChartWrapper title="Score History" height={150}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={health.history}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
              <XAxis
                dataKey="date"
                tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
                tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'short' })}
                axisLine={{ stroke: CHART_THEME.gridColor }}
                tickLine={{ stroke: CHART_THEME.gridColor }}
              />
              <YAxis domain={[0, 100]} tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} axisLine={{ stroke: CHART_THEME.gridColor }} tickLine={{ stroke: CHART_THEME.gridColor }} />
              <Tooltip
                contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 8, color: CHART_THEME.tooltipText }}
              />
              <Line type="monotone" dataKey="score" stroke={color} strokeWidth={2} dot={{ fill: color, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      {/* Factors */}
      <div className="rounded-xl bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-text-bright">Health Factors</h3>
        <div className="space-y-2">
          {health.factors.map((factor) => (
            <div key={factor.label} className="flex items-center gap-3 rounded-lg bg-elevated px-3 py-2">
              {impactIcon(factor.impact)}
              <span className="flex-1 text-sm text-text-default">{factor.label}</span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-20 rounded-full bg-base">
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${factor.score}%`, backgroundColor: scoreColor(factor.score) }}
                  />
                </div>
                <span className="w-8 text-right text-xs font-medium text-text-default">{factor.score}</span>
              </div>
              <span className="text-xs text-text-muted">w:{factor.weight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interaction vs Order Overlay */}
      <InteractionOrderOverlay data={getInteractionOrderData(accountId)} />

      {/* AI Recommendations */}
      <div className="rounded-xl bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-text-bright">AI Recommendations</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {health.recommendations.map((rec) => (
            <div key={rec.title} className="rounded-lg border border-default/50 bg-elevated p-4">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-medium text-text-bright">{rec.title}</h4>
                <StatusBadge variant={priorityVariant(rec.priority)} label={rec.priority} size="sm" />
              </div>
              <p className="text-xs text-text-muted">{rec.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
