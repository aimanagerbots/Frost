'use client';

import { useState, useMemo, useCallback } from 'react';
import { Target } from 'lucide-react';
import { MetricCard, KanbanBase, LoadingSkeleton, EmptyState } from '@/components';
import { useOpportunities } from '../../hooks';
import { useAccounts } from '../../hooks';
import type { Opportunity } from '../../types';
import { OpportunityCard } from './OpportunityCard';
import { OpportunityDrawer } from './OpportunityDrawer';

const CRM_ACCENT = '#F59E0B';

type ViewType = 'all' | 'new-account' | 'reorder' | 'category-expansion';

const UNIVERSAL_STAGES = [
  { id: 'early', title: 'Early', color: '#94A3B8' },
  { id: 'engaged', title: 'Engaged', color: '#3B82F6' },
  { id: 'committed', title: 'Committed', color: '#F59E0B' },
  { id: 'won', title: 'Won', color: '#22C55E' },
  { id: 'lost', title: 'Lost', color: '#EF4444' },
];

// Map raw stage names to universal stages
function mapToUniversalStage(stage: string): string {
  const s = stage.toLowerCase();
  if (['prospect', 'outreach', 'identified', 'proposed'].some((k) => s.includes(k))) return 'early';
  if (['contacted', 'meeting', 'sample', 'pitched', 'proposal sent'].some((k) => s.includes(k))) return 'engaged';
  if (['negotiation', 'verbal commit', 'order placed', 'first order', 'committed'].some((k) => s.includes(k))) return 'committed';
  if (['won', 'closed', 'delivered'].some((k) => s.includes(k))) return 'won';
  if (['lost', 'rejected', 'dead'].some((k) => s.includes(k))) return 'lost';
  return 'early';
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);
}

export function OpportunitiesPipeline() {
  const { data: opportunities, isLoading: oppsLoading } = useOpportunities();
  const { data: accounts } = useAccounts();
  const [viewType, setViewType] = useState<ViewType>('all');
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [localOpps, setLocalOpps] = useState<Opportunity[] | null>(null);

  // Stable reference date for computing days
  const [now] = useState(() => Date.now());

  // Use local state if drag has happened, otherwise use query data
  const opps = useMemo(() => localOpps ?? opportunities ?? [], [localOpps, opportunities]);

  const filteredOpps = useMemo(() => {
    if (viewType === 'all') return opps;
    return opps.filter((o) => o.type === viewType);
  }, [opps, viewType]);

  // Build account name lookup
  const accountNames = useMemo(() => {
    const map = new Map<string, string>();
    accounts?.forEach((a) => map.set(a.id, a.name));
    return map;
  }, [accounts]);

  // Compute metrics
  const metrics = useMemo(() => {
    const total = opps.reduce((s, o) => s + o.estimatedValue, 0);
    const weighted = opps.reduce((s, o) => s + o.estimatedValue * (o.probability / 100), 0);
    const days = opps.map((o) =>
      Math.floor((now - new Date(o.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
    );
    const avgDays = days.length ? Math.round(days.reduce((s, d) => s + d, 0) / days.length) : 0;
    const wonCount = opps.filter((o) => mapToUniversalStage(o.stage) === 'won').length;
    const winRate = opps.length ? Math.round((wonCount / opps.length) * 100) : 0;
    return { total, weighted, avgDays, winRate, count: opps.length };
  }, [opps, now]);

  // Build kanban columns
  const columns = useMemo(() => {
    return UNIVERSAL_STAGES.map((stage) => ({
      id: stage.id,
      title: stage.title,
      color: stage.color,
      items: filteredOpps.filter((o) => mapToUniversalStage(o.stage) === stage.id),
    }));
  }, [filteredOpps]);

  const handleDragEnd = useCallback(
    (itemId: string, _fromCol: string, toCol: string) => {
      const stageMap: Record<string, string> = {
        early: 'Prospect',
        engaged: 'Contacted',
        committed: 'Negotiation',
        won: 'Won',
        lost: 'Lost',
      };
      const current = localOpps ?? opportunities ?? [];
      setLocalOpps(
        current.map((o) =>
          o.id === itemId ? { ...o, stage: stageMap[toCol] || o.stage } : o,
        ),
      );
    },
    [localOpps, opportunities],
  );

  if (oppsLoading) return <LoadingSkeleton variant="card" count={4} />;

  if (!opps.length) {
    return (
      <EmptyState
        icon={Target}
        title="No Opportunities"
        description="No opportunities in the pipeline yet."
        accentColor={CRM_ACCENT}
      />
    );
  }

  const viewOptions: { label: string; value: ViewType }[] = [
    { label: 'All', value: 'all' },
    { label: 'New Account', value: 'new-account' },
    { label: 'Reorder', value: 'reorder' },
    { label: 'Category Expansion', value: 'category-expansion' },
  ];

  return (
    <div className="space-y-4">
      {/* Metrics */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total Pipeline" value={formatCurrency(metrics.total)} accentColor={CRM_ACCENT} />
        <MetricCard label="Weighted Pipeline" value={formatCurrency(metrics.weighted)} accentColor="#3B82F6" />
        <MetricCard label="Avg Days to Close" value={`${metrics.avgDays}d`} accentColor="#8B5CF6" />
        <MetricCard label="Win Rate" value={`${metrics.winRate}%`} accentColor="#22C55E" />
      </div>

      {/* View toggle */}
      <div className="flex gap-1 rounded-lg bg-elevated p-1">
        {viewOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setViewType(opt.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              viewType === opt.value
                ? 'bg-card text-bright shadow-sm'
                : 'text-muted hover:text-default'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Kanban board */}
      <KanbanBase
        columns={columns}
        renderCard={(opp) => (
          <OpportunityCard
            opportunity={opp}
            accountName={accountNames.get(opp.accountId)}
            onClick={() => setSelectedOpp(opp)}
          />
        )}
        onDragEnd={handleDragEnd}
        emptyColumnMessage="No opportunities in this stage"
      />

      {/* Detail drawer */}
      <OpportunityDrawer
        opportunity={selectedOpp}
        accountName={selectedOpp ? accountNames.get(selectedOpp.accountId) : undefined}
        open={!!selectedOpp}
        onClose={() => setSelectedOpp(null)}
      />
    </div>
  );
}
