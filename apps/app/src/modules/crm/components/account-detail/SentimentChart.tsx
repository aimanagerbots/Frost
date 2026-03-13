'use client';

import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { LoadingSkeleton } from '@/components';
import { CHART_THEME } from '@/components';
import { interactions } from '@/mocks/crm';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SentimentChartProps {
  accountId: string;
}

interface MonthlyPoint {
  month: string;
  score: number;
}

interface SentimentData {
  currentScore: number;
  trend: 'improving' | 'stable' | 'declining';
  monthly: MonthlyPoint[];
  breakdown: { positive: number; neutral: number; negative: number };
}

/** Simple deterministic hash from string to number 0-1 */
function hashSeed(str: string, offset: number): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs((h + offset * 7919) % 1000) / 1000;
}

function sentimentValue(sentiment: 'positive' | 'neutral' | 'negative' | null, seed: number): number {
  switch (sentiment) {
    case 'positive': return 80 + Math.floor(seed * 15);   // 80-95
    case 'neutral': return 45 + Math.floor(seed * 20);    // 45-65
    case 'negative': return 15 + Math.floor(seed * 20);   // 15-35
    default: return 50;
  }
}

function computeSentimentData(accountId: string): SentimentData {
  const acctInteractions = interactions.filter((i) => i.accountId === accountId);

  let monthly: MonthlyPoint[];
  let breakdown = { positive: 0, neutral: 0, negative: 0 };
  let currentScore: number;
  let trend: 'improving' | 'stable' | 'declining';

  if (acctInteractions.length > 0) {
    // Count breakdown
    for (const int of acctInteractions) {
      if (int.sentiment === 'positive') breakdown.positive++;
      else if (int.sentiment === 'neutral') breakdown.neutral++;
      else if (int.sentiment === 'negative') breakdown.negative++;
    }

    // Group by month
    const byMonth = new Map<string, number[]>();
    for (let i = 0; i < acctInteractions.length; i++) {
      const d = new Date(acctInteractions[i].timestamp);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const val = sentimentValue(acctInteractions[i].sentiment, hashSeed(acctInteractions[i].id, i));
      if (!byMonth.has(key)) byMonth.set(key, []);
      byMonth.get(key)!.push(val);
    }

    // Average per month, sorted chronologically
    const sorted = Array.from(byMonth.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    monthly = sorted.map(([month, values]) => ({
      month,
      score: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
    }));

    // Current score = latest month average
    currentScore = monthly[monthly.length - 1].score;

    // Trend from last 2 months
    if (monthly.length >= 2) {
      const diff = monthly[monthly.length - 1].score - monthly[monthly.length - 2].score;
      trend = diff > 5 ? 'improving' : diff < -5 ? 'declining' : 'stable';
    } else {
      trend = 'stable';
    }
  } else {
    // No interactions — generate 6 months of deterministic mock data
    const months = ['2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03'];
    monthly = months.map((m, i) => ({
      month: m,
      score: 40 + Math.round(hashSeed(accountId, i) * 40),
    }));
    currentScore = monthly[monthly.length - 1].score;
    const idx = Math.abs(accountId.charCodeAt(accountId.length - 1)) % 3;
    trend = (['improving', 'stable', 'declining'] as const)[idx];
    breakdown = { positive: 0, neutral: 0, negative: 0 };
  }

  return { currentScore, trend, monthly, breakdown };
}

function scoreColor(score: number): string {
  if (score >= 70) return '#00E5A0';
  if (score >= 40) return '#38BDF8';
  return '#FB7185';
}

function trendIcon(t: 'improving' | 'stable' | 'declining') {
  switch (t) {
    case 'improving': return <TrendingUp className="h-4 w-4 text-success" />;
    case 'declining': return <TrendingDown className="h-4 w-4 text-danger" />;
    default: return <Minus className="h-4 w-4 text-text-muted" />;
  }
}

function trendColor(t: 'improving' | 'stable' | 'declining') {
  switch (t) {
    case 'improving': return 'text-success';
    case 'declining': return 'text-danger';
    default: return 'text-text-muted';
  }
}

export function SentimentChart({ accountId }: SentimentChartProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['crm', 'sentiment', accountId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return computeSentimentData(accountId);
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading || !data) return <LoadingSkeleton variant="card" count={1} />;

  const color = scoreColor(data.currentScore);
  const total = data.breakdown.positive + data.breakdown.neutral + data.breakdown.negative;

  return (
    <div className="rounded-xl bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold text-text-bright">Sentiment Analysis</h3>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Score + Trend */}
        <div className="flex items-start gap-4">
          <div>
            <div className="text-4xl font-bold" style={{ color }}>
              {data.currentScore}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-sm">
              {trendIcon(data.trend)}
              <span className={trendColor(data.trend)}>{data.trend}</span>
            </div>
          </div>

          {/* Sparkline */}
          <div className="h-16 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthly}>
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-text-muted uppercase tracking-wide">
            Interaction Sentiment
          </div>
          {total > 0 ? (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 rounded-full bg-base overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-green-400"
                    style={{ width: `${(data.breakdown.positive / total) * 100}%` }}
                  />
                </div>
                <span className="w-20 text-xs text-text-default">
                  Positive ({data.breakdown.positive})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 rounded-full bg-base overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-blue-400"
                    style={{ width: `${(data.breakdown.neutral / total) * 100}%` }}
                  />
                </div>
                <span className="w-20 text-xs text-text-default">
                  Neutral ({data.breakdown.neutral})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 rounded-full bg-base overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-red-400"
                    style={{ width: `${(data.breakdown.negative / total) * 100}%` }}
                  />
                </div>
                <span className="w-20 text-xs text-text-default">
                  Negative ({data.breakdown.negative})
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-text-muted">No interaction data available</p>
          )}
        </div>
      </div>

      {/* Full sparkline with axes */}
      {data.monthly.length > 2 && (
        <div className="mt-4 h-28">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.monthly}>
              <XAxis
                dataKey="month"
                tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
                tickFormatter={(m: string) => {
                  const [, month] = m.split('-');
                  const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                  return names[parseInt(month, 10) - 1] ?? m;
                }}
                axisLine={{ stroke: CHART_THEME.gridColor }}
                tickLine={{ stroke: CHART_THEME.gridColor }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
                axisLine={{ stroke: CHART_THEME.gridColor }}
                tickLine={{ stroke: CHART_THEME.gridColor }}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: CHART_THEME.tooltipBg,
                  border: `1px solid ${CHART_THEME.tooltipBorder}`,
                  borderRadius: 8,
                  color: CHART_THEME.tooltipText,
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
